export function numberInput(text: string): number {
  if (!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(text.trim()))
    throw new Error("Preencha todos os campos com números válidos.");
  const n = Number(text.trim().replace(",", "."));
  if (!Number.isFinite(n))
    throw new Error("Valor fora do intervalo permitido.");
  return n;
}
export function calculate(
  kind: string,
  values: string[],
  option = "",
): { value: number; unit: string; note: string } {
  const a = values.map(numberInput);
  const positive = (...indices: number[]) => {
    if (indices.some((i) => a[i] <= 0))
      throw new Error("Tempo, peso e fatores devem ser maiores que zero.");
  };
  if (kind !== "math" && a.some((n) => n < 0))
    throw new Error("Não use valores negativos.");
  let value = 0,
    unit = "",
    note = "";
  switch (kind) {
    case "math": {
      const [x, y] = a;
      switch (option) {
        case "+":
          value = x + y;
          break;
        case "-":
          value = x - y;
          break;
        case "×":
          value = x * y;
          break;
        case "÷":
          if (y === 0) throw new Error("Divisão por zero.");
          value = x / y;
          break;
        case "%":
          value = (x * y) / 100;
          break;
        default:
          throw new Error("Selecione a operação.");
      }
      break;
    }
    case "pam":
      if (a[0] < a[1])
        throw new Error("A sistólica não pode ser menor que a diastólica.");
      value = (a[0] + 2 * a[1]) / 3;
      unit = "mmHg";
      note =
        "PAM estimada = (PAS + 2 × PAD) ÷ 3. Não equivale à medida invasiva.";
      break;
    case "balance":
      value = a[0] - a[1];
      unit = "mL";
      note = "Entradas menos saídas no mesmo período.";
      break;
    case "urine":
      positive(1, 2);
      value = a[0] / a[1] / a[2];
      unit = "mL/kg/h";
      note = "Volume ÷ peso ÷ duração em horas.";
      break;
    case "convert": {
      const factors: Record<string, number> = {
        "L → mL": 1000,
        "mL → L": 0.001,
        "g → mg": 1000,
        "mg → g": 0.001,
        "mg → µg": 1000,
        "µg → mg": 0.001,
        "h → min": 60,
        "min → h": 1 / 60,
      };
      if (!Object.hasOwn(factors, option))
        throw new Error("Selecione uma conversão.");
      value = a[0] * factors[option];
      unit = option.split(" → ")[1];
      note = "Conversão de unidades, sem conversão de concentração ou dose.";
      break;
    }
    case "drip": {
      positive(1);
      const [time, factor] = option.split(":");
      const f = Number(factor);
      if (![10, 15, 20, 60].includes(f) || !["h", "min"].includes(time))
        throw new Error("Equipo ou unidade inválidos.");
      value = (a[0] * f) / (a[1] * (time === "h" ? 60 : 1));
      unit = f === 60 ? "microgotas/min" : "gotas/min";
      note = `Volume × fator ÷ tempo em minutos. Arredondado: ${Math.round(value)} ${unit}.${value > 0 && Math.round(value) === 0 ? " O valor calculado é menor que 0,5; não interpretar o arredondamento como ausência de fluxo." : ""} Confira o fator na embalagem do equipo.`;
      break;
    }
    default:
      throw new Error("Cálculo desconhecido.");
  }
  if (!Number.isFinite(value))
    throw new Error("Resultado não finito. Confira os valores.");
  return { value, unit, note };
}
