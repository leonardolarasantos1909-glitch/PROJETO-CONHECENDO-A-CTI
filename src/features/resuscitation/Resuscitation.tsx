import { useEffect, useRef, useState } from "react";
import {
  currentSession,
  rememberSession,
  duration,
  record,
  report,
  summary,
  type Session,
  type EventKind,
} from "./session";
function readHistory(): Session[] {
  try {
    const data = JSON.parse(localStorage.getItem("cti-rcp-history-v1") ?? "[]");
    return Array.isArray(data)
      ? data
          .filter(
            (s) =>
              typeof s?.id === "string" &&
              Array.isArray(s.events) &&
              s.events.length > 0 &&
              s.events.every(
                (e: { kind: string; at: number; label?: unknown }) =>
                  [
                    "departure",
                    "arrival",
                    "pause",
                    "resume",
                    "cycle",
                    "shock",
                    "medicine",
                    "end",
                  ].includes(e.kind) &&
                  Number.isFinite(e.at) &&
                  (e.label === undefined || typeof e.label === "string"),
              ),
          )
          .slice(-30)
      : [];
  } catch {
    return [];
  }
}
export default function Resuscitation() {
  const [session, setSession] = useState<Session>(currentSession),
    [history, setHistory] = useState(readHistory),
    [now, setNow] = useState(Date.now()),
    [cycle, setCycle] = useState("120"),
    [medicine, setMedicine] = useState(""),
    [storage, setStorage] = useState(""),
    [sound, setSound] = useState(false),
    [reportText, setReportText] = useState("");
  const audio = useRef<AudioContext | null>(null),
    alertAt = useRef(0),
    lastAlert = useRef(0);
  useEffect(() => rememberSession(session), [session]);
  const arrived = session.events.some((e) => e.kind === "arrival"),
    ended = session.events.at(-1)?.kind === "end",
    started = session.events.length > 0,
    active =
      arrived &&
      !ended &&
      session.events
        .filter((e) => ["arrival", "pause", "resume"].includes(e.kind))
        .at(-1)?.kind !== "pause";
  const stats = summary(session, now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);
  useEffect(
    () => () => {
      void audio.current?.close();
    },
    [],
  );
  useEffect(() => {
    const seconds = Number(cycle);
    if (!active || !Number.isFinite(seconds) || seconds < 10 || seconds > 3600)
      return;
    const index = Math.floor(
      (stats.compression - alertAt.current) / 1000 / seconds,
    );
    if (index > lastAlert.current) {
      lastAlert.current = index;
      if (sound && audio.current?.state === "running") {
        const oscillator = audio.current.createOscillator(),
          gain = audio.current.createGain();
        gain.gain.value = 0.12;
        oscillator.connect(gain);
        gain.connect(audio.current.destination);
        oscillator.start();
        oscillator.stop(audio.current.currentTime + 0.4);
      }
    }
  }, [now, active, cycle, sound, stats.compression]);
  function add(kind: EventKind, label?: string) {
    const next = record(session, kind, Date.now(), label);
    setSession(next);
    if (kind === "end") {
      const updated = [...history, next].slice(-30);
      setHistory(updated);
      try {
        localStorage.setItem("cti-rcp-history-v1", JSON.stringify(updated));
        setStorage("Histórico salvo neste navegador.");
      } catch {
        setStorage(
          "Armazenamento indisponível. Exporte o relatório antes de sair.",
        );
      }
    }
  }
  function download(s: Session) {
    const text = report(s);
    setReportText(text);
    const href = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = href;
    a.download = `rcp-${s.id}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  }
  return (
    <section className="rcp panel">
      <h1>Registro de RCP</h1>
      {!started ? (
        <button className="button rcp-start" onClick={() => add("departure")}>
          Iniciar deslocamento
        </button>
      ) : (
        <>
          <div className="rcp-clock">
            {arrived ? "Após chegada" : "Deslocamento"}{" "}
            <strong>{duration(arrived ? stats.after : stats.travel)}</strong>
          </div>
          {!arrived && !ended && (
            <button className="rcp-arrival" onClick={() => add("arrival")}>
              Cheguei — iniciar compressões
            </button>
          )}
          {arrived && !ended && (
            <>
              <div className="tool-actions">
                <button
                  className="button"
                  onClick={() => add(active ? "pause" : "resume")}
                >
                  {active ? "Pausar compressões" : "Retomar compressões"}
                </button>
                <button onClick={() => add("cycle")}>
                  Registrar ciclo ({stats.cycles})
                </button>
                <button onClick={() => add("shock")}>
                  Registrar choque ({stats.shocks})
                </button>
              </div>
              <label>
                Ciclo de aviso (segundos)
                <input
                  type="number"
                  min="10"
                  max="3600"
                  value={cycle}
                  onChange={(e) => {
                    setCycle(e.target.value);
                    alertAt.current = stats.compression;
                    lastAlert.current = 0;
                  }}
                />
              </label>
              {(!Number.isFinite(Number(cycle)) ||
                Number(cycle) < 10 ||
                Number(cycle) > 3600) && (
                <p role="alert">
                  Use um intervalo de 10 a 3600 segundos para o aviso.
                </p>
              )}
              <button
                onClick={async () => {
                  try {
                    audio.current ??= new AudioContext();
                    await audio.current.resume();
                    setSound(true);
                  } catch {
                    setSound(false);
                  }
                }}
              >
                {sound ? "Áudio autorizado" : "Autorizar aviso sonoro"}
              </button>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (medicine.trim()) {
                    add("medicine", medicine);
                    setMedicine("");
                  }
                }}
              >
                <label>
                  Medicamento registrado (sem dados do paciente)
                  <input
                    value={medicine}
                    maxLength={80}
                    onChange={(e) => setMedicine(e.target.value)}
                  />
                </label>
                <button className="secondary" disabled={!medicine.trim()}>
                  Registrar administração
                </button>
              </form>
              <ul>
                {Object.entries(stats.medicines).map(([name, n]) => (
                  <li key={name}>
                    <button onClick={() => add("medicine", name)}>
                      {name}: {n} registros — registrar novamente
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}{" "}
          {!ended && (
            <button className="secondary" onClick={() => add("end")}>
              Encerrar sessão
            </button>
          )}
          {ended && (
            <div className="tool-actions">
              <button className="button" onClick={() => download(session)}>
                Gerar relatório
              </button>
              <button
                onClick={() => {
                  setSession({ id: crypto.randomUUID(), events: [] });
                  setReportText("");
                  alertAt.current = 0;
                  lastAlert.current = 0;
                }}
              >
                Iniciar nova RCP
              </button>
            </div>
          )}
        </>
      )}
      <p>
        Compressões: {duration(stats.compression)} · Pausas:{" "}
        {duration(stats.pause)} · Fração manual: {stats.fraction.toFixed(1)}%
      </p>
      {reportText && (
        <pre className="report" tabIndex={0}>
          {reportText}
        </pre>
      )}
      <h2>Histórico de sessões encerradas</h2>
      {history.length === 0 ? (
        <p>Nenhuma sessão encerrada neste navegador.</p>
      ) : (
        history.map((s) => (
          <button key={s.id} onClick={() => download(s)}>
            Relatório de {new Date(s.events[0].at).toLocaleString("pt-BR")}
          </button>
        ))
      )}
      {storage && <p role="status">{storage}</p>}
      <button
        onClick={() => {
          setHistory([]);
          try {
            localStorage.removeItem("cti-rcp-history-v1");
          } catch {
            setStorage("Não foi possível apagar o armazenamento.");
          }
        }}
      >
        Apagar histórico de RCP
      </button>
      <p className="muted">
        Registro manual, sem prescrição ou orientação de condutas. Não informe
        identificadores de pacientes. Não há apresentações institucionais
        confirmadas: nenhum atalho de ampola, dose ou concentração foi criado.
        Sessões em andamento ficam apenas na memória; sessões encerradas são
        salvas localmente quando permitido. O aviso depende do áudio autorizado
        e da execução do navegador; não substitui um temporizador clínico
        dedicado.
      </p>
    </section>
  );
}
