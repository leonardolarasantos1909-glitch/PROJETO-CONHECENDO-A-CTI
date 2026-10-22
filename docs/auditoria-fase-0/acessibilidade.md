> Anexo da Fase 0 consolidado em 22/10/2026. As datas internas registram a coleta; o código do aplicativo não foi alterado.

# Fase 0 — auditoria estática de acessibilidade

Base: `/workspace/PROJETO-CONHECENDO-A-CTI`, commit `02c5dddbc0c62ff781e27277373b15959e61e231`, em 21/10/2026. Inspeção de código e cálculo de contraste; nenhum arquivo do aplicativo, build ou publicação foi alterado. Esta análise não executou leitor de tela nem aparelho físico. A auditoria dinâmica está registrada no anexo navegador.md.

## Recursos já existentes

- Idioma `pt-BR` e viewport que permite ampliação em `index.html:1`.
- Landmarks `header`, `main`, `aside` e navegações com nomes distintos em `src/main.tsx:36–45`.
- Mudança de rota posiciona o foco no título ou na pesquisa inicial em `src/main.tsx:29`; acesso direto a material posiciona o foco no card em `src/main.tsx:31`.
- Diálogo nativo com `showModal()`, nome por `aria-labelledby`, fechamento por Escape e retorno ao elemento de origem em `src/main.tsx:47`. O browser deverá confirmar a operação na prática.
- Contorno visível de foco em links, botões, selects e inputs em `src/style.css:2`; regras adicionais locais nas ferramentas.
- Busca inicial com label explícito, região de pesquisa, anúncio de contagem, foco nos resultados ao enviar, preservação do foco durante digitação, e foco no primeiro item adicionado pela paginação em `src/HomeSearch.tsx:25–50,67–103,121–174`.
- Siglário com input de nome estável por `aria-label`, filtro associado, anúncio de contagem e foco na paginação; checklist com rótulos associados e progresso nativo em `src/StarterTools.tsx:28–44,76–130`.
- Favoritos com nomes que incluem o conteúdo e estado `aria-pressed` em `src/Favorites.tsx:25–31`.
- Casos com pergunta em `legend`, explicação em região de status, indicação textual de escolha/atitude esperada e foco no título ao avançar em `src/CaseStudies.tsx:20–25,44–47,79–94`.
- Escalas em tabs com `aria-selected`, tab/panel associados, apenas tab ativa na sequência de Tab, e teclas de seta/Home/End em `src/ScalesGuide.tsx:22–39,51–79`. Tabelas têm caption, cabeçalhos e scope em `src/ScalesGuide.tsx:114–121`.
- Desenhos educativos com SVG nomeado/descrito e legenda textual em lista em `src/EquipmentIllustration.tsx:104–121`.
- Livro com controles nomeados, contador anunciado, entrada com label, páginas não atuais com `inert`, texto alternativo/transcrição e preferência por movimento reduzido em `src/BookReader.tsx:10–18,177–190,212–249,273–276`.
- PDF com página de acesso sem iframe reduzido, botão de retorno, título focado e aviso de abertura externa em `src/PdfReader.tsx:8–24`.

## Problemas confirmados pela inspeção estática

### A11Y-01 — contraste de parte do texto abaixo do mínimo AA

O cálculo usa luminância relativa sRGB e a fórmula `(Lmais_clara + 0,05)/(Lmais_escura + 0,05)`. Para texto normal, o parâmetro de comparação WCAG 2.x AA é 4,5:1. Os textos abaixo não atingem o tamanho de texto grande; as cores foram extraídas dos seletores existentes, sem estimativa visual.

| Texto/seletores | Cor / fundo | Razão | Evidência |
| --- | --- | --- | --- |
| Descrição dos cards de módulos | `#7d887f` / `#ffffff` | **3,68:1** | `src/style.css:2`, `.module-card>p`, de 10 a 12 px; regras responsivas na linha 3 não substituem a cor. |
| Legenda da barra lateral | `#8b9492` / `#ffffff` | **3,11:1** | `src/style.css:2`, `.sidebar-caption`, 9 px. |
| Breadcrumb | `#79847f` / `#f9faf9` | **3,70:1** | `src/style.css:2`, `.breadcrumb`, 11 px, e fundo de `:root`. |
| Descrição da seção de módulos | `#839087` / `#f9faf9` | **3,18:1** | `src/style.css:2`, `.section-heading p`, 11 px. |
| Descrição geral das páginas | `#78877c` / `#f9faf9` | **3,61:1** | `src/style.css:2`, `.page-description`, 14 px. |
| Rodapé e aviso de revisão do projeto | `#8e978d` / `#f9faf9` | **2,88:1** | `src/style.css:2`, `footer`, 9 px. |
| Fontes pequenas no checklist/cartões | `#71816b` / `#ffffff` | **4,15:1** | `src/starter-tools.css:1`, `.starter-source`/`.starter-term-source`, 13 px. |
| Contagem/revisão em fundo geral do Siglário | `#71816b` / `#f9faf9` | **3,97:1** | `src/starter-tools.css:1`, `.starter-results`/`.starter-review`, 14 px. |

