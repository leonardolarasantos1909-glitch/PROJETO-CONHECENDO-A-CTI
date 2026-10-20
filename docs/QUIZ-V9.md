# Quiz ampliado — v9

A ampliação acrescenta **24 questões** às **oito questões anteriores**, totalizando **32 perguntas de revisão**. Cada pergunta nova tem quatro alternativas, um gabarito e uma explicação educativa. Os cinco casos PBL de duas etapas continuam separados do quiz de revisão; não entram nessa contagem.

## Distribuição

| Tema | Novas | Total com as anteriores |
| --- | ---: | ---: |
| Segurança | 3 | 4 |
| Registros | 3 | 4 |
| Ética | 2 | 3 |
| Escalas | 5 | 7 |
| Dispositivos | 4 | 5 |
| Equipamentos | 3 | 4 |
| Rotinas | 2 | 3 |
| Comunicação | 2 | 2 |
| **Total** | **24** | **32** |

## Inventário das questões novas

A numeração abaixo se refere somente às questões novas e segue a ordem de src/extra-questions.ts. O gabarito serve à revisão editorial; os resultados do quiz servem à autoavaliação do estudo, sem certificar competência clínica.

| Nova | Tema e enunciado | Gabarito | Base utilizada |
| ---: | --- | :---: | --- |
| 01 | **Segurança** — Antes de iniciar um cuidado, como deve ser confirmada a identificação da pessoa? | A | Bem-vindo à CTI — Segurança e primeiro dia; Caderno, página 3 |
| 02 | **Segurança** — O que orienta a escolha dos EPIs durante as atividades no setor? | C | Bem-vindo à CTI — Segurança e primeiro dia; Caderno, página 40 |
| 03 | **Segurança** — Ao terminar um cuidado no box, qual conferência favorece a segurança? | B | Rotinas da CTI; Caderno, página 40 |
| 04 | **Registros** — Por que a expressão “diurese boa” é insuficiente em uma anotação? | D | Anotações de enfermagem — Eliminações e balanço; Caderno, página 23 |
| 05 | **Registros** — Situação fictícia: após a higiene, qual informação ajuda a documentar a resposta ao cuidado? | A | Anotações de enfermagem — Higiene, conforto e mobilização; Caderno, página 38 |
| 06 | **Registros** — Como devem ser escolhidas as siglas usadas na anotação de enfermagem? | C | Caderno CTI Adulto — Anotação de enfermagem, página 38 |
| 07 | **Ética** — Qual atitude expressa acolhimento e humanização antes de um cuidado? | B | Bem-vindo à CTI — Ética, sigilo e humanização |
| 08 | **Ética** — Por quais meios devem circular as informações assistenciais necessárias ao cuidado? | D | Bem-vindo à CTI — Ética, sigilo e humanização |
| 09 | **Escalas** — Qual característica distingue a EVA apresentada no aplicativo de uma escala numérica? | C | Escalas clínicas — EVA; Caderno, página 10 |
| 10 | **Escalas** — Quais são os três domínios observados na BPS descrita no caderno? | A | Escalas clínicas — BPS; Caderno, páginas 11–12 |
| 11 | **Escalas** — O que significa reconhecer que BPS 3 é a pontuação mínima da escala? | D | Escalas clínicas — BPS; Caderno, página 11 |
| 12 | **Escalas** — Para qual perfil a PAINAD é apresentada nos materiais do aplicativo? | B | Escalas clínicas — PAINAD; Caderno, páginas 13–14 |
| 13 | **Escalas** — Qual informação a RASS organiza? | A | Escalas clínicas — RASS; Caderno, páginas 17–18 |
| 14 | **Dispositivos** — Qual definição corresponde ao PICC? | C | Dispositivos — PICC; Glossário — PICC; Caderno, página 22 |
| 15 | **Dispositivos** — Qual princípio orienta a observação de uma sonda vesical de demora? | B | Dispositivos — Sonda vesical de demora; Caderno, página 23 |
| 16 | **Dispositivos** — Situação fictícia: o curativo de um acesso venoso está úmido ou solto. Como interpretar esse achado? | D | Dispositivos — Cateter venoso central; Caderno, página 22 |
| 17 | **Dispositivos** — Durante higiene ou mobilização de uma pessoa com tubo orotraqueal, qual cuidado deve integrar o planejamento? | A | Dispositivos — Tubo orotraqueal; Caderno, página 8 |
| 18 | **Equipamentos** — Por que a qualidade do sinal precisa ser considerada ao observar o monitor multiparamétrico? | B | Equipamentos hospitalares — Monitor multiparamétrico; Caderno, páginas 4–5 |
| 19 | **Equipamentos** — Como reconhecer a solução e a terapia associadas a uma bomba de infusão? | D | Equipamentos hospitalares — Bomba de infusão; Caderno, página 28 |
| 20 | **Equipamentos** — Qual característica identifica o funcionamento geral de uma bomba de seringa? | C | Equipamentos hospitalares — Bomba de seringa |
| 21 | **Rotinas** — O que o balanço hídrico reúne em um período definido? | A | Rotinas da CTI — Balanço hídrico e dispositivos; Glossário — BH; Caderno, página 24 |
| 22 | **Rotinas** — Situação fictícia: surge uma dúvida na conferência da prescrição antes de administrar um medicamento. Qual é o momento de esclarecê-la? | C | Rotinas da CTI — Administração segura de medicamentos; Caderno, página 28 |
| 23 | **Comunicação** — Qual conjunto de informações favorece a continuidade do cuidado na passagem de plantão? | D | Rotinas da CTI — Recebimento e passagem de plantão; Caderno, página 39 |
| 24 | **Comunicação** — Situação fictícia: uma mudança importante exige ajuda imediata. Qual sequência favorece o cuidado? | B | Rotinas da CTI — Alterações clínicas e registros; Caderno, páginas 38–39 |

