/** Four-operation calculator. Values stay in memory; no expression is executed as code. */
export const MAX_INPUT_DIGITS = 15;
export const MAX_EXPRESSION_LENGTH = 120;
export const RESULT_DECIMAL_PLACES = 12;
export const MAX_RESULT_INTEGER_DIGITS = 15;

export type CalculatorState = {
  expression: string;
  result: string | null;
  evaluated: boolean;
  error: string | null;
};

type Fraction = { numerator: bigint; denominator: bigint };
type Operator = '+' | '-' | '*' | '/';
type Operand = { start: number; text: string };

const incompleteMessage = 'Complete a conta com um número antes de calcular.';
const divisionMessage = 'Não é possível dividir por zero. Apague, limpe ou comece outra conta.';
const inputMessage = `Use até ${MAX_INPUT_DIGITS} dígitos em cada número.`;
const expressionMessage = 'A conta chegou ao limite de tamanho. Calcule ou apague antes de continuar.';
const resultMessage = `O resultado ultrapassa ${MAX_RESULT_INTEGER_DIGITS} dígitos inteiros. Use números menores.`;
const operators = new Set<string>(['+', '-', '*', '/']);

export function createCalculatorState(): CalculatorState {
  return { expression: '', result: null, evaluated: false, error: null };
}

function abs(value: bigint): bigint { return value < 0n ? -value : value; }

function fraction(numerator: bigint, denominator: bigint): Fraction {
  if (denominator === 0n) throw new Error(divisionMessage);
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  let a = abs(numerator);
  let b = denominator;
  while (b !== 0n) { const remainder = a % b; a = b; b = remainder; }
  return { numerator: numerator / a, denominator: denominator / a };
}

function numberFraction(text: string): Fraction {
  if (!/^-?\d+(?:\.\d*)?$/.test(text)) throw new Error(incompleteMessage);
  const negative = text.startsWith('-');
  const unsigned = negative ? text.slice(1) : text;
  const [whole, decimals = ''] = unsigned.split('.');
  const numerator = BigInt(whole + decimals) * (negative ? -1n : 1n);
  return fraction(numerator, 10n ** BigInt(decimals.length));
}

