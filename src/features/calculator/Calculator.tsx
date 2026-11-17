import { useEffect, useRef, useState } from "react";
import { calculate } from "./calculations";
const modes: Record<string, { label: string; fields: string[] }> = {
  math: {
    label: "Matemática e porcentagem",
    fields: ["Primeiro valor", "Segundo valor"],
  },
  pam: { label: "PAM estimada", fields: ["PAS (mmHg)", "PAD (mmHg)"] },
  balance: {
    label: "Balanço hídrico",
    fields: ["Entradas (mL)", "Saídas (mL)"],
  },
  urine: {
    label: "Diurese",
    fields: ["Volume (mL)", "Peso (kg)", "Tempo (h)"],
  },
  convert: { label: "Conversões", fields: ["Valor"] },
  drip: { label: "Gotejamento", fields: ["Volume (mL)", "Tempo"] },
};
export default function Calculator({ close }: { close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState("math"),
    [values, setValues] = useState(["", "", ""]),
    [operation, setOperation] = useState("+"),
    [conversion, setConversion] = useState("L → mL"),
    [time, setTime] = useState("h"),
    [factor, setFactor] = useState("20"),
    [result, setResult] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    const opener = document.activeElement;
    dialog.current?.showModal();
    return () => {
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, []);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = calculate(
        kind,
        values.slice(0, modes[kind].fields.length),
        kind === "math"
          ? operation
          : kind === "convert"
            ? conversion
            : `${time}:${factor}`,
      );
      setResult(
        `${r.value.toLocaleString("pt-BR", { maximumSignificantDigits: 12 })} ${r.unit}. ${r.note}`,
      );
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setResult("");
    }
  }
  return (
    <dialog
      ref={dialog}
      aria-labelledby="calculator-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <div className="dialog-top">
        <h2 id="calculator-title">Calculadora</h2>
        <button onClick={close} aria-label="Fechar calculadora">
          ✕
        </button>
      </div>
      <form onSubmit={submit} className="tool-form">
        <label>
          Cálculo
          <select
            value={kind}
            onChange={(e) => {
              setKind(e.target.value);
              setValues(["", "", ""]);
              setResult("");
              setError("");
            }}
          >
            {Object.entries(modes).map(([id, m]) => (
              <option key={id} value={id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        {modes[kind].fields.map((label, i) => (
          <label key={label}>
            {label}
            <input
              inputMode="decimal"
              value={values[i]}
              onChange={(e) => {
                setValues(values.map((v, j) => (j === i ? e.target.value : v)));
                setResult("");
                setError("");
              }}
            />
          </label>
        ))}
        {kind === "math" && (
          <label>
            Operação
            <select
              value={operation}
              onChange={(e) => {
                setOperation(e.target.value);
                setResult("");
              }}
            >
              {["+", "-", "×", "÷", "%"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        )}
        {kind === "convert" && (
          <label>
            Unidades
            <select
              value={conversion}
              onChange={(e) => {
                setConversion(e.target.value);
                setResult("");
              }}
            >
              {[
                "L → mL",
                "mL → L",
                "g → mg",
                "mg → g",
                "mg → µg",
                "µg → mg",
                "h → min",
                "min → h",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        )}
        {kind === "drip" && (
          <>
            <label>
              Unidade do tempo
              <select
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setResult("");
                }}
              >
                <option value="h">Horas</option>
                <option value="min">Minutos</option>
              </select>
            </label>
            <label>
              Fator do equipo
              <select
                value={factor}
                onChange={(e) => {
                  setFactor(e.target.value);
                  setResult("");
                }}
              >
                {[10, 15, 20, 60].map((f) => (
                  <option key={f} value={f}>
                    {f === 60
                      ? "Microgotas: 60 microgotas/mL"
                      : `Macrogotas: ${f} gotas/mL`}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        <button className="button">Calcular</button>
        {error && <p role="alert">{error}</p>}
        {result && <output aria-live="polite">{result}</output>}
      </form>
      <p className="muted">
        Ferramenta de cálculo. Confira entradas e resultados; não prescreve
        doses ou condutas. Valores apagados ao fechar.
      </p>
    </dialog>
  );
}
