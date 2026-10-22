# Plano incremental para avaliação institucional

Preparado em 22/10/2026 a partir da [auditoria da Fase 0](AUDITORIA-FASE-0.md), sobre o commit `02c5dddbc0c62ff781e27277373b15959e61e231` (pacote v14). **Este é um plano para aprovação, não uma lista de funcionalidades já implementadas.**

## Resultado pretendido e limites

Preparar o Conhecendo a CTI para demonstração e avaliação técnica como aplicativo educacional para estagiários e novos colaboradores. Manter React, TypeScript, Vite, a identidade visual, os conteúdos, PDFs, referências, créditos e funcionalidades estáveis. Acrescentar recursos gradualmente, sem recriar o aplicativo ou duplicar os módulos por público.

O endereço público atual e seu QR Code devem ser preservados. Esta aprovação de plano não autoriza publicação automática em produção. Alterações de hospedagem e a publicação final terão uma etapa própria de revisão e autorização, com pacote e resultados concretos disponíveis.

Não acrescentar login, identificadores de estudantes/colaboradores, integração hospitalar, dados reais de pacientes, banco de dados, analytics, administração ou coleta remota. Informações internas restritas não devem entrar no repositório público, no build, no cache ou em PDFs distribuídos. A seleção de perfil organiza a aprendizagem; não funciona como autorização de acesso.

## Método e reversibilidade

Cada fase terá um conjunto pequeno de alterações, com descrição prévia, testes pertinentes, resultado e pendências registrados. Separar ajustes de dependências, navegação, dados e módulos novos em mudanças revisáveis. Manter os IDs, hashes de URL e chaves locais anteriores; quando uma mudança exigir migração, testar os dados antigos antes de publicar.

Conservar os PDFs e as imagens originais. Se uma revisão profissional recomendar retirada ou alteração de um material existente, apresentar a justificativa e obter autorização específica antes de executá-la. Até a decisão, não caracterizá-lo como protocolo oficial validado.

Um checklist concluído, um quiz ou uma rubrica não representam certificação, treinamento obrigatório concluído, autorização para executar procedimentos ou avaliação assistencial de um paciente.

## Fase 0 — auditoria e diagnóstico

**Entrega:** inventário real, matriz de lacunas, defeitos reproduzidos, dependências e plano das Fases 1–7. Examinar fontes, rotas, armazenamento, anexos e infraestrutura disponível; executar testes e build da versão existente. Identificar explicitamente os testes que não puderam ser realizados.

**Saída desta fase:** [relatório de auditoria](AUDITORIA-FASE-0.md) e aprovação do plano pelo responsável antes de alterar o aplicativo.

## Fase 1 — problemas confirmados e consolidação da navegação

**Alterações previstas:**

- Atualizar a cadeia de testes afetada pelos alertas do npm em mudança isolada, escolhendo uma versão corrigida e compatível após avaliar a migração. Não executar `npm audit fix --force` automaticamente.
- Corrigir os problemas de teclado, seleção de navegação, contraste e legibilidade confirmados pela auditoria, mantendo a paleta e a composição existentes.
- Revisar a indicação de página atual e os retornos entre menus, assuntos, biblioteca e páginas de acesso aos PDFs. Preservar a abertura nativa dos PDFs, sem reintroduzir o leitor reduzido que foi rejeitado.
- Registrar versões de Node e ferramentas para reprodução. Separar gradualmente os trechos de navegação/quiz de `main.tsx` quando necessário às correções, sem substituir todo o roteamento.
- Preparar uma lista de verificação de cabeçalhos e MIME para a homologação. A configuração de segurança deve ser compatível com os assets, o livro e os PDFs; não presumir que `_headers` já esteja sendo aplicado no Workers.

**Base reaproveitada:** navegação por hash, componentes especializados, testes existentes, scripts de integridade, manifesto e service worker.

**Validação:** testes automatizados atuais, auditoria de dependências, build, navegação por teclado, foco após responder/avançar/reiniciar quiz, menus e retornos, amostras de contraste e layout móvel. Conferir hashes dos materiais.

**Critério de conclusão:** defeitos confirmados corrigidos e verificáveis, sem perda das funcionalidades anteriores. Se a atualização de ferramentas exigir uma incompatibilidade maior, apresentar o impacto antes de ampliá-la.

## Fase 2 — dois perfis e checklists separados

**Alterações previstas:**

- Acrescentar as escolhas **Sou estagiário** e **Sou novo colaborador**, sem nome, matrícula ou login. Permitir explorar os conteúdos e trocar de perfil por um controle sempre encontrável.
- Usar a preferência apenas para priorizar atalhos e orientações de entrada. Toda a base educativa geral permanece acessível para ambos os públicos.
- Manter o checklist de dez itens do primeiro dia e sua chave `cti-first-day-v1`. Conservar marcações existentes.
- Criar um checklist de integração separado, com sua própria chave local, progresso e reinício independentes. Começar por ambientação genérica e apresentação da equipe; indicar os itens locais como pendentes de validação institucional.
- Registrar somente valores de perfil e IDs de itens permitidos; incluir as novas chaves na opção de apagar os dados de aprendizado. Tratar armazenamento indisponível com retorno claro e funcionamento em memória.

