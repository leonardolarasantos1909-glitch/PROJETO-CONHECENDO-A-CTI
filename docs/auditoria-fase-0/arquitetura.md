> Anexo da Fase 0 consolidado em 22/10/2026. As datas internas registram a coleta; o código do aplicativo não foi alterado.

# Fase 0 — arquitetura, navegação e funcionalidades existentes

Base examinada: `02c5dddbc0c62ff781e27277373b15959e61e231` (v14). Auditoria estática e leitura dinâmica dos catálogos pelo Vite SSR, sem alterar fontes, build, Git ou produção. Os números abaixo foram obtidos dos objetos carregados, não inferidos de propostas. Testes de navegador, dependências e verificação clínica são tratados por outras frentes da auditoria.

## Estrutura e tecnologia

- Aplicativo estático React e TypeScript, compilado pelo Vite, com Tailwind CSS e Lucide. Versões instaladas no lockfile: React/React DOM 19.3.1; Lucide 0.468.0; Vite 6.4.4; Vitest 3.2.7; TypeScript 5.7.3; Tailwind e seu plugin Vite 4.3.3. As faixas declaradas estão em `package.json:12` e `package.json:17`.
- `src/main.tsx`: inicialização, roteamento por fragmento, shell, menus, página inicial, módulos, modal de assunto, página Sobre, quiz e registro do service worker. `App`, `Detail` e `Quiz` estão no mesmo arquivo; o JSX concentrado em linhas muito longas dificulta manutenção, embora isso não seja falha de execução demonstrada (`src/main.tsx:26`, `src/main.tsx:47`, `src/main.tsx:48`).
- `src/content.ts`: oito módulos, textos dos assuntos, seis fontes gerais e as oito questões originais. `src/extra-questions.ts` acrescenta 24 questões e um mapa de fontes para revisão editorial.
- Componentes especializados: `HomeSearch`, `StarterTools`, `Favorites`, `CaseStudies`, `ScalesGuide`, `EquipmentIllustration`, `PavGuide`, `PdfMaterials`, `ApostilaMaterials`, `BookReader`, `PdfReader`, `MobileInstructions`. Os leitores são carregados com `lazy`/`Suspense` (`src/main.tsx:21`).
- Dados separados: escalas (`scales.ts`), casos (`cases.ts`), diagramas (`equipment-diagrams.ts`), PAV (`pav.ts`), materiais (`materials.ts`/`apostilas.ts`), catálogo PDF (`pdf-catalog.ts`), livro (`book.ts`), armazenamento (`learning-storage.ts`), favoritos (`favorites.ts`), pesquisa (`search.ts`), checklist (`starter-data.ts`) e Siglário (`hospital-glossary.ts` + dois arquivos em `src/data/`).
- `public/`: manifestos e ícones, `_headers`, dois cadernos, cinco apostilas, 96 imagens WebP e manifesto/texto do livro. `scripts/`: conversão do caderno, estilo das apostilas, checagem de integridade e geração/testes do service worker. `docs/`: guias, inventários, referências e histórico de versões. `downloads/`: pacotes distribuídos e QR/cartaz; cerca de 692 MB na cópia atual, sem necessidade de carregar esse diretório no app publicado.
- Não há backend, login, área administrativa, banco, integração hospitalar ou coletor remoto de uso na arquitetura atual. Os scripts de build/teste são `package.json:6`; o projeto TypeScript usa `strict` (`tsconfig.json:1`).

## Inventário real

| Recurso | Quantidade atual | Evidência |
| --- | --- | --- |
| Módulos principais | 8 | `src/content.ts:10` |
| Assuntos nos módulos | 36 | `content.ts:11` a `content.ts:53`; inclui PAV |
| Questões de quiz | 32, em 8 assuntos | `content.ts:61`, `extra-questions.ts:10`, `content.test.ts:8` |
| Casos PBL | 5, com 2 decisões cada, total de 10 | `cases.ts:29`; UI `CaseStudies.tsx:50` |
| Escalas detalhadas | EVA, BPS, PAINAD, RASS | `scales.ts:39` |
| Glasgow | 1 assunto introdutório, fora das quatro abas detalhadas | `content.ts:37`, `main.tsx:40` |
| Desenhos educativos | 15, cobrindo 8 equipamentos e 7 dispositivos | `equipment-diagrams.ts:17`; `equipment-diagrams.test.tsx:8` |
| Siglário | 746 entradas; 745 formas textuais distintas; 11 notas | `hospital-glossary.ts`, `hospital-glossary.test.ts` |
| Checklist do primeiro dia | 10 itens | `starter-data.ts:10` |
| PDFs | 7: cadernos de 96 e 24 páginas; apostilas de 26, 33, 22, 42 e 24 páginas | `materials.ts:15`, `apostilas.ts:10`, `pdf-catalog.ts:6` |
| Livro virtual | 96 páginas, navegação horizontal, índice e retomada local | `BookReader.tsx:21`, `Favorites.tsx:46` |
| Índice da busca | 806 registros | `search.ts:38`; 8 módulos + 31 assuntos + 5 escalas + 746 termos + 4 ferramentas + 7 PDFs + 5 casos |
| Portais gerais na biblioteca | 6 | `content.ts:54` |

