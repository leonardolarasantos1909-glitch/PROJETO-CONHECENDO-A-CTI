# Melhorias de aprendizagem — v8

Esta atualização reúne cinco recursos educativos: roteiro do primeiro dia, glossário de siglas, ilustrações de equipamentos e dispositivos, casos simulados e atalhos pessoais para favoritos e continuação da leitura. O propósito é facilitar o acolhimento, a consulta e o estudo do estagiário de Técnico em Enfermagem. Não cria prontuário, prescrição, calculadora clínica ou comprovação de competência.

## Recursos implementados

- **Meu primeiro dia (`#primeiro-dia`):** dez itens marcáveis para reconhecer o setor com o preceptor, identificar a equipe, conhecer recursos, precauções, formas de pedir ajuda e orientações de registro. A marcação significa apenas que o assunto foi apresentado; não atesta competência ou autorização para executar cuidados.
- **Glossário (`#glossario`):** 29 siglas e termos, pesquisáveis por nome, palavra da explicação ou sinônimo. Cada entrada indica a base utilizada e um módulo relacionado; quando pertinente, inclui link à página do caderno. As definições são adaptações educativas, com expansão de siglas comuns, e não transcrições literais de todas as páginas citadas.
- **Equipamentos e dispositivos:** 15 entradas nos tópicos existentes — oito em Equipamentos hospitalares e sete em Dispositivos — com esquemas originais, partes numeradas e legenda textual. As representações são genéricas e simplificadas. A tela distingue a base no tópico do módulo da leitura complementar em PDF, pois a página vinculada não descreve necessariamente cada detalhe do desenho.
- **Casos simulados (`#quiz`):** cinco situações fictícias, cada uma com duas decisões e quatro alternativas por decisão. Há explicação para cada escolha, revisão final e uma pergunta para discussão com o preceptor. Os temas são alarme durante mobilização, dúvida sobre liberação de sonda, comunicação de mudança, anotação do cuidado e escolha/limites das escalas. O quiz anterior permanece disponível na mesma seção.
- **Favoritos e retomada:** módulos, tópicos, termos e atalhos podem ser guardados para consulta. O caderno retoma uma página válida da leitura anterior. Marcações do roteiro, favoritos, visitas e página do livro ficam apenas no navegador, sem login ou sincronização entre aparelhos. A página Sobre o projeto explica esse armazenamento e oferece a exclusão dos dados de aprendizado.

Os atalhos da tela inicial e da navegação integram os recursos ao aplicativo. A busca também encontra termos do glossário e temas dos casos. O texto antigo que prometia gerar o QR Code somente após a publicação foi substituído por uma explicação de que manter o endereço preserva o QR existente; isso não afirma uma aprovação institucional da URL.

## Fontes utilizadas para a adaptação

A base é o conteúdo já presente no aplicativo (`src/content.ts`) e o [Caderno CTI Adulto fornecido pelo autor](../public/materiais/caderno-cti-adulto-digital.pdf). A numeração abaixo corresponde às páginas impressas e ao texto extraído em `public/caderno/paginas.json`.

| Recurso ou assunto | Base de consulta | Limite da adaptação |
| --- | --- | --- |
| Integração e primeiro dia | Módulo Bem-vindo à CTI; caderno 3 e 40. | Roteiro para conversar com o preceptor e conhecer os fluxos locais. Não comprova treinamento nem substitui a orientação do setor. |
| Rotina, comunicação e registros | Módulos Rotinas da CTI e Anotações de enfermagem; caderno 3, 24 e 38–40. | Registros objetivos e comunicação à equipe; exemplos são educativos, sem formulário de paciente. |
| Siglas de monitorização e ventilação | Módulo Equipamentos hospitalares; caderno 4–8. | Significados e contexto; sem propor valores de programação, metas universais ou ajustes de suporte. |
| Dispositivos e cuidados de observação | Módulo Dispositivos; caderno 22–27. | Identificação, finalidade geral e observação; sem instrução de inserção, reposicionamento ou manipulação invasiva. |
| Bombas e infusões | Módulos Rotinas da CTI e Equipamentos hospitalares; caderno 28. | Identificação e conferência sob supervisão; sem doses, diluições ou cálculo/programação de infusão. |
| Dor, agitação, sedação e consciência | Módulo Escalas clínicas e `src/scales.ts`; caderno 10–20. | Escolha e contexto dos instrumentos; sem entrada de paciente, novos critérios de escala ou meta de tratamento. |
| Sigilo e atribuições do estagiário | Módulo Bem-vindo à CTI e questões existentes de Ética. | Uso de materiais educativos e supervisão; sem pacientes, prontuários, telas ou imagens identificáveis. |
| Favoritos e retomada do caderno | Estado da interface e página do livro. | Preferências de estudo no navegador; não são registro clínico ou certificado de conclusão. |

Também foram conferidas diretamente as páginas 4, 11 e 12 da [Apostila Monitorização e Equipamentos](../public/materiais/apostilas/monitorizacao-equipamentos.pdf): monitor/sensores e limitações do sinal; componentes gerais de ventilador, bombas e aspirador; observações de dispositivos. As descrições dos esquemas complementam o conteúdo já existente nos módulos, sem representar instrução de montagem ou manual do fabricante.

As referências bibliográficas e os créditos dos PDFs permanecem nos materiais originais. A adaptação se baseia nesses materiais fornecidos e no texto prévio do aplicativo; não deve ser apresentada como consulta ou validação nova das referências externas.

## Conferência do conteúdo

