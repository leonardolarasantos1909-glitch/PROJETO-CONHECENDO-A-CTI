import { expect, it } from "vitest";
import { record, summary, report, type Session } from "./session";
it("separa deslocamento, compressões e pausa no relatório", () => {
  let s: Session = { id: "test", events: [] };
  for (const [kind, at, label] of [
    ["departure", 0],
    ["arrival", 10000],
    ["pause", 30000],
    ["shock", 32000],
    ["medicine", 33000, "Registro A"],
    ["medicine", 34000, "Registro A"],
    ["resume", 40000],
    ["cycle", 50000],
    ["end", 60000],
  ] as const)
    s = record(s, kind, at, label);
  const r = summary(s);
  expect(r.travel).toBe(10000);
  expect(r.compression).toBe(40000);
  expect(r.pause).toBe(10000);
  expect(r.fraction).toBe(80);
  expect(r.medicines["Registro A"]).toBe(2);
  expect(r.cycles).toBe(1);
  expect(r.shocks).toBe(1);
  expect(report(s)).toContain("registro manual");
  expect(() => record(s, "shock", 70000)).toThrow();
});
it("rejeita sequência impossível e preserva sessões anteriores", () => {
  const s: Session = { id: "a", events: [] };
  expect(() => record(s, "arrival", 0)).toThrow();
  const traveling = record(s, "departure", 0);
  expect(() => record(traveling, "pause", 1)).toThrow();
  const arrived = record(traveling, "arrival", 10);
  expect(() => record(arrived, "arrival", 20)).toThrow();
  expect(() => record(arrived, "medicine", 20, " ")).toThrow();
  expect(() => record(arrived, "pause", 5)).toThrow();
  expect(s.events).toHaveLength(0);
});