Os oito módulos são: acolhimento (4 assuntos), rotinas (7), equipamentos (8), escalas (5), dispositivos (7), anotações (5), quiz e biblioteca. As 32 questões têm assuntos Segurança, Registros, Ética, Escalas, Dispositivos, Equipamentos, Rotinas e Comunicação. Os cinco casos abordam alarme na mobilização, dúvida sobre sonda, comunicação de mudança, registro do cuidado e escolha/limites de escalas. Há um guia PAV de oito medidas, com fontes no próprio componente (`pav.ts:16`, `PavGuide.tsx:22`).

## Rotas e navegação

O app usa `location.hash` e escuta `hashchange`; não depende de biblioteca de router (`main.tsx:27-31`). Há 16 rotas-base:

| Rota | Conteúdo atual |
| --- | --- |
| `#inicio` e ausência de fragmento | Tela inicial, busca, jornada, atalhos, oito módulos e materiais |
| `#modulos` | Mesma tela da inicial, com busca e grade de módulos |
| `#acolhimento` | Bem-vindo à CTI e acesso ao checklist |
| `#rotinas` | Sete assuntos, incluindo PAV |
| `#equipamentos` | Oito assuntos, desenhos e apostilas relacionadas |
| `#escalas` | Quatro abas detalhadas + comparação + assunto Glasgow |
| `#dispositivos` | Sete assuntos, desenhos e apostilas relacionadas |
| `#registros` | Cinco exemplos/explicações de anotações |
| `#quiz` | Cinco casos PBL e quiz de 32 questões |
| `#biblioteca` | Dois cadernos, cinco apostilas e seis portais gerais |
| `#primeiro-dia` | Checklist marcável com progresso e reinício |
| `#glossario` | Nome visível Siglário; busca e filtro por inicial |
| `#favoritos` | Catálogo pessoal de conteúdos guardados localmente |
| `#caderno` | Livro de 96 páginas; retoma a página salva |
| `#pdf/<id>` | Compatibilidade com links antigos; acesso ao PDF original e botões de retorno |
| `#projeto` | Sobre, privacidade, construção/revisão, instalação e exclusão local de progresso |

Destinos internos adicionais:

- `#<módulo>/<slug-do-assunto>` abre o assunto em `<dialog>`, com retorno de foco ao fechar (`main.tsx:30`, `main.tsx:47`). As quatro escalas usam `#escalas/eva`, `/bps`, `/painad` e `/rass`; Glasgow usa o slug do título.
- `#quiz/<id-do-caso>` seleciona um dos cinco casos (`CaseStudies.tsx:35`).
- `#biblioteca/<id-do-material>` rola até o card correspondente (`main.tsx:31`).
- `#glossario/<id-do-termo>` seleciona a entrada exata; o parâmetro `?q=` também é lido (`main.tsx:27`, `main.tsx:41`). O nome Siglário preserva intencionalmente essa rota legada.
- `#pdf/<id>?page=<n>` preserva links de página, com validação de faixa (`main.tsx:43`, `PdfReader.tsx:7`). A abertura atual usa PDFs originais em outra aba/visualizador, preservando a aba do app (`pdf-catalog.ts:20`, `PdfReader.tsx:20`).
- Rotas-base desconhecidas mostram "Página não encontrada" (`main.tsx:44`). Não há página dedicada de seleção de perfil, integração do colaborador, laboratório de registros, CTI virtual ou feedback.

O menu desktop tem cinco entradas principais e três ferramentas. O menu móvel tem Início, Módulos, Escalas, Biblioteca e Projeto; primeiro dia/Siglário/favoritos continuam acessíveis pelos atalhos da tela inicial e navegação de ferramentas. Não é correto relatar que essas ferramentas não existem no celular somente porque não estão na barra inferior (`main.tsx:36`, `main.tsx:41`, `main.tsx:45`, `Favorites.tsx:49`).