**Não preencher por inferência:** localização real de materiais, ramais, fluxos internos, treinamentos obrigatórios ou liberação de competências.

**Validação:** primeira visita, escolha/troca de perfil, retorno ao app, uso sem login, acesso comum aos módulos, persistência e reinício independente de ambos os checklists, preservação dos favoritos e da página do livro, armazenamento bloqueado e exclusão dos dados locais.

**Critério de conclusão:** dois percursos de acolhimento sobre uma única base, sem ocultação de conteúdo e sem promessa de certificação. O roteiro institucional definitivo depende da aprovação de seus responsáveis.

## Fase 3 — busca, Siglário e organização editorial

**Alterações previstas:**

- Manter o nome **Siglário**, suas 746 entradas, a transcrição original, a atualização confirmada pelo responsável e os IDs existentes. Não substituir silenciosamente definições que o responsável pediu para preservar.
- Acrescentar filtro acessível por categoria à busca geral, usando as categorias já presentes no índice. Preservar pesquisa por sigla, alias, tema e palavras da definição, paginação e links internos.
- Acrescentar metadados comuns progressivamente aos catálogos atuais, sem criar CMS ou área administrativa.
- Separar IDs estáveis de títulos nos assuntos; preservar aliases/migração dos favoritos e links antigos. Trocar o vínculo de escalas por posição em array por um vínculo explícito antes de expandir o seletor.
- Apresentar referência, status e revisão de forma consistente nas telas e nos cartões de materiais. Uma atualização técnica ou a conferência relatada pelo autor não deve ser convertida em data de revisão clínica independente.

**Modelo de manutenção proposto:**

| Campo | Regra proposta |
| --- | --- |
| `id` | Estável e independente do título; compatível com os atalhos existentes. |
| `title`, `description`, `category` | Reutilizar os textos e categorias existentes, com vocabulário consistente. |
| `recommendedAudiences` | Estagiário, colaborador ou ambos; sem bloquear os demais públicos. |
| `references` | Documento/edição/trecho ou página e URL quando disponível; registrar o que foi efetivamente conferido. |
| `version` | Versão editorial do conteúdo, separada da versão do aplicativo. |
| `lastReviewedAt`, `reviewedBy` | Permanecem vazios enquanto não houver revisão profissional documentada. |
| `validationStatus` | Distinguir pendente de revisão, revisado para educação e autorizado como material institucional. Não iniciar como validado. |
| `publicationScope`, `authorizationReference` | Somente material autorizado para divulgação pública pode compor o build público; registrar a autorização quando aplicável. |

**Regra de publicação:** impedir o uso do rótulo “institucional validado” se faltarem responsável, data e registro da autorização aplicável. Material restrito não deve ser incluído, mesmo que a interface o esconda. PDFs podem receber metadados externos, preservando seus bytes.

**Validação:** referências e IDs obrigatórios, migração dos links antigos, filtros combinados, acentos/aliases, HD com dois significados, PPlat/PPlato, busca offline e rejeição de estados de validação sem evidência.

**Critério de conclusão:** conteúdos organizados e rastreáveis, sem inventar fontes, datas, autoria ou aprovação.

## Fase 4 — casos, laboratório de anotações e escalas

**Alterações previstas:**

- Reaproveitar os cinco casos PBL e as 32 questões. Exibir fontes por questão aproveitando o mapa editorial existente e completar as lacunas somente com fontes realmente conferidas.
- Criar o **laboratório de anotações** com cenários fixos e explicitamente fictícios. As respostas esperadas devem se limitar aos fatos apresentados; não inserir horário, medida, conduta ou reação que o cenário não forneceu.
- Apresentar rubrica educacional: fidelidade aos fatos, clareza, sequência temporal quando fornecida, cuidado/comunicação documentados e ausência de inferências. A devolutiva será explicável, sem parecer clínico automatizado ou certificação.
- Se houver editor livre para o exercício, não enviar seu texto a terceiros nem salvá-lo automaticamente. Orientar o uso exclusivo dos dados do cenário; guardar progresso apenas por IDs quando apropriado.
- Organizar as escalas por **dor**, **sedação/agitação** e **consciência**, reutilizando as quatro fichas detalhadas e o tópico Glasgow. Expandir conteúdo somente após conferência da versão do instrumento e de seus critérios.
- Manter a seleção como educação: sem dados reais de paciente, prescrição, ajuste de tratamento ou recomendação clínica autônoma.

**Dependência profissional:** revisão do escopo de atuação, dos exemplos de registro e das versões dos instrumentos por responsável definido. Preservar as notas das divergências enquanto não houver resolução registrada.

**Validação:** percorrer todas as alternativas e explicações, verificar referências e retorno de foco; testar a rubrica com resposta fiel, resposta incompleta e informação inventada; conferir ausência de envio remoto/autossalvamento de texto; testar finalidade/abas das escalas por teclado e confirmar ausência de decisões terapêuticas automáticas.

