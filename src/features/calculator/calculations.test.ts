import { describe, it, expect } from "vitest";
import { calculate, numberInput } from "./calculations";
describe("Cálculos e validações", () => {
  it("aceita vírgula e rejeita vazios, códigos e valores não finitos", () => {
    expect(numberInput(" 1,5 ")).toBe(1.5);
    for (const n of ["", " ", "Infinity", "NaN", "1e309", "1.2.3", "alert(1)"])
      expect(() => numberInput(n)).toThrow();
  });
  it("calcula operações e porcentagem sem avaliar código", () => {
    for (const [op, n] of [
      ["+", 30],
      ["-", 10],
      ["×", 200],
      ["÷", 2],
      ["%", 2],
    ] as const)
      expect(calculate("math", ["20", "10"], op).value).toBe(n);
    expect(() => calculate("math", ["1", "0"], "÷")).toThrow();
  });
  it("calcula PAM estimada, balanço e diurese com unidades", () => {
    expect(calculate("pam", ["120", "60"]).value).toBe(80);
    expect(calculate("balance", ["1500", "1800"]).value).toBe(-300);
    expect(calculate("urine", ["140", "70", "2"]).value).toBe(1);
    expect(() => calculate("pam", ["60", "120"])).toThrow();
  });
  it("converte somente unidades configuradas", () => {
    expect(calculate("convert", ["1,5"], "L → mL").value).toBe(1500);
    expect(calculate("convert", ["1000"], "µg → mg").value).toBe(1);
    expect(() => calculate("convert", ["2"], "ampola → mg")).toThrow();
  });
  it.each([10, 15, 20, 60])(
    "gotejamento com fator %i e tempo equivalente",
    (factor) => {
      expect(calculate("drip", ["500", "2"], `h:${factor}`).value).toBeCloseTo(
        (500 * factor) / 120,
      );
      expect(
        calculate("drip", ["500", "120"], `min:${factor}`).value,
      ).toBeCloseTo((500 * factor) / 120);
    },
  );
  it("identifica arredondamento pequeno sem esconder valor calculado", () => {
    const r = calculate("drip", ["1", "10"], "h:20");
    expect(r.value).toBeGreaterThan(0);
    expect(r.note).toContain("não interpretar");
  });
  it.each([
    ["", "1"],
    ["1", ""],
    ["-1", "2"],
    ["1", "0"],
    ["1", "-2"],
    ["Infinity", "2"],
  ])("rejeita gotejamento inválido %s/%s", (v, t) =>
    expect(() => calculate("drip", [v, t], "h:20")).toThrow(),
  );
  it("rejeita peso zero, entradas negativas e resultado não finito", () => {
    expect(() => calculate("urine", ["100", "0", "2"])).toThrow();
    expect(() => calculate("balance", ["-1", "2"])).toThrow();
    expect(() =>
      calculate("math", ["9".repeat(308), "9".repeat(308)], "×"),
    ).toThrow();
  });
});
