import { describe, expect, it } from 'vitest';
import {
  calculatorDisplay, calculatorExpression, createCalculatorState, MAX_EXPRESSION_LENGTH,
  MAX_INPUT_DIGITS, pressCalculatorKey, type CalculatorState,
} from './calculator';

const enter = (keys: string | string[], state = createCalculatorState()) => [...keys].reduce(pressCalculatorKey, state);
const result = (keys: string) => calculatorDisplay(enter(keys + '='));

describe('Calculadora comum offline', () => {
  it('soma, subtrai, multiplica e divide sem erro binário decimal', () => {
    expect(result('12+8')).toBe('20');
    expect(result('12-20')).toBe('−8');
    expect(result('12*8')).toBe('96');
    expect(result('12/8')).toBe('1,5');
    expect(result('0,1+0,2')).toBe('0,3');
    expect(result('0.1*0.2')).toBe('0,02');
    expect(result('0.3-0.2')).toBe('0,1');
  });

  it('respeita precedência, associatividade e precisão da expressão antes de arredondar', () => {
    expect(result('2+3*4')).toBe('14');
    expect(result('20-8/2+3*2')).toBe('22');
    expect(result('12/3/2')).toBe('2');
    expect(result('10-3-2')).toBe('5');
    expect(result('1/3*3')).toBe('1');
    expect(result('1/3')).toBe('0,333333333333');
    expect(result('2/3')).toBe('0,666666666667');
    expect(result('1/2000000000000')).toBe('0,000000000001');
    expect(result('-1/2000000000000')).toBe('−0,000000000001');
  });

  it('aceita vírgula, ponto e símbolos de operação sem duplicar separador ou zeros', () => {
    expect(result(',5+,25')).toBe('0,75');
    expect(result('00012,,34')).toBe('12,34');
    expect(result('8÷2×3')).toBe('12');
    expect(result('12.')).toBe('12');
    expect(calculatorExpression(enter('12,5*2='))).toBe('12,5 × 2 =');
  });

  it('troca operadores repetidos e permite sinal em cada operando', () => {
    expect(result('12+*3')).toBe('36');
    expect(result('-5+2')).toBe('−3');
    expect(calculatorDisplay(enter(['1', '2', '-', '3', 'sign', '=']))).toBe('15');
    expect(calculatorDisplay(enter(['2', '*', 'sign', '3', '=']))).toBe('−6');
    expect(calculatorDisplay(enter(['5', 'sign', 'sign', '=']))).toBe('5');
    expect(calculatorDisplay(enter(['sign', '=']))).toBe('0');
  });

  it('encadeia resultado com operador e inicia outra conta ao digitar número', () => {
    const evaluated = enter('2+3=');
    expect(calculatorDisplay(enter('*4=', evaluated))).toBe('20');
    expect(calculatorDisplay(enter('42=', evaluated))).toBe('42');
    expect(calculatorDisplay(enter(',5=', evaluated))).toBe('0,5');
    expect(pressCalculatorKey(evaluated, '=')).toBe(evaluated);
    expect(calculatorDisplay(pressCalculatorKey(evaluated, 'sign'))).toBe('−5');
  });

  it('apaga caracteres e limpa tanto a entrada quanto o resultado', () => {
    expect(calculatorDisplay(enter(['1', '2', '.', '3', 'backspace']))).toBe('12,');
    expect(calculatorDisplay(enter(['1', '2', '=', 'backspace']))).toBe('1');
    expect(calculatorDisplay(enter(['-', '3', 'backspace']))).toBe('0');
    expect(calculatorDisplay(enter(['1', '2', '-', '3', 'sign', 'backspace', '*', '2', '=']))).toBe('24');
    expect(calculatorDisplay(enter(['backspace']))).toBe('0');
    expect(enter(['1', '2', '+', '3', '=', 'clear'])).toEqual(createCalculatorState());
  });

  it('informa divisão por zero e entrada incompleta, com recuperação por edição ou nova conta', () => {
    const division = enter('1/0=');
    expect(division.error).toContain('dividir por zero');
    expect(calculatorDisplay(division)).toBe('Erro');
    expect(calculatorDisplay(enter(['backspace', '2', '='], division))).toBe('0,5');
    expect(calculatorDisplay(enter('9+1=', division))).toBe('10');
    const incomplete = enter('5+=');
    expect(incomplete.error).toContain('Complete a conta');
    expect(calculatorDisplay(enter('*2=', incomplete))).toBe('10');
    expect(enter('=').error).toContain('Complete a conta');
    expect(pressCalculatorKey(division, 'clear')).toEqual(createCalculatorState());
  });

  it('limita a entrada, a expressão e o resultado sem exibir Infinity ou notação científica', () => {
    expect(enter('9'.repeat(MAX_INPUT_DIGITS)).error).toBeNull();
    expect(enter('9'.repeat(MAX_INPUT_DIGITS + 1)).error).toContain('dígitos');
    const oversizedResult = enter('999999999999999+1=');
    expect(oversizedResult.error).toContain('resultado ultrapassa');
    const longExpression = '1+'.repeat(MAX_EXPRESSION_LENGTH / 2);
    const full = enter(longExpression);
    expect(full.expression.length).toBe(MAX_EXPRESSION_LENGTH);
    expect(pressCalculatorKey(full, '1').error).toContain('limite de tamanho');
    expect(result('0/2')).toBe('0');
    expect(result('1/999999999999999')).toBe('0');
  });

  it('ignora teclas inválidas e rejeita texto executável sem executar código', () => {
    const state = enter('12');
    for (const key of ['abc', '()', '<script>', 'Infinity', 'NaN', '1+2', '**']) expect(pressCalculatorKey(state, key)).toBe(state);
    const injected: CalculatorState = { ...createCalculatorState(), expression: 'globalThis.alert(1)' };
    expect(pressCalculatorKey(injected, '=').error).toContain('Complete a conta');
    expect(pressCalculatorKey({ ...injected, expression: '1e3+2' }, '=').error).toContain('Complete a conta');
  });

  it('conserva o estado anterior e evita zero negativo no resultado', () => {
    const state = createCalculatorState();
    const typed = pressCalculatorKey(state, '7');
    expect(state).toEqual(createCalculatorState());
    expect(typed).not.toBe(state);
    expect(result('-0*3')).toBe('0');
    expect(result('-1/999999999999999')).toBe('0');
  });
});
