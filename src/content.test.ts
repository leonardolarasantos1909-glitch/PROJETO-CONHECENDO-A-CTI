import { describe, expect, it } from 'vitest';
import { modules, searchModules, questions, scoreAnswers } from './content';
describe('Conteúdos e pesquisa',()=>{
 it('preserva os oito módulos e acrescenta acolhimento familiar e conteúdo para cada módulo educativo',()=>{expect(modules).toHaveLength(9);expect(modules.slice(0,8).map(m=>m.id)).toEqual(['acolhimento','rotinas','equipamentos','escalas','dispositivos','registros','quiz','biblioteca']);expect(modules[8].id).toBe('acolher-familia');expect(new Set(modules.map(m=>m.id)).size).toBe(9);for(const m of modules.slice(0,6)){expect(m.topics.length).toBeGreaterThan(0);for(const t of m.topics){expect(t.care).toBeTruthy();expect(t.risk).toBeTruthy();}}});
 it('localiza assunto interno sem exigir acentos ou caixa',()=>{expect(searchModules('GLICEMIA').map(m=>m.id)).toContain('rotinas');expect(searchModules('canula').map(m=>m.id)).toContain('equipamentos');expect(searchModules('inexistentezzz')).toHaveLength(0);expect(searchModules('caderno de bolso').map(m=>m.id)).toContain('biblioteca');expect(searchModules('imprimir').map(m=>m.id)).toContain('biblioteca');expect(searchModules('feridas').map(m=>m.id)).toContain('biblioteca');expect(searchModules('EVOLUCAO E ANOTACAO').map(m=>m.id)).toContain('biblioteca');expect(searchModules('Richmond').map(m=>m.id)).toContain('escalas');expect(searchModules('Cheyne-Stokes').map(m=>m.id)).toContain('escalas');expect(searchModules('Retração contínua').map(m=>m.id)).toContain('escalas');expect(searchModules('autorrelato confiável primeiro').map(m=>m.id)).toContain('escalas');expect(searchModules('PAV').map(m=>m.id)).toContain('rotinas');expect(searchModules('bundle de PAV').map(m=>m.id)).toContain('rotinas');expect(searchModules('bundle PAV').map(m=>m.id)).toContain('rotinas');expect(searchModules('pneumonia associada a ventilacao mecanica').map(m=>m.id)).toContain('rotinas');expect(searchModules('higiene oral').map(m=>m.id)).toContain('rotinas');});
});
describe('Quiz',()=>{
 it('oferece 32 perguntas distintas e alternativas sem duplicação',()=>{
  expect(questions).toHaveLength(32);
  const normalizeText=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  expect(new Set(questions.map(q=>normalizeText(q.text))).size).toBe(questions.length);
  for(const q of questions){expect(new Set(q.options.map(normalizeText)).size).toBe(4);expect(Number.isInteger(q.answer)).toBe(true);}
 });
 it('calcula acertos com respostas erradas e não respondidas',()=>{expect(scoreAnswers(questions,[])).toBe(0);expect(scoreAnswers(questions,questions.map(q=>q.answer))).toBe(questions.length);expect(scoreAnswers(questions,questions.map(q=>(q.answer+1)%4))).toBe(0);expect(scoreAnswers(questions,[questions[0].answer])).toBe(1);});
 it('mantém quatro alternativas, resposta válida e explicação por questão',()=>{for(const q of questions){expect(q.options).toHaveLength(4);expect(q.answer).toBeGreaterThanOrEqual(0);expect(q.answer).toBeLessThan(4);expect(q.explanation.length).toBeGreaterThan(20);}});
});
