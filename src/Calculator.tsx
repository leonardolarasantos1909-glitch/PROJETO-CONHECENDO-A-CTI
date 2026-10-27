import { useId, useState, type KeyboardEvent } from 'react';
import { Delete, Equal, Plus, Minus, X, Divide, Calculator as CalculatorIcon } from 'lucide-react';
import { calculatorDisplay, calculatorExpression, createCalculatorState, pressCalculatorKey } from './calculator';
import { FavoriteButton } from './Favorites';
import './calculator.css';

const keys = [
  { value: 'clear', text: 'Limpar', label: 'Limpar tudo', type: 'clear' },
  { value: 'backspace', icon: Delete, label: 'Apagar último dígito', type: 'control' },
  { value: 'sign', text: '+/−', label: 'Trocar sinal', type: 'control' },
  { value: '/', icon: Divide, label: 'Dividir', type: 'operator' },
  { value: '7', text: '7', label: '7' }, { value: '8', text: '8', label: '8' }, { value: '9', text: '9', label: '9' },
  { value: '*', icon: X, label: 'Multiplicar', type: 'operator' },
  { value: '4', text: '4', label: '4' }, { value: '5', text: '5', label: '5' }, { value: '6', text: '6', label: '6' },
  { value: '-', icon: Minus, label: 'Subtrair', type: 'operator' },
  { value: '1', text: '1', label: '1' }, { value: '2', text: '2', label: '2' }, { value: '3', text: '3', label: '3' },
  { value: '+', icon: Plus, label: 'Somar', type: 'operator' },
  { value: '0', text: '0', label: '0', type: 'zero' },
  { value: ',', text: ',', label: 'Vírgula decimal' },
  { value: '=', icon: Equal, label: 'Igual', type: 'equals' },
];

export default function Calculator() {
  const [state, setState] = useState(createCalculatorState);
  const prefix = useId();
  const press = (key: string) => setState(previous => pressCalculatorKey(previous, key));
  function keyboard(event: KeyboardEvent<HTMLElement>) {
    if (event.ctrlKey || event.metaKey || event.altKey || event.nativeEvent.isComposing) return;
    if (event.target instanceof HTMLElement && (event.target.closest('input,textarea,select,a') || event.target.isContentEditable)) return;
    const key = /^\d$/.test(event.key) || ['+', '-', '*', '/', '.', ',', '='].includes(event.key) ? event.key
      : event.key === 'Backspace' || event.key === 'Delete' ? 'backspace' : event.key === 'Escape' ? 'clear'
        : event.key === 'Enter' && !(event.target instanceof HTMLButtonElement) ? '=' : null;
    if (!key) return;
    event.preventDefault();
    press(key);
  }
  return <section className="basic-calculator" aria-labelledby={`${prefix}-title`} onKeyDown={keyboard}>
    <div className="calculator-intro"><CalculatorIcon size={25} aria-hidden="true"/><div><h2 id={`${prefix}-title`}>Faça suas contas</h2><p>Use os botões ou o teclado para calcular. As contas ficam apenas nesta tela.</p></div></div>
    <FavoriteButton id="tool.calculadora"/>
    <div className="calculator-panel" tabIndex={0} aria-label="Calculadora comum" aria-describedby={`${prefix}-help`}>
      <div className="calculator-screen">
        <p className="calculator-expression" aria-label="Conta digitada">{calculatorExpression(state) || '0'}</p>
        <output className="calculator-display" aria-label="Visor da calculadora" aria-live="polite" aria-atomic="true">{calculatorDisplay(state)}</output>
      </div>
      <p className="calculator-message" role="status" aria-live="polite">{state.error || '\u00a0'}</p>
      <div className="calculator-keys" role="group" aria-label="Teclado da calculadora">{keys.map(key => {
        const Icon = key.icon;
        return <button key={key.value} type="button" className={`calculator-key${key.type ? ` calculator-key-${key.type}` : ''}`} aria-label={key.label} onClick={() => press(key.value)}>{Icon ? <Icon size={23} aria-hidden="true"/> : key.text}</button>;
      })}</div>
    </div>
    <p className="calculator-help" id={`${prefix}-help`}>Multiplicação e divisão são calculadas antes de soma e subtração. Resultados podem ser arredondados a até 12 casas decimais.</p>
    <details className="calculator-shortcuts"><summary>Como usar o teclado</summary><p>Selecione a calculadora ou um dos seus botões e digite números, +, −, * ou /. Use ponto ou vírgula nos decimais. Enter confirma a conta quando o painel está selecionado; em um botão, Enter aciona esse botão. Backspace apaga e Esc limpa tudo.</p></details>
  </section>;
}
