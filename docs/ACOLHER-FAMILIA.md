# Acolher também é cuidar

Entrega de **27/10/2026**, preparada na branch `acolhimento-familiar/implementacao` sobre a última versão entregue, commit `1fed72be139fc7c2d77cb6b5e2fb15805bcecece`. O ambiente abriu inicialmente o commit antigo da auditoria; a base final anterior foi recuperada antes de implementar, preservando perfis, checklists, laboratório, box virtual, avaliação e demais recursos.

O novo módulo acrescenta um nono card na tela inicial, com coração/acolhimento, título **Acolher também é cuidar**, descrição solicitada e subtítulo **A família faz parte do cuidado.** O acesso é `#acolher-familia`, sem login. O aplicativo continua destinado a estagiários e novos colaboradores; os familiares recebem um folheto próprio, sem obrigação de acessar o app.

**Nenhuma publicação foi feita na Cloudflare.** A produção, seu endereço, `main` e o QR Code não foram alterados. O pacote é para revisão e homologação; a entrega do material aos familiares depende da aprovação da enfermeira responsável e da instituição.

## O que foi implementado

| Seção | Acesso | Conteúdo |
| --- | --- | --- |
| Acolhimento familiar | `#acolher-familia/acolhimento` | Seis orientações sobre apresentação, função, escuta, ansiedade, encaminhamento e confidencialidade, com exemplos de falas. |
| Como orientar o visitante | `#acolher-familia/visitante` | Cinco cards: pessoa sedada, cotidiano, mãos, equipamentos/dispositivos e participação segura. |
| O que dizer? O que evitar? | `#acolher-familia/falas` | Oito situações expansíveis, com exemplos acolhedores, frases inadequadas e explicação. |
| Simulador de comunicação | `#acolher-familia/simulador` | Oito cenários fictícios, três alternativas por cenário, feedback por escolha, explicação, avanço e nova tentativa. |
| Material para entregar ao familiar | `#acolher-familia/material` | Prévia HTML em quatro páginas, PDF real para impressão, PDF de leitura e impressão isolada. |

As cinco abas funcionam por toque e teclado, incluindo setas, Home e End. Seções e cenários podem ser favoritados. Busca e catálogo de revisão incluem módulo, seções, falas, oito simulações e dois PDFs. Os contadores de módulos visitados agora usam o tamanho real do catálogo, preservando os IDs anteriores.

O novo simulador mantém escolhas somente na memória da tela, sem campos de identificação, autosalvamento, envio remoto ou nota de competência. Após responder, o foco vai para a explicação e o próximo Tab chega ao avanço. Mudar de seção ou sair desmonta o exercício. Favoritos continuam usando a chave de IDs já existente; nenhuma chave de dados pessoais ou de pacientes foi criada.

## Folheto e impressão

Título: **Bem-vindo à CTI — Sua presença também é cuidado**. Páginas lógicas: capa; Sua presença importa; Cuidados e segurança; Estamos aqui para orientar. A ilustração vetorial representa conversa e parceria, sem fotografia identificável ou logotipo institucional. Textos e hierarquia são legíveis em cores e em preto e branco.

- `public/materiais/acolher-familia/folheto-familia-a4.pdf`: duas faces **A4 em paisagem**, com a frente **4 | 1** e o verso **2 | 3**. Imprimir em uma folha, frente e verso, tamanho real/100%, virando pela **borda curta**; dobrar ao meio. Não aplicar novamente “livreto” ou “várias páginas por folha”. Fazer uma cópia de teste, pois a alimentação de papel varia por impressora.
- `public/materiais/acolher-familia/folheto-familia-a5.pdf`: quatro páginas A5 em ordem de leitura. Não é o arquivo imposto para a impressão direta da folha dobrada.
- O botão **Baixar PDF** entrega o arquivo A4 pronto. Os PDFs abrem no visualizador nativo em outra aba quando necessário, mantendo o app acessível para retorno.
- A prévia interna usa HTML com uma página por vez e botões 1–4, Anterior e Próxima. Não reintroduz PDF reduzido em iframe.
- **Imprimir** abre a impressão do navegador. Um portal separado e CSS de impressão apresentam somente os quatro painéis, em duas faces A4, sem menus, botões, fontes da página ou o restante do aplicativo. Desativar cabeçalhos/rodapés automáticos da impressão. No iPhone, pode-se salvar o PDF em Arquivos e imprimir pelo visualizador; no Android, usar Downloads/visualizador.

HTML e PDFs usam a mesma fonte editorial, `src/data/family-leaflet.json`. O gerador Python usa ReportLab, DejaVu Sans e diagramação com limites de altura; não é dependência de execução do aplicativo. Os PDFs prontos estão versionados. Para alterar o texto, atualizar o JSON, executar `python3 scripts/generate-family-leaflet.py`, conferir as páginas e rodar `npm test` / `npm run build`. O build **verifica**, sem regenerar silenciosamente: hash da fonte/PDF, quantidade de páginas, formatos, ordem e limites de diagramação.

O aviso **Material educativo sujeito à validação institucional**, versão 1.0 e atualização editorial de 27/10/2026 são preservados. A revisão clínica aparece como **não realizada** e a institucional como **pendente**; não foi inventada uma data de revisão profissional.