O texto principal das ferramentas recentes utiliza pares melhores, por exemplo `#617660` sobre branco = **4,92:1**, e os links laterais normais `#64706d` sobre branco = **5,15:1**. Portanto o problema é localizado e pode ser corrigido preservando a identidade visual, escurecendo os tons de texto secundário e conferindo estados e fundos reais em navegador. Não é possível declarar conformidade AA global da versão atual.

Prioridade sugerida: antes da demonstração institucional e antes de afirmar acessibilidade, incluindo o aviso de revisão clínica do rodapé, hoje pequeno e com contraste baixo.

### A11Y-02 — estado atual ausente da navegação principal/móvel

Em `src/main.tsx:36,45`, os links de sidebar e navegação móvel usam classe visual `active`, mas não possuem `aria-current="page"`. A navegação de ferramentas já usa esse atributo em `src/main.tsx:41`. Isso confirma que parte da informação de localização está disponível visualmente e não é exposta com a mesma semântica na navegação principal. Recomenda-se adicionar o estado sem alterar o layout; em links que representam o grupo Módulos, definir a política de seleção do grupo.

### A11Y-03 — identificação de resposta correta do quiz depende parcialmente de cor/ícone

Em `src/main.tsx:48`, as alternativas respondidas recebem classes `correct`/`incorrect` e a alternativa correta recebe SVG `Check`, mas não recebem texto de estado equivalente como "Sua escolha"/"Resposta esperada" nem atributos que as identifiquem programaticamente. O feedback geral informa se o usuário acertou e fornece uma explicação; a alternativa correta na lista, por sua vez, não recebe identificação textual acessível. Os casos simulados já resolvem essa diferença por rótulos explícitos em `src/CaseStudies.tsx:87`. Recomenda-se adotar o mesmo padrão no quiz. Validar o anúncio efetivo em leitor de tela antes de classificar uma falha formal de conformidade.

## Ponto de código a confirmar em navegador

### A11Y-R1 — foco do quiz ao avançar/refazer

`Quiz()` em `src/main.tsx:48` modifica `index`/`answers`, mas não posiciona foco no novo título/pergunta. O botão "Próxima questão" é removido quando a próxima pergunta ainda não foi respondida; o mesmo ocorre com "Refazer quiz". Isso cria risco de perda de foco para o `body`/início do documento. O componente de casos já tem tratamento explícito de foco. Reproduzir por teclado: responder, Tab até "Próxima questão", Enter, inspecionar `document.activeElement` e o destino do próximo Tab. Não classificar a reprodução como executada nesta análise estática.

## Melhorias e limites adicionais

- Não há atalho "Pular para o conteúdo" em `src/main.tsx`. Há landmark `main`, portanto a ausência isolada do atalho não prova falha WCAG; o atalho ajudaria pessoas que usam apenas teclado e precisam ultrapassar a navegação lateral repetida.
- O título do documento é fixo em `index.html:1`, sem atualização de `document.title` nas rotas. Atualizar o título por página pode melhorar histórico, abas e orientação, preservando o nome do aplicativo.
- A home apresenta a pesquisa com `h2` antes do `h1` da chamada de boas-vindas (`src/main.tsx:39`, `src/HomeSearch.tsx:62`). Revisar hierarquia sem retirar a busca prioritária.
- Atributos `aria-hidden` estão aplicados em diversos ícones decorativos, mas alguns ícones lucide no shell/quiz/links não os declaram. Uma revisão consistente pode reduzir ruído; não foi verificado o anúncio em leitor de tela físico.
- Parte da tipografia do shell usa 8–12 px. O tamanho sozinho não prova violação WCAG, mas reduz conforto de leitura e torna mais relevante a ampliação em 200%/400% e o teste em celulares reais.
- O select de filtro do quiz tem fonte 14 px (`src/style.css:14`), e o input numérico do livro, 13 px (`src/book-reader.css:1`). Fontes menores que 16 px podem provocar zoom automático no Safari iOS; isso é um risco de experiência a testar em aparelho físico, não um defeito de Safari reproduzido aqui.
- Livro e PDFs dependem também da acessibilidade dos documentos fornecidos. A transcrição de página em HTML ajuda na leitura, mas não constitui auditoria completa de tags/ordem de leitura/campos dos sete PDFs.
- Não foram executados NVDA, JAWS, VoiceOver, TalkBack, WebKit/Safari reais nem avaliação formal completa WCAG. A existência de ARIA e o sucesso de automação Chromium não substituem esses ensaios.

## Próximos passos propostos

1. Na Fase 1, corrigir os pares de contraste e expor `aria-current`; validar o foco e o feedback do quiz com testes específicos de teclado.
2. Preservar os componentes de busca, tabs e diálogo, que já têm cuidados relevantes; evitar recriar mecanismos que funcionam.
3. Incluir em cada funcionalidade nova os mesmos critérios de label, foco, status, contraste, targets e movimento reduzido.
4. Antes de homologar, testar em iPhone/Safari, Android/Chrome e leitor de tela, além de zoom e navegação exclusivamente por teclado.