**Critério de conclusão:** exercícios utilizáveis para estudo e discussão com a equipe, apoiados nos dados fictícios e nas referências documentadas.

## Fase 5 — CTI virtual interativo

**Alterações previstas:** montar um box **fictício** em 2D, reaproveitando os 15 desenhos e suas explicações. Equipamentos selecionáveis devem ser botões com nomes acessíveis, foco visível e retorno ao ponto de origem. Oferecer uma lista textual equivalente à cena, com o mesmo conteúdo e operação completa pelo teclado.

Não representar a planta real, a localização de recursos institucionais, fotografias identificáveis ou ajustes de equipamentos. Não transformar a cena em simulação de atendimento de um paciente real.

**Validação:** teclado, toque, leitor de tela em teste manual, sequência de foco, abertura/fechamento das explicações, layout móvel e equivalência entre a cena e a lista. Manter SVGs, legendas, fontes e avisos.

**Critério de conclusão:** navegação educativa pelo box sem depender de cor, precisão do toque ou percepção visual da planta.

## Fase 6 — feedback, avaliação do PBL e apresentação

**Alterações previstas:**

- Ampliar **Sobre o Projeto** com a origem acadêmica informada pelo responsável, o problema identificado, o objetivo ampliado, os dois públicos, recursos, limitações e status de desenvolvimento/revisão.
- Manter participantes, orientadores e revisores pendentes até que seus nomes/créditos sejam confirmados. Não usar logotipo institucional nem declarar adoção oficial.
- Criar roteiro guiado de demonstração que apresente ambos os perfis e recursos usando apenas cenários fictícios.
- Preparar um questionário de usabilidade e aprendizagem percebida para **demonstração local, sem envio remoto**. Explicar o destino das respostas; se houver exportação manual, torná-la explícita e evitar identificadores ou campos assistenciais.

**Proposta obrigatória antes de qualquer coleta remota futura:** finalidade; participação voluntária e consentimento; perguntas/campos; identificação do responsável; local de armazenamento; prazo e procedimento de exclusão; quem pode acessar; exportação e segurança. Não criar banco, endpoint ou analytics sem aprovação específica dessa proposta.

**Roteiro preliminar de demonstração:**

1. Explicar a origem PBL e o estado de protótipo em avaliação.
2. Escolher estagiário, marcar itens genéricos do primeiro dia e pesquisar um termo.
3. Trocar para novo colaborador e mostrar integração, comunicação e a base comum de conteúdos.
4. Explorar um equipamento no box fictício e uma escala pela sua finalidade.
5. Percorrer um caso e um exercício de anotação apenas com os fatos do cenário.
6. Abrir um PDF original, retornar ao app e mostrar favoritos/retomada do caderno.
7. Apresentar revisão, referências, limitações, feedback local e pendências institucionais.

**Validação:** textos de autoria/status, troca entre perfis, acessibilidade do roteiro, ausência de requisições de coleta e de dados identificáveis nas perguntas/artefatos.

**Critério de conclusão:** demonstração coerente e honesta sobre o que funciona, o que depende de revisão e o que ainda não é uma publicação institucional.

## Fase 7 — testes finais e homologação

**Alterações previstas:** consolidar os testes novos com as regressões atuais, conferir referências/metadados e preparar pacote identificado com instruções de atualização e retorno à versão anterior.

Antes de uma implantação de homologação, apresentar o pacote, o projeto separado proposto, as configurações e os responsáveis. O repositório atual não comprova uma homologação existente. Criar ou utilizar esse ambiente somente após autorização e acesso adequados; não usar a publicação atual para testar mudanças.

**Validação:** os 14 critérios do pedido; iPhone/Safari, Android/Chrome e desktop reais; teclado e leitores de tela; persistência/limpeza de dados; dois perfis/checklists; anotações; escalas; box; feedback; pesquisa; PDFs e retorno; cache inicial, apostilas sob demanda e atualização offline; HTTPS, MIME e cabeçalhos efetivos; ausência de erros críticos.

**Critério de conclusão:** resultados registrados, limitações explícitas, revisão técnica/editorial atribuída, conteúdo público autorizado e aceite da homologação. A publicação em produção continua dependendo de autorização final, preservando o projeto, endereço e QR Code atuais.

## Dependências do responsável e da instituição

- Aprovação deste plano antes da implementação das próximas fases.
- Nomes e créditos de participantes/orientadores; responsável pela revisão clínica e pelo conteúdo de integração.
- Decisão documentada sobre divergências clínicas, referências vigentes e direitos de distribuição dos materiais já anexados.
- Itens de integração e eventuais fluxos/documentos expressamente autorizados para acesso público. Nada restrito será preenchido por inferência.
- Responsável pela conta Cloudflare e autorização de ambiente separado de homologação; dispositivos e pessoas para os testes manuais.
- Aprovação de uma proposta específica se houver interesse futuro em coleta remota de feedback.

O trabalho de desenvolvimento e demonstração pode avançar incrementalmente após o aceite, mantendo as dependências institucionais como pendências explícitas. A falta de um protocolo ou de nomes não autoriza inventar seu conteúdo.