## Comparação com o pedido A–H

| Pedido | Estado no protótipo | O que deve ser aproveitado / o que falta |
| --- | --- | --- |
| A — Busca e glossário | Existente e funcional; parcial frente ao novo requisito de filtros por categoria | Busca local por nome, alias e texto, acentos/subscritos, ordenação, tipos de resultado visíveis e destinos internos já existem. O Siglário tem filtro 0–9/A–Z e paginação. A busca geral não tem filtro interativo por categoria. `search.ts:153`, `HomeSearch.tsx:140`, `StarterTools.tsx:99`. |
| B — Checklist do primeiro plantão | Pronto no âmbito educativo atual | Roteiro de dez itens, progresso local, erro de armazenamento, orientações, links e reinício. Deixar clara a equivalência com "primeiro dia" sem perder a chave/IDs existentes. `StarterTools.tsx:8-45`. |
| C — Checklist de integração | Ausente | O checklist atual foi escrito para estagiários/preceptor; não há um roteiro separado nem armazenamento próprio para novos colaboradores. |
| D — Casos interativos | Pronto no âmbito educativo atual; validação clínica parcial | Cinco casos fictícios, duas etapas, alternativas, explicação individual, discussão final, revisão de escolhas, reinício, links de referência e assunto relacionado. Não há persistência de respostas, o que não é exigido nesta fase. `CaseStudies.tsx:50-101`, `cases.ts:11`. |
| E — Laboratório de anotações | Conteúdo preparatório existe; laboratório solicitado ausente | Existem cinco tópicos explicativos, exemplos adequados/inadequados, um caso de registros e questões. Não há editor/exercício de produção, rubrica ou avaliação da anotação. Não confundir o módulo atual com o laboratório completo. `content.ts:46-51`, `cases.ts:139`. |
| F — Seletor educativo de escalas | Parcial | As quatro abas, categorias de finalidade e quadro comparativo já existem, sem calculadora. Glasgow é introdutório e não entra no quadro/seletor. Falta reunir dor, sedação/agitação e consciência em uma seleção explícita por finalidade, preservando os textos e limites. `ScalesGuide.tsx:49`, `scales.ts:398`, `content.ts:37`. |
| G — CTI virtual | Assets reaproveitáveis existem; box interativo ausente | Quinze SVGs com partes numeradas, descrição, legenda e fontes já existem nos assuntos. São desenhos estáticos; não há cena 2D de box com equipamentos selecionáveis. Não recriar os desenhos nem usar fotos de pacientes. `EquipmentIllustration.tsx:100-121`. |
| H — Feedback e avaliação PBL | Ausente | O termo "feedback" no código é a explicação de respostas do quiz/caso; não é questionário de usabilidade, aprendizagem percebida ou coleta. Não há formulário, consentimento, retenção, servidor ou armazenamento de avaliações. |

## Perfis e Sobre o Projeto

- **Seleção de perfil ausente**: não há preferência "estagiário"/"novo colaborador", rota inicial equivalente nem chave de perfil. O app não exige login e não oculta conteúdos por perfil, o que deve ser preservado.
- O público visível é exclusivamente o estagiário: "GUIA PARA ESTAGIÁRIOS", "jornada no estágio", "PARA O SEU ESTÁGIO", referências repetidas a preceptor e estudante (`main.tsx:36`, `main.tsx:39`, `Favorites.tsx:49`). A adaptação deve acrescentar o segundo público, sem duplicar catálogos ou remover orientações do primeiro.
- **Sobre já existe**: origem acadêmica durante estágio no Hospital Moinhos de Vento, natureza de protótipo, limitação educacional, nomes/revisores a definir, privacidade, progresso local, instalação e exclusão de dados (`main.tsx:44`). Já declara que não é publicação oficial/validada pelo hospital.
- **Sobre está parcial** diante do novo objetivo: falta explicitar Faculdade Moinhos de Vento, problema e objetivo ampliados, dois públicos, funcionalidades e percurso de demonstração. Os nomes e créditos continuam pendentes de confirmação, não devem ser preenchidos por inferência. Não há um tour ou roteiro guiado institucional dedicado; os guias existentes são de instalação/teste/atualização.

## Dados e manutenção