A auditoria leu `src/starter-data.ts`, `src/StarterTools.tsx`, `src/equipment-diagrams.ts`, `src/EquipmentIllustration.tsx`, `src/cases.ts`, `src/CaseStudies.tsx` e a integração em `src/main.tsx`, confrontando os assuntos com as bases acima. Conferiu ainda o tipo de estado guardado em `src/learning-storage.ts` e os textos de retomada do livro.

No glossário, foi retirada a busca por “ECG” como sinônimo isolado de Glasgow para evitar confusão com eletrocardiograma. A definição de balanço hídrico preserva a distinção entre o resultado registrado e a volemia, em vez de equiparar volemia e hidratação. Os textos novos não acrescentam doses, diluições, programação de infusão, metas numéricas de suporte, ajustes de ventilação ou uma classificação de pacientes.

Os casos são criações didáticas a partir dos temas do projeto, identificadas como fictícias. As alternativas inadequadas recebem explicação corretiva, e o fechamento propõe discussão com o preceptor. Nenhum caso, marcação de checklist ou favorito é apresentado como certificação. Não foi encontrado bloqueador material de conteúdo após os ajustes de terminologia e rastreabilidade descritos acima; essa conclusão verifica a adaptação educativa e não equivale à revisão clínica ou institucional.

## Revisões que permanecem necessárias

- A preceptoria e a instituição devem conferir terminologia, atribuições profissionais, versões de instrumentos e adequação dos exemplos ao público do estágio.
- Os fluxos reais de emergência, os contatos, os locais de materiais e as medidas específicas do setor precisam ser apresentados por responsável autorizado. O aplicativo não inventa esses dados institucionais.
- Ilustrações educativas são esquemas simplificados; os modelos, conectores e disposições variam. A identificação visual não habilita a operar equipamentos ou manipular dispositivos.
- Casos simulados não descrevem pacientes reais nem orientam prescrição ou ajuste de suporte. Devem explicitar o contexto fictício e explicar as escolhas.
- Autores, orientadores e responsáveis/data de revisão só devem ser preenchidos com informações fornecidas e confirmadas. A disponibilidade por URL ou QR Code não significa aprovação institucional.

## Verificação da implementação

Em 20/10/2026, `npm test` aprovou **39 testes em sete arquivos**, abrangendo conteúdo e busca existentes, integridade textual das escalas, glossário/checklist, casos, destinos seguros de favoritos, cobertura das quinze ilustrações e armazenamento local. Os testes de armazenamento incluem JSON inválido, identificadores desconhecidos, duplicatas, página inválida, armazenamento bloqueado e exclusão seletiva. O verificador do service worker aprovou Range/If-Range, cache completo sob demanda, offline, allowlist e falhas de armazenamento.

`npm run build` aprovou a integridade do PDF do caderno digital e das cinco apostilas, as 96 páginas e seus links, TypeScript e compilação. Cache final: `cti-759a9343d7b3`. Os novos textos e SVGs integram os assets e o cache do aplicativo; os PDFs grandes continuam armazenados somente sob demanda.

O pacote `conhecendo-a-cti-v8.zip` tem **116 arquivos e 70.133.115 bytes**, com `index.html` na raiz, sem pasta externa, caminhos seguros e CRCs válidos. Cada arquivo corresponde byte a byte ao build. Todo o conteúdo de `caderno/` e `materiais/`, incluindo PDFs, as 96 imagens e os manifestos, permanece idêntico à v7. SHA-256: `f563250e695cb0ec3318bbe407ca073e5fab1d998c19d6d345c45ce6ed131094`.

No Chromium foram aprovados 17 grupos de verificações, realizados em etapas com reteste das partes afetadas pelos ajustes. Foram conferidos checklist por teclado/toque, persistência e reset; glossário com aliases, acentos, SpO₂, resultados vazios e fontes; favoritos de módulo, tópico, escala, termo e caderno, com destino exato e remoção após recarga; cinco casos completos, suas explicações e repetição; quiz anterior com oito questões; dados locais inválidos e armazenamento bloqueado; e exclusão somente das quatro chaves do aplicativo.

O leitor retomou a página 42, saltou para a 73, recebeu gesto de toque real entre páginas 29 e 30, preservou a posição ao girar/reabrir/recarregar e voltou ao início pelo controle próprio. Rotas desconhecidas e identificadores de objeto herdados não provocaram falha. Os quinze SVGs foram conferidos com títulos/descrições acessíveis, partes e legendas numeradas, links e retorno do foco ao fechar por Escape. As capturas dos recursos no celular e no computador foram inspecionadas.

Os layouts de 320, 360, 390 e 1440 pixels ficaram sem rolagem horizontal. Os textos novos de leitura e rótulos têm pelo menos 14 pixels e os novos controles pelo menos 44 pixels; os números dos SVGs têm tamanho efetivo mínimo de 14,73 pixels a 320 pixels de largura. Na última alteração, que apenas centralizou os diálogos, posicionamento e foco foram retestados em 320, 390 e 1440 pixels no cache final `cti-759a9343d7b3`.

A recarga offline no build final manteve checklist, glossário, favoritos, casos, quinze desenhos, quatro abas das escalas, caderno até a página 96 e biblioteca. O cache incluiu as 96 imagens e não antecipou o download das cinco apostilas grandes. Não houve erros ou avisos JavaScript nem requisições externas introduzidas nos fluxos verificados. Servidores e navegadores utilizados nos testes foram encerrados.

A conferência do software e do conteúdo não representa revisão clínica/institucional nem teste em aparelhos físicos iOS ou Android. A publicação pública não foi verificada nesta entrega. A atualização da hospedagem depende do envio manual do ZIP ao mesmo projeto da Cloudflare, conforme o [passo a passo](ATUALIZAR-V8.md); manter o endereço preserva o QR Code.
