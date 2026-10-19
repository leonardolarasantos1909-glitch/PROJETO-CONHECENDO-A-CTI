import { describe, expect, it } from 'vitest';
import { modules, searchModules, questions, scoreAnswers } from './content';
describe('Conteúdos e pesquisa',()=>{
 it('oferece oito módulos únicos e conteúdo para cada módulo educativo',()=>{expect(modules).toHaveLength(8);expect(new Set(modules.map(m=>m.id)).size).toBe(8);for(const m of modules.slice(0,6)){expect(m.topics.length).toBeGreaterThan(0);for(const t of m.topics){expect(t.care).toBeTruthy();expect(t.risk).toBeTruthy();}}});
 it('localiza assunto interno sem exigir acentos ou caixa',()=>{expect(searchModules('GLICEMIA').map(m=>m.id)).toContain('rotinas');expect(searchModules('canula').map(m=>m.id)).toContain('equipamentos');expect(searchModules('inexistentezzz')).toHaveLength(0);expect(searchModules('caderno de bolso').map(m=>m.id)).toContain('biblioteca');expect(searchModules('imprimir').map(m=>m.id)).toContain('biblioteca');expect(searchModules('feridas').map(m=>m.id)).toContain('biblioteca');expect(searchModules('EVOLUCAO E ANOTACAO').map(m=>m.id)).toContain('biblioteca');expect(searchModules('Richmond').map(m=>m.id)).toContain('escalas');expect(searchModules('autorrelato confiável primeiro').map(m=>m.id)).toContain('escalas');});
});
describe('Quiz',()=>{
 it('calcula acertos com respostas erradas e não respondidas',()=>{expect(scoreAnswers(questions,[])).toBe(0);expect(scoreAnswers(questions,questions.map(q=>q.answer))).toBe(questions.length);expect(scoreAnswers(questions,questions.map(q=>(q.answer+1)%4))).toBe(0);expect(scoreAnswers(questions,[questions[0].answer])).toBe(1);});
 it('mantém quatro alternativas, resposta válida e explicação por questão',()=>{for(const q of questions){expect(q.options).toHaveLength(4);expect(q.answer).toBeGreaterThanOrEqual(0);expect(q.answer).toBeLessThan(4);expect(q.explanation.length).toBeGreaterThan(20);}});
});