| Campo pedido | Situação atual |
| --- | --- |
| Identificador | Existe em módulos, casos, escalas, termos, materiais e itens de checklist. Assuntos não têm ID próprio: o slug vem do título. |
| Título/descrição | Amplamente disponíveis; Topic usa `title`, `purpose`, `care`, `risk`. |
| Categoria | Existe por tipo em busca, `subject` nos casos/quiz, `category` nas escalas e vínculo de apostila; não há um vocabulário único de conteúdo. |
| Público recomendado | Ausente como metadado; o texto presume estudantes. |
| Referências | Existem em tipos próprios e links a páginas de materiais; Topic e perguntas base não têm referências estruturadas. Fontes das 24 questões adicionais são um mapa editorial separado e não são mostradas pelo componente Quiz. |
| Data de revisão | Não há campo unificado; UI escreve revisão não realizada/pendente. Não confundir versão de arquivo ou data de build com revisão clínica. |
| Status de validação | Há avisos e `reviewNote` em alguns termos, mas não enumeração central e nem verificação de publicação por status. |
| Versão | `package.json` continua 0.1.0; documentos/pacotes estão em v14; `BookManifest.version=1` é versão de formato. Não há versão individual de conteúdo. |

Evidências: `content.ts:7-8`; `cases.ts:11-20`; `scales.ts:14-28`; `equipment-diagrams.ts:3-10`; `starter-data.ts:1-7`; `hospital-glossary.ts:4-15`; `materials.ts:3-12`; `extra-questions.ts:328`; `main.tsx:48`; `book.ts:14-19`.

A separação existente entre arrays de conteúdo e componentes é uma base útil. Recomenda-se uma camada pequena de metadados e validadores sobre os IDs atuais, não troca de framework/CMS/recriação. Cada PDF pode ter metadados externos de revisão, sem alterar os bytes ou atribuir aprovação ao conteúdo do arquivo.

Riscos técnicos confirmados na estrutura (não equivalem a falha crítica de execução):

1. **IDs de tópicos dependem do título** (`favorites.ts:8-18`). Renomear textos pode quebrar favoritos e links; separar ID estável de título e manter migração/aliases.
2. **Abas de escalas dependem da posição em arrays** (`main.tsx:34`, `main.tsx:40`, `favorites.ts:13`). Acrescentar/reordenar escalas sem migração pode associar favorito/link errado. Introduzir vínculo explícito entre assunto e escala antes de expandir o seletor.
3. **Shell/roteamento/quiz/Sobre concentrados em JSX denso** (`main.tsx:26-48`). Extrair incrementalmente após testes; uma reescrita de roteamento não é pré-requisito.
4. **Versões distribuídas versus versão npm divergem** (`package.json:4`, histórico v14). Para homologação, identificar build/revisão editorial de forma distinta, sem sugerir revisão clínica.
5. **Estado visual do menu "Módulos" em `#modulos`**: condição atual usa `module`, que fica indefinido nessa rota (`main.tsx:32`, `main.tsx:36`). O destino funciona, mas o item desktop não recebe a classe de seleção. Confirmar visualmente na rodada de navegador; correção pequena de navegação, sem redesenho.

Nenhum desses itens autoriza excluir recursos ou refazer o app. Não foram alterados nesta auditoria.

## Encaminhamento incremental proposto para o plano geral

1. Consolidar a linha de base/testes, corrigir apenas defeitos confirmados e mapear rotas/IDs estáveis antes da mudança de títulos.
2. Adicionar perfil opcional local, troca sempre acessível e prioridade de atalhos; uma base de conteúdo compartilhada, sem bloqueio do outro público. Preservar `cti-first-day-v1`; criar chave separada para checklist de integração e incluir as novas chaves no reset de dados.
3. Acrescentar metadados graduais e filtro de categoria à busca, preservando 806 registros e links; não reescrever o Siglário confirmado sem novo processo editorial.
4. Reaproveitar os cinco casos e escalas existentes. Acrescentar laboratório de anotações fictícias com rubrica explícita; ampliar seleção por finalidade e integrar consciência/Glasgow sem calculadora.
5. Montar box fictício com os desenhos existentes e controles equivalentes por teclado/lista textual; não expor layout ou localização operacional real.
6. Aprimorar Sobre e roteiro de demonstração. Feedback pode começar com questionário demonstrativo/local e proposta documentada de consentimento/retenção/acesso; coleta remota continua dependente de aprovação explícita.
7. Homologação separada da produção, com revisão técnica/clínica atribuída, testes reais em Safari/iPhone e Chrome/Android, validação dos critérios e autorização de publicação. Sem afirmar adoção oficial.

Escopo desta entrega: diagnóstico para decisão do autor. Não constitui aprovação clínica, implantação ou alteração da versão pública.