function calculate(left: Fraction, operator: Operator, right: Fraction): Fraction {
  switch (operator) {
    case '+': return fraction(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
    case '-': return fraction(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
    case '*': return fraction(left.numerator * right.numerator, left.denominator * right.denominator);
    case '/': return fraction(left.numerator * right.denominator, left.denominator * right.numerator);
  }
}

/** Parse only the calculator's decimal numbers and four operators. */
function evaluate(expression: string): Fraction {
  if (!expression || expression.length > MAX_EXPRESSION_LENGTH) throw new Error(incompleteMessage);
  const numbers: Fraction[] = [];
  const operationList: Operator[] = [];
  let index = 0;
  let expectingNumber = true;
  while (index < expression.length) {
    if (expectingNumber) {
      const start = index;
      if (expression[index] === '-') index++;
      const digitStart = index;
      while (index < expression.length && /\d/.test(expression[index])) index++;
      if (index === digitStart) throw new Error(incompleteMessage);
      if (expression[index] === '.') {
        index++;
        while (index < expression.length && /\d/.test(expression[index])) index++;
      }
      numbers.push(numberFraction(expression.slice(start, index)));
    } else {
      const operator = expression[index];
      if (!operators.has(operator)) throw new Error(incompleteMessage);
      operationList.push(operator as Operator);
      index++;
    }
    expectingNumber = !expectingNumber;
  }
  if (expectingNumber || numbers.length !== operationList.length + 1) throw new Error(incompleteMessage);

  // Resolve × and ÷ first, from left to right, then addition and subtraction.
  const terms: Fraction[] = [];
  const sums: ('+' | '-')[] = [];
  let term = numbers[0];
  for (let position = 0; position < operationList.length; position++) {
    const operator = operationList[position];
    const next = numbers[position + 1];
    if (operator === '*' || operator === '/') term = calculate(term, operator, next);
    else { terms.push(term); sums.push(operator); term = next; }
  }
  terms.push(term);
  return sums.reduce((total, operator, position) => calculate(total, operator, terms[position + 1]), terms[0]);
}

/** Round once at the end, half away from zero, without binary floating-point error. */
function formatResult(value: Fraction): string {
  const scale = 10n ** BigInt(RESULT_DECIMAL_PLACES);
  const unsigned = abs(value.numerator) * scale;
  let scaled = unsigned / value.denominator;
  if ((unsigned % value.denominator) * 2n >= value.denominator) scaled++;
  const whole = (scaled / scale).toString();
  if (whole.length > MAX_RESULT_INTEGER_DIGITS) throw new Error(resultMessage);
  const decimals = (scaled % scale).toString().padStart(RESULT_DECIMAL_PLACES, '0').replace(/0+$/, '');
  return `${value.numerator < 0n && scaled !== 0n ? '-' : ''}${whole}${decimals ? `.${decimals}` : ''}`;
}

function lastOperand(expression: string): Operand | null {
  const match = /-?\d+(?:\.\d*)?$/.exec(expression);
  if (!match) return null;
  let start = match.index;
  let text = match[0];
  // In 12-3 the first minus is binary; in 12--3 the last minus is a sign.
  if (text.startsWith('-') && start > 0 && /[\d.]/.test(expression[start - 1])) {
    start++;
    text = text.slice(1);
  }
  return { start, text };
}

function editable(state: CalculatorState): CalculatorState {
  return { expression: state.evaluated ? state.result ?? '' : state.expression, result: null, evaluated: false, error: null };
}

function update(state: CalculatorState, expression: string): CalculatorState {
  if (expression.length > MAX_EXPRESSION_LENGTH) return { ...state, error: expressionMessage };
  return { expression, result: null, evaluated: false, error: null };
}

export function pressCalculatorKey(state: CalculatorState, requestedKey: string): CalculatorState {
  const key = requestedKey === ',' ? '.' : requestedKey === '×' ? '*' : requestedKey === '÷' ? '/' : requestedKey;
  if (key === 'clear') return createCalculatorState();
  if (key === 'backspace') {
    const base = editable(state);
    let shortened = base.expression.slice(0, -1);
    // Removing the last digit of a signed operand must not leave two pending operators.
    if (shortened.endsWith('-') && (shortened.length === 1 || operators.has(shortened[shortened.length - 2]))) shortened = shortened.slice(0, -1);
    return update(base, shortened);
  }
  if (key === '=') {
    if (state.evaluated) return state;
    try { return { ...state, result: formatResult(evaluate(state.expression)), evaluated: true, error: null }; }
    catch (error) { return { ...state, result: null, evaluated: false, error: error instanceof Error ? error.message : incompleteMessage }; }
  }
  if (key === 'sign') {
    const base = editable(state);
    const operand = lastOperand(base.expression);
    if (!operand) return update(base, `${base.expression}-0`);
    const signed = operand.text.startsWith('-') ? operand.text.slice(1) : `-${operand.text}`;
    return update(base, base.expression.slice(0, operand.start) + signed);
  }
  if (operators.has(key)) {
    const base = editable(state);
    if (!base.expression) return key === '-' ? update(base, '-0') : base;
    if (!lastOperand(base.expression)) return update(base, base.expression.slice(0, -1) + key);
    return update(base, base.expression + key);
  }
  if (/^\d$/.test(key) || key === '.') {
    const base = state.evaluated || state.error ? createCalculatorState() : editable(state);
    const operand = lastOperand(base.expression);
    if (key === '.') {
      if (operand?.text.includes('.')) return base;
      return update(base, base.expression + (operand ? '.' : '0.'));
    }
    if (operand && /^-?0$/.test(operand.text)) {
      return update(base, base.expression.slice(0, operand.start) + (operand.text.startsWith('-') ? '-' : '') + key);
    }
    if (operand && operand.text.replace(/\D/g, '').length >= MAX_INPUT_DIGITS) return { ...base, error: inputMessage };
    return update(base, base.expression + key);
  }
  return state;
}

function formattedExpression(expression: string): string {
  return [...expression].map((character, index) => {
    if (character === '.') return ',';
    if (character === '*') return ' × ';
    if (character === '/') return ' ÷ ';
    if (character === '+') return ' + ';
    if (character === '-') return index === 0 || operators.has(expression[index - 1]) ? '−' : ' − ';
    return character;
  }).join('').trim();
}

export function calculatorDisplay(state: CalculatorState): string {
  if (state.error) return 'Erro';
  const value = state.evaluated ? state.result ?? '0' : lastOperand(state.expression)?.text ?? '0';
  return value.replace('.', ',').replace(/^-/, '−');
}

export function calculatorExpression(state: CalculatorState): string {
  return `${formattedExpression(state.expression)}${state.evaluated ? ' =' : ''}`;
}