## Fontes, limites e confirmação institucional

As orientações seguem o escopo do pedido e a base educativa existente. Foram indicadas para revisão: Cofen — Resolução 564/2017; OMS — Hand hygiene; NHS — Intensive care; e o módulo local de equipamentos com seus materiais relacionados. As tentativas de consulta externa foram bloqueadas pelo proxy com erro 403; **não houve conferência integral desses documentos nesta execução**, nem confirmação de vigência, tradução ou suporte de cada frase. Datas de acesso/revisão continuam vazias, e os textos dos exemplos não foram atribuídos como citações dessas fontes. Os links e limites estão na interface e nos dados para a equipe revisora conferir.

A regra **“um visitante por vez”** fica exclusivamente em um quadro de **relato local da CTI Cardio, pendente de confirmação**. Não integra o folheto nem as orientações gerais de visitação. Não foram publicados horários, ramais, localização de recursos ou protocolos internos por inferência.

Antes de utilização institucional, a enfermeira/equipe responsável deve validar exemplos de comunicação, encaminhamentos conforme atribuições, higiene das mãos, participação em cuidados, manejo de situações emocionais e orientações de visitação. Não há promessa de recuperação, prognóstico ou garantia de audição/compreensão durante sedação. O visitante não recebe instruções de ajuste/manipulação de equipamentos ou alarmes. Cuidados diretos dependem de autorização, orientação, supervisão e normas locais.

## Resultado dos testes e pacote

Foram aprovados **103 testes em 21 arquivos**, as verificações do service worker e o build. No Chromium local, **27 grupos** percorreram **102 destinos**, incluindo as 24 alternativas das oito simulações, downloads e impressão. Foram conferidos 112 layouts nas larguras 320, 390, 768 e 1440 px e 167 amostras de contraste, com mínimo de 4,92:1. Não houve erros de execução, violações CSP ou requisições externas automáticas nos percursos. A auditoria npm completa retornou zero alertas.

O PDF fornecido e a impressão HTML foram conferidos independentemente: quatro páginas A5 em leitura e duas faces A4 em paisagem, ordem 4|1 / 2|3, com todos os textos e sem os menus do app. Os sete PDFs anteriores e os 105 arquivos herdados de materiais/livro permanecem idênticos à entrega anterior.

O ZIP contém **124 arquivos e 70.296.286 bytes**, com CRC válido e conteúdo correspondente ao build. SHA-256: `1398db729928f003778b186e942c8e19548971dcfa2ef3adbf5f35a1f5c6c346`. Cache testado: `cti-d12796ff1838`. A [matriz de aceitação](acolher-familia/ACEITACAO.md) distingue os testes locais dos ensaios ainda pendentes em aparelhos e impressoras reais.

## Arquivos e preservação

| Criados | Função |
| --- | --- |
| `src/family-welcome.ts`, `src/family-welcome.test.ts` | Dados, referências, configuração local pendente e testes do conteúdo. |
| `src/FamilyWelcome.tsx`, `src/family-welcome.css` | Cinco seções, consulta rápida e simulador. |
| `src/FamilyLeaflet.tsx`, `src/family-leaflet.css`, `src/family-leaflet.test.tsx` | Prévia, download, portal de impressão e testes. |
| `src/data/family-leaflet.json`, `src/family-catalog.ts` | Fonte única do folheto e destinos/IDs compartilhados. |
| `src/FamilyLibraryMaterials.tsx` | Dois novos cartões na biblioteca, preservando os sete PDFs anteriores. |
| `public/materiais/acolher-familia/` | Dois PDFs e manifesto de integridade. |
| `scripts/generate-family-leaflet.py`, `scripts/check-family-leaflet.mjs` | Geração editorial e verificação antes do build. |
| `scripts/check-family-browser.mjs`, `scripts/package-family-review.py` | Regressões, novos fluxos e pacote com comparação dos materiais anteriores. |

Modificados: `src/main.tsx`, `src/content.ts` e teste; catálogos `search`, `favorites`, `pdf-catalog`, `content-registry` e respectivos testes; `package.json` somente no comando de build; `scripts/check-content.mjs` e `scripts/build-sw.mjs`; README e documentação desta entrega. As dependências e o lockfile foram preservados. Não houve substituição da identidade visual ou exclusão de páginas/documentos existentes.

Os dois PDFs e o manifesto novos entram no cache inicial, junto dos assets reais do novo módulo. Assim, o módulo, simulações, busca, prévia e folheto podem ser usados offline após o primeiro carregamento completo. As cinco apostilas grandes anteriores continuam sob demanda. Links externos exigem internet; o navegador pode remover cache. O primeiro acesso não funciona sem conexão.

Resultados, capturas, impressão produzida pelo Chromium, integridade e limitações estão em [evidências do módulo](acolher-familia/README.md). Automação local não equivale a testes em aparelhos, impressoras ou leitores de tela reais, nem a homologação na Cloudflare. Revisão de todo o material clínico herdado e direitos de distribuição continuam conforme a entrega anterior.
