import { useId } from 'react';
import { ArrowRight, ClipboardCheck, GraduationCap, Users } from 'lucide-react';
import './project-preparation.css';

export default function ProjectOverview() {
  const prefix = useId();
  return <section className="project-preparation project-overview" aria-labelledby={`${prefix}-title`}>
    <div className="preparation-intro"><GraduationCap size={27} aria-hidden="true"/><div><h2 id={`${prefix}-title`}>Um projeto acadêmico de acolhimento e aprendizagem</h2><p>Conhecendo a CTI integra um Projeto Baseado em Problemas (PBL) do curso Técnico em Enfermagem da Faculdade Moinhos de Vento.</p></div></div>
    <p>A proposta nasceu para apoiar estagiários que chegam à CTI Adulto. Durante o acompanhamento do estágio, foi identificada também a necessidade de ambientação de novos colaboradores de enfermagem, inclusive profissionais com experiência em outras instituições.</p>
    <p>O objetivo é organizar o acesso aos conteúdos educativos e ajudar cada pessoa a reconhecer o setor, formular dúvidas e conversar com a equipe. Esta versão foi preparada para demonstração e avaliação técnica de uma possível utilização institucional.</p>

    <div className="preparation-audiences">
      <article><GraduationCap size={25} aria-hidden="true"/><h3>Sou estagiário</h3><p>Primeiro dia, rotina, equipamentos, siglas, escalas, segurança, registros e discussão de situações fictícias com o preceptor.</p></article>
      <article><Users size={25} aria-hidden="true"/><h3>Sou novo colaborador</h3><p>Ambientação, organização do trabalho, comunicação, equipamentos e um roteiro de integração a ser contextualizado pela equipe responsável.</p></article>
    </div>
    <p>Os dois perfis usam a mesma base. A escolha destaca prioridades e pode ser alterada; os conteúdos educativos gerais continuam acessíveis, sem cadastro.</p>

    <div className="preparation-card">
      <h3>O que você pode explorar</h3>
      <ul><li><a href="#dicionario-clinico">Dicionário Clínico</a> com 30 patologias e condições críticas, cuidados do técnico e sinais de alerta; fichas pendentes de validação clínica.</li><li>Busca por assunto e Siglário dentro do aplicativo.</li><li>Checklists de ambientação, favoritos e retomada do caderno neste navegador.</li><li>Equipamentos ilustrados, box fictício e guias educativos de escalas.</li><li>Casos PBL, quiz e laboratório de anotações com fatos simulados.</li><li>PDFs, referências e acompanhamento das pendências de revisão.</li></ul>
    </div>

    <div className="preparation-status"><ClipboardCheck size={24} aria-hidden="true"/><div><strong>Demonstração educacional em avaliação</strong><p>O aplicativo não representa uma publicação oficialmente adotada ou validada pelo Hospital Moinhos de Vento. Não utiliza logotipo ou identidade visual institucional. A revisão profissional e a autorização institucional do aplicativo permanecem pendentes.</p></div></div>
    <p>Os materiais servem ao estudo e à ambientação. Não substituem supervisão, protocolos aplicáveis ou orientação da equipe. Concluir checklists e exercícios não comprova treinamento institucional obrigatório, certificação ou autorização para executar procedimentos.</p>

    <div className="preparation-card preparation-credits"><h3>Participação, créditos e revisão</h3><dl><div><dt>Participantes do projeto</dt><dd>Nomes a confirmar pelo responsável.</dd></div><div><dt>Orientação acadêmica</dt><dd>Nomes e créditos a confirmar.</dd></div><div><dt>Responsáveis pela revisão profissional</dt><dd>A definir.</dd></div><div><dt>Última revisão clínica do aplicativo</dt><dd>Sem data de revisão registrada.</dd></div></dl><p>Os créditos presentes nos documentos originais foram preservados. A atualização técnica do aplicativo não equivale à validação clínica desses materiais.</p></div>
    <div className="preparation-actions"><a className="preparation-button" href="#demonstracao">Iniciar demonstração guiada <ArrowRight size={17} aria-hidden="true"/></a><a className="preparation-link" href="#conteudos">Ver conteúdos e revisão <ArrowRight size={17} aria-hidden="true"/></a></div>
  </section>;
}
