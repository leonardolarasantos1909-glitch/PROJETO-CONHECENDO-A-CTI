export type EventKind =
  | "departure"
  | "arrival"
  | "pause"
  | "resume"
  | "cycle"
  | "shock"
  | "medicine"
  | "end";
export type RcpEvent = { kind: EventKind; at: number; label?: string };
export type Session = { id: string; events: RcpEvent[] };
export function record(
  session: Session,
  kind: EventKind,
  at: number,
  label?: string,
): Session {
  const events = session.events,
    last = events.at(-1);
  if (!Number.isFinite(at) || at < 0 || (last && at < last.at))
    throw new Error("Horário inválido");
  const arrived = events.some((e) => e.kind === "arrival"),
    ended = last?.kind === "end";
  const active = events.reduce(
    (v, e) =>
      e.kind === "arrival" || e.kind === "resume"
        ? true
        : e.kind === "pause" || e.kind === "end"
          ? false
          : v,
    false,
  );
  if (
    ended ||
    (!last && kind !== "departure") ||
    (last && kind === "departure") ||
    (kind === "arrival" && (!last || arrived)) ||
    (["pause", "resume", "cycle", "shock", "medicine"].includes(kind) &&
      !arrived) ||
    (kind === "pause" && !active) ||
    (kind === "resume" && active) ||
    (kind === "medicine" && !label?.trim())
  )
    throw new Error("Evento não permitido nesta etapa");
  return {
    ...session,
    events: [
      ...events,
      { kind, at, ...(label ? { label: label.trim() } : {}) },
    ],
  };
}
export function summary(s: Session, now = Date.now()) {
  const arrival = s.events.find((e) => e.kind === "arrival")?.at,
    departure = s.events[0]?.at,
    end = s.events.find((e) => e.kind === "end")?.at ?? now;
  let compression = 0,
    active: number | undefined;
  for (const e of s.events) {
    if (e.kind === "arrival" || e.kind === "resume") active = e.at;
    if ((e.kind === "pause" || e.kind === "end") && active !== undefined) {
      compression += e.at - active;
      active = undefined;
    }
  }
  if (active !== undefined) compression += Math.max(0, end - active);
  const after = arrival === undefined ? 0 : Math.max(0, end - arrival);
  const medicines: Record<string, number> = Object.create(null);
  for (const e of s.events)
    if (e.kind === "medicine" && e.label)
      medicines[e.label] = (medicines[e.label] ?? 0) + 1;
  return {
    travel:
      departure === undefined ? 0 : Math.max(0, (arrival ?? end) - departure),
    after,
    compression,
    pause: Math.max(0, after - compression),
    fraction: after ? (compression / after) * 100 : 0,
    medicines,
    cycles: s.events.filter((e) => e.kind === "cycle").length,
    shocks: s.events.filter((e) => e.kind === "shock").length,
  };
}
export const duration = (ms: number) =>
  `${Math.floor(ms / 60000)
    .toString()
    .padStart(
      2,
      "0",
    )}:${Math.floor(ms / 1000) % 60 < 10 ? "0" : ""}${Math.floor(ms / 1000) % 60}`;
export function report(s: Session) {
  const t = summary(s);
  const labels: Record<EventKind, string> = {
    departure: "Início do deslocamento",
    arrival: "Chegada — início das compressões",
    pause: "Pausa nas compressões",
    resume: "Retomada das compressões",
    cycle: "Ciclo registrado",
    shock: "Choque registrado",
    medicine: "Medicamento registrado",
    end: "Sessão encerrada",
  };
  return [
    "CTI Conecta — registro manual de RCP",
    `Deslocamento: ${duration(t.travel)}`,
    `Após chegada: ${duration(t.after)}`,
    `Compressões registradas: ${duration(t.compression)}`,
    `Pausas registradas: ${duration(t.pause)}`,
    `Fração de compressão (registro manual): ${t.fraction.toFixed(1)}%`,
    `Ciclos: ${t.cycles}; choques: ${t.shocks}`,
    ...Object.entries(t.medicines).map(
      ([name, n]) => `${name}: ${n} registros`,
    ),
    ...s.events.map(
      (e) =>
        `${new Date(e.at).toLocaleString("pt-BR")} — ${labels[e.kind]}${e.label ? `: ${e.label}` : ""}`,
    ),
  ].join("\n");
}

let inMemorySession: Session | null = null;
export function currentSession(): Session {
  return inMemorySession ?? { id: crypto.randomUUID(), events: [] };
}
export function rememberSession(s: Session) {
  inMemorySession = s;
}