## Base e conferência do conteúdo

A base principal são os módulos existentes em src/content.ts, as explicações das escalas em src/scales.ts, o glossário em src/starter-data.ts e o [Caderno CTI Adulto fornecido pelo autor](../public/materiais/caderno-cti-adulto-digital.pdf). A numeração citada coincide com as páginas impressas e com o texto extraído em public/caderno/paginas.json. O mapa editorial extraQuestionSources vincula cada pergunta à sua base, módulo e página quando pertinente.

Em 20/10/2026, a conferência verificou as 24 perguntas, suas quatro alternativas, o gabarito e as explicações contra esses conteúdos. Todos os enunciados novos são únicos; as alternativas de cada questão são distintas; há seis gabaritos em cada posição, A, B, C e D; e as 24 entradas do mapa de fontes correspondem aos enunciados. As páginas informadas existem no caderno.

A revisão de conteúdo não encontrou bloqueador material ou segunda alternativa igualmente adequada nos enunciados propostos. A expansão trata de identificação e precauções, conferência ao terminar cuidados, registro objetivo, siglas padronizadas, acolhimento e sigilo, escolha e limites das escalas, reconhecimento de dispositivos e equipamentos, balanço e comunicação. Os assuntos reforçam princípios existentes com situações diferentes; nenhum enunciado novo repete literalmente as oito perguntas anteriores.

As cinco perguntas novas de escalas mantêm as distinções do projeto: a EVA usa autorrelato e linha contínua; a BPS reúne face, membros superiores e adaptação à ventilação; seu mínimo de três não comprova ausência de dor; a PAINAD se refere ao perfil de demência avançada sem autorrelato confiável; e a RASS organiza agitação e despertar, sem diagnosticar delirium ou medir dor. Não foram criadas metas, limiares de tratamento, doses, diluições, ajustes de medicamentos/equipamentos ou novas regras de pontuação.

Os exemplos contextuais são situações fictícias. A linguagem mantém a atuação do estagiário sob orientação e supervisão e remete os fluxos reais ao serviço. Os textos são adaptações educativas dos materiais existentes; não são uma nova versão validada de protocolo ou instrumento. Referências e créditos permanecem nos PDFs originais; não houve nova consulta externa de referências nesta ampliação.

## Revisões e verificações pendentes

A preceptoria e a instituição precisam conferir a adequação das perguntas, a terminologia, as atribuições profissionais e os fluxos locais antes de usar o quiz como material institucional. O resultado não comprova aptidão para executar cuidados. Esta conferência editorial não substitui revisão clínica/institucional.

## Verificação da entrega — 20/10/2026

`npm test` aprovou **40 testes em sete arquivos**, incluindo a contagem de 32 perguntas, a ausência de enunciados/alternativas repetidos, gabaritos inteiros válidos, cálculo de acertos e as verificações existentes de conteúdo, escalas, ferramentas de estudo e armazenamento local. O verificador do service worker aprovou os casos de cache, Range/If-Range, leitura offline, allowlist e falhas de armazenamento.

`npm run build` aprovou TypeScript, compilação, integridade do caderno digital, suas 96 páginas e links e as cinco apostilas. Cache de produção: `cti-6aa041277d36`.

No Chromium, seis grupos de verificações passaram. A comparação literal confirmou que as oito questões anteriores mantêm enunciado, alternativas, gabarito e explicação. Todas as 32 perguntas, alternativas, contadores e explicações foram percorridas; respostas corretas e incorretas produziram o placar esperado de 16/32. Os oito filtros somaram 32 perguntas, a troca de assunto zerou índice e respostas, e o tema Comunicação e o reinício funcionaram.

Em larguras de 320, 390 e 1440 pixels não houve rolagem horizontal. Alternativas, filtro e botões do quiz têm fonte de pelo menos 14 pixels e controles de pelo menos 44 pixels; a navegação por teclado funcionou. As capturas de celular e computador foram inspecionadas. Os cinco casos PBL, os oito módulos, os três atalhos, as cinco apostilas e as 96 páginas do caderno permaneceram disponíveis.

Depois da ativação do service worker e da recarga offline, os oito filtros, as 32 questões, suas explicações, a finalização com 32/32 acertos e o reinício funcionaram. Os PDFs grandes não foram antecipados no cache inicial. Não houve erros nem avisos JavaScript. Navegador e servidor de teste foram encerrados. Esses testes não substituem a conferência em iPhone e Android físicos nem validam a publicação pública.

O ZIP **conhecendo-a-cti-v9.zip** contém **116 arquivos, 70.137.758 bytes**, `index.html` na raiz, caminhos seguros, CRCs válidos e todos os arquivos idênticos ao build. Os arquivos de `caderno/` e `materiais/`, incluindo PDFs, imagens e manifestos, permaneceram byte a byte idênticos à v8. SHA-256: `84fbcb5d3963927ffefa566885e2f75c998a1c2101fdb4de14e09ff54b0840f0`.

A atualização do endereço público depende do envio manual desse ZIP ao mesmo projeto da Cloudflare. Manter o projeto e endereço preserva o QR Code. Consulte [Atualizar versão 9](ATUALIZAR-V9.md).
