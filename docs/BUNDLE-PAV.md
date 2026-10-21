# Bundle de prevenção da PAV

O tópico **Bundle de prevenção da PAV** explica, para estudo do estagiário de Técnico em Enfermagem, o conjunto articulado de medidas para reduzir o risco de pneumonia associada à ventilação mecânica. A composição do bundle, os momentos de conferência, as exceções e os registros devem seguir a versão adotada pelo serviço. A tela não cria um checklist assistencial, não coleta dados de pacientes e não certifica adesão ou competência.

## Base utilizada

Foram lidos os textos dos materiais já fornecidos pelo autor:

- [Caderno CTI Adulto, página 9](../public/materiais/caderno-cti-adulto-digital.pdf#page=9): higiene das mãos; circuito íntegro; higiene oral conforme POP; cabeceira de 30 a 45° quando indicada e sem contraindicação; cuff por método, atribuição e faixa do setor; condensado; conferência conjunta das medidas; secreções e atribuições na aspiração.
- [Caderno, página 8](../public/materiais/caderno-cti-adulto-digital.pdf#page=8): observação de fixação, posição registrada, secreções, conexões e alarmes; comunicação de deterioração e ausência de reposicionamento do TOT por iniciativa própria.
- [Caderno, página 38](../public/materiais/caderno-cti-adulto-digital.pdf#page=38): registro dos cuidados efetivamente realizados, achados, horários e comunicação, segundo o padrão do serviço.
- [Caderno, página 43](../public/materiais/caderno-cti-adulto-digital.pdf#page=43): referências [14] Anvisa/PAV e [17] Cofen/aspiração de vias aéreas e seus URLs originais.
- [Apostila Cuidados com o Paciente Crítico, página 4](../public/materiais/apostilas/cuidados-paciente-critico.pdf#page=4), item 11: cabeceira quando permitida, higiene oral, cuidado com cuff e avaliação diária da necessidade de ventilação pela equipe; observação de secreções, alterações respiratórias e falhas de dispositivos.
- [Apostila Cuidados com o Paciente Crítico, página 9](../public/materiais/apostilas/cuidados-paciente-critico.pdf#page=9): meta de sedação individualizada e prescrita pela equipe. O texto já existente de RASS em `src/scales.ts` orienta não suspender ou ajustar sedação por conta própria.
- Módulos existentes em `src/content.ts`: segurança, higiene, mobilização, ventilador, TOT/TQT, registros e supervisão.

Os mapas reproduzidos nas páginas 20 e 21 da apostila continuam no PDF original, com seus créditos. Não foram reproduzidos na nova tela nem tratados como validação nova das medidas.

## Medidas apresentadas e limites

| Medida | Fonte de base | Limite explicitado |
| --- | --- | --- |
| Higiene das mãos | Caderno 9; módulo de acolhimento. | Momentos, técnica e precauções conforme o serviço. |
| Cabeceira | Caderno 9; apostila 4. | 30–45° somente quando indicada e sem contraindicação; avaliação individual. |
| Higiene oral | Caderno 9; apostila 4. | POP, plano de cuidados, técnica, frequência e produtos definidos pelo serviço. Nenhum antisséptico é prescrito como obrigatório para todos. |
| Circuito e condensado | Caderno 8–9; módulo de ventilador. | Integridade, redução de desconexões desnecessárias e prevenção de escoamento do condensado para a pessoa; manejo e trocas conforme protocolo, sem calendário ou montagem ensinados na tela. |
| Cuff/balonete | Caderno 9; apostila 4. | Método, atribuição e faixa do setor; não foi acrescentado alvo numérico ou técnica de ajuste. |
| Secreções e aspiração | Caderno 9 e referência [17]. | Avaliação e comunicação; aspiração de pacientes graves com TOT/TQT atribuída ao enfermeiro na equipe de enfermagem, como descrito no material. O estudante acompanha e auxilia sob orientação. |
| Necessidade de ventilação | Apostila 4; texto existente de RASS. | Avaliação diária pela equipe. Não transforma interrupção de sedação, teste de respiração ou extubação em ação obrigatória ou autônoma do estudante. |
| Conferência e registro | Caderno 9 e 38; módulos de rotinas e registros. | Bundle local e registro real no sistema autorizado. A tela de estudo não recebe dados assistenciais. |

As oito seções são uma organização didática dos assuntos, e não oito itens de um bundle universal validado. Higiene das mãos e registro também são práticas transversais. A classificação e a checagem de adesão de cada instituição precisam ser definidas por seus responsáveis.

## Referências externas preservadas

Os dois URLs seguintes foram extraídos diretamente dos links da página 43 do caderno:

1. **Anvisa — Protocolo de prevenção de PAV**, referência [14]: https://www.gov.br/anvisa/pt-br/assuntos/servicosdesaude/prevencao-e-controle-de-infeccao-e-resistencia-microbiana/prevencao-das-principais-iras/pneumonia-associada-a-ventilacao-mecanica/protocolo-4-prevencoo-de-pav-final.pdf
2. **Cofen — Resolução 557/2017, aspiração de vias aéreas**, referência [17]: https://www.cofen.gov.br/resolucao-cofen-no-05572017/

As tentativas desta adaptação de abrir os dois endereços retornaram bloqueio HTTP 403 pelo acesso de rede do ambiente; nenhum documento externo novo foi recuperado. Por isso, a tela identifica esses endereços como **links das referências citadas no caderno**, sem alegar nova leitura integral, verificação de vigência ou validação clínica. A indicação “versão 1; disponibilizado em 2026” pertence à referência impressa no caderno e não foi confirmada por nova consulta externa.

As referências bibliográficas e os créditos dos PDFs foram preservados. Os textos da tela são adaptações educativas do material fornecido e dos módulos existentes, com explicitação de limites.

## Revisão clínica e institucional pendente

A preceptoria, o enfermeiro responsável e o serviço de prevenção e controle de infecções devem conferir a versão vigente do protocolo e a adequação do tópico ao setor, incluindo:

- composição do bundle e forma/frequência de conferência;
- indicação e contraindicações de posicionamento;
- avaliação, técnica, frequência e produtos da higiene oral;
- manejo do circuito e do condensado, além dos critérios de troca de componentes;
- método, faixa, atribuições e registro da verificação do cuff;
- atribuições, indicação e técnica de aspiração, com conferência da regulamentação aplicável;
- critérios e responsabilidade da avaliação diária de ventilação, sedação e retirada da via aérea;
- registros, comunicação, tratamento de exceções e treinamento dos estudantes.

Não foram incluídos clorexidina de rotina para todos, tromboprofilaxia ou proteção gástrica como medidas obrigatórias e universais de prevenção de PAV. Não há doses, parâmetros de ventilação, técnica invasiva, formulário de paciente, entrada de escore ou recomendação de modificar tratamento.

A revisão de fidelidade aos materiais fornecidos não substitui essa revisão clínica e institucional. Os resultados da implementação estão registrados abaixo.

## Conferência do conteúdo — 20/10/2026

Foram confrontados os oito itens, as introduções e os seis links com as bases locais indicadas. A revisão independente de conteúdo não encontrou bloqueador material após uma correção de prioridade na redação sobre secreções: a orientação é comunicar prontamente o enfermeiro e auxiliar no preparo sob orientação, sem sugerir esperar concluir o preparo diante de obstrução ou piora ventilatória. Essa conferência é editorial e de fidelidade ao material; não constitui aprovação clínica ou institucional.


## Verificação da implementação — 20/10/2026

O tópico foi integrado a **Rotinas da CTI**, mantendo os oito módulos. A busca indexa o conteúdo completo e encontra “PAV”, “bundle de PAV”, “bundle PAV”, o nome da pneumonia e os assuntos internos. O favorito e o atalho `#rotinas/bundle-de-prevencao-da-pav` abrem o tópico exato. Não foram introduzidos formulário de paciente, entrada clínica, escore ou novas chaves de armazenamento.

`npm test` aprovou **40 testes em sete arquivos**, incluindo as buscas novas e as verificações existentes de módulos, quiz, escalas, casos, glossário, desenhos, favoritos e armazenamento local. O verificador do service worker aprovou cache/Range/If-Range, offline, allowlist e falhas de armazenamento. `npm run build` aprovou TypeScript, compilação, integridade do caderno digital, suas 96 páginas e links e as cinco apostilas. Cache final: `cti-bc27e4206daf`.

No Chromium foram aprovados seis grupos de verificações: abertura do tópico, oito medidas e seis referências literais; busca por termos relacionados; favoritos, recarga, remoção e atalho exato; preservação dos recursos anteriores; offline; e layouts/teclado. A comparação das oito questões anteriores e do hash das 24 novas confirmou que as 32 questões permanecem intactas, assim como os cinco casos PBL, os oito módulos, os três atalhos, as cinco apostilas e as 96 páginas do livro.

Em larguras de 320, 390 e 1440 pixels, o diálogo ficou rolável verticalmente e sem rolagem horizontal, com textos de pelo menos 14 pixels e links de pelo menos 44 pixels. Escape e Fechar restauraram o foco; o conteúdo de fundo permaneceu inerte. As capturas de celular e computador foram inspecionadas. O foco na interface do Chromium ao sair por Tab foi distinguido de foco no conteúdo de fundo; Tab e Shift+Tab retornaram ao diálogo conforme o comportamento nativo.

Após a ativação do service worker e a recarga offline, o tópico, a busca, os favoritos, as oito medidas e as referências do PDF do caderno funcionaram. Os aliases adicionais “bundle de PAV” e “bundle PAV” foram retestados online e offline no cache final, sem alteração da interface ou do conteúdo clínico. As 96 imagens e o caderno estavam em cache; as apostilas grandes permaneceram sob demanda. Links externos precisam de conexão e apostilas ainda não abertas podem não estar disponíveis offline.

Não houve erros nem avisos JavaScript ou falhas abertas. Servidores e navegadores usados nos testes foram encerrados. Não foram realizados testes em iPhone/Android físicos nem conferida a publicação pública da Cloudflare.

O pacote **conhecendo-a-cti-v10.zip** tem **116 arquivos e 70.140.007 bytes**, com `index.html` na raiz, caminhos seguros, CRCs válidos e arquivos idênticos ao build. Todo o conteúdo de `caderno/` e `materiais/`, incluindo PDFs, 96 imagens e manifestos, permaneceu byte a byte idêntico à v9. SHA-256: `d0c2daa89dca1d7b2ce30d47356cabe3aebe1a81081c97319ed8f20841b760ea`.

O envio do ZIP ao mesmo projeto da Cloudflare atualiza o endereço existente e preserva o QR Code. A publicação no GitHub não atualiza sozinha essa hospedagem. Consulte [Atualizar versão 10](ATUALIZAR-V10.md).
