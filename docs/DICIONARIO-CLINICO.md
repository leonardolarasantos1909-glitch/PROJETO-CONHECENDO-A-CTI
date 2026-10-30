# Dicionário Clínico — Conhecendo a CTI

Entrega de 30/10/2026 sobre a versão com calculadora (`aad89c90e068e7a438239be347c7ac361d6c91ad`), na branch `modulos/dicionario-clinico`. Esta é uma versão para avaliação, sem publicação automática em produção.

## O que mudou

O Dicionário Clínico passa a ter um card próprio no topo da página inicial, antes da busca geral, e um acesso direto tanto no menu principal do computador quanto na navegação inferior do celular. O card pesquisa diretamente nas 30 condições, por nome, sigla, sinônimo ou palavra-chave, sem API ou serviço de IA. A pesquisa geral também encontra as fichas e permite filtrar por Dicionário Clínico.

São sete categorias: cardiovasculares, respiratórias, neurológicas, renais/metabólicas, infecciosas, gastrointestinais/hepáticas e hematológicas/outras condições críticas. A lista completa é alfabética e as sugestões iniciais são um percurso de estudo, sem afirmar prevalência no setor.

Cada ficha começa pelo resumo, pelos cuidados do técnico de enfermagem e pelos sinais de alerta. As seções expansíveis incluem definição, fisiopatologia, causas, manifestações, diagnóstico e tratamento em visão educativa, identificação, caso fictício e resposta comentada. Há revisão rápida, fontes, condições relacionadas, favorito local e botão para copiar o link direto, com alternativa manual quando o navegador bloqueia a área de transferência.

Os vínculos com equipamentos, dispositivos, escalas, rotinas, registros, casos, laboratório e Siglário são derivados de um mesmo cadastro, que também gera os links de retorno ao dicionário. Somente destinos existentes são usados. VNI leva à definição já existente no Siglário; não foi inventado um módulo completo de VNI.

## Como usar

1. Na página inicial, localize o destaque **Dicionário Clínico**.
2. Digite, por exemplo, **IAM**, **infarto**, **sepse** ou **IRpA** e toque no resultado. **Pesquisar** abre os resultados completos.
3. Para explorar todas as fichas, toque no título do card ou em **Dicionário** no menu inferior do celular. No computador, use **Dicionário Clínico** no menu lateral.
4. Dentro da ficha, consulte o resumo, os cuidados e os alertas. Expanda os assuntos para aprofundar o estudo. Os links para os demais módulos e para outras condições aparecem depois das seções de estudo.
5. Use **Favoritar** para guardar o atalho neste navegador, sem cadastro. **Copiar link da ficha** permite compartilhar o endereço do conteúdo, sem dados pessoais.

O dicionário complementa o acolhimento e a prática de enfermagem. Não recebe informações de pacientes, não realiza diagnóstico, não define tratamento e não fornece doses ou ajustes. Todos os exercícios são fictícios.

## Revisão clínica e fontes

Todas as 30 fichas permanecem com `clinicalReviewStatus: pending` e `reviewedAt: null`. A interface informa **Pendente de validação clínica** e **Última revisão clínica: não realizada**. A versão editorial não é uma data de revisão profissional.

Cada referência apresenta título, organização, endereço e situação da conferência. Quando uma fonte não pode ser consultada, isso aparece na ficha; a data de consulta não é preenchida. Mesmo um acesso confirmado a uma fonte não representa revisão profissional da ficha nem garantia de vigência de todas as recomendações. As tentativas e limitações estão documentadas em `docs/dicionario/fontes-acesso.json`.

Antes de uso institucional, é necessário revisar o conteúdo, conferir as versões vigentes das fontes, adequar atribuições e fluxos com a equipe habilitada e registrar a autorização aplicável. O aplicativo não foi apresentado como oficialmente adotado pela instituição.

## Atualizar mantendo o QR Code

O pacote `downloads/conhecendo-a-cti-dicionario-clinico.zip` contém o aplicativo completo compilado, incluindo os materiais anteriores.

1. Baixe o pacote pronto e guarde a versão anterior para retorno. O botão **Code → Download ZIP** do GitHub baixa o código-fonte, não esse pacote de publicação.
2. Encaminhe a nova versão à responsável/TI para teste em homologação e revisão clínica. O envio do código ao GitHub não atualiza o site.
3. Após a autorização de publicação, use o mesmo projeto e o mesmo fluxo de arquivos estáticos da Cloudflare. O `index.html` deve ficar na raiz. Se o painel pedir uma pasta, extraia o conteúdo do ZIP pronto.
4. Preserve `https://proud-math-302f.conhecendoacti.workers.dev/` para manter o QR Code. A rota nova é `#dicionario-clinico`.
5. Depois da atualização autorizada, feche as janelas antigas do app e abra novamente com internet. Os textos e arquivos do pacote entram no cache existente após o primeiro carregamento completo; fontes externas precisam de conexão. Não é preciso apagar o progresso local.

Nenhum domínio, QR Code, configuração de hospedagem, chave de armazenamento ou serviço remoto foi criado ou modificado por esta implementação.

## Manutenção

- `src/clinical-types.ts`: contrato dos dados e sete categorias.
- `src/data/clinical-*.ts`: 30 fichas, separadas da apresentação.
- `src/clinical-dictionary.ts`: pesquisa local, catálogo de vínculos e validação editorial.
- `src/ClinicalDictionary.tsx`: índice e ficha completa.
- `src/ClinicalDictionaryFeatured.tsx`: destaque e busca na página inicial.
- `src/ClinicalRelated.tsx`: links recíprocos derivados dos dados.
- `src/clinical-dictionary.css`: estilos isolados na paleta atual.
- Integrações em `main.tsx`, `search.ts`, `favorites.ts`, `content-registry.ts`, `ScalesGuide.tsx`, `StarterTools.tsx` e `ProjectOverview.tsx`.
- `src/clinical-dictionary.test.ts`, `scripts/check-clinical-browser.mjs`, `scripts/check-content.mjs` e `scripts/package-clinical-review.py`: verificações e empacotamento.

Para acrescentar uma condição, reutilize a tipagem, escolha um identificador estável, preencha todas as seções, vincule fontes específicas e recursos realmente existentes e mantenha a revisão pendente. A validação rejeita IDs repetidos, campos ausentes, resumos acima de 80 palavras, referências inseguras, links inválidos e alegações de aprovação sem evidências. A lista inicial de 30 é conferida no build; uma ampliação aprovada deve atualizar esse critério e seus testes. Não implemente aprovação apenas trocando um selo: o fluxo de governança precisa registrar responsável e evidências antes de permitir essa mudança.

Para conferir localmente: `npm test`, `npm run build`. O projeto não dispõe de comando de lint separado; o build executa TypeScript e os validadores. Para gerar o ZIP após os testes: `python3 scripts/package-clinical-review.py`. Python é usado somente no empacotamento/testes e não é exigido para abrir o app.

Resultados e limitações dos testes estão registrados em [evidências da entrega](dicionario/README.md). Testes em Chromium/Linux não equivalem a ensaios em iPhone, Android, Safari e leitores de tela físicos. O deploy de homologação na Cloudflare depende do ambiente/autorização da instituição e não é presumido pelo build local.
