# Guia de Medicamentos — implementação, limites e entrega

Data deste relatório: **31/10/2026**. Módulo desenvolvido na branch `modulos/guia-medicamentos`, a partir da base clínica `b9215a69aecf636352c109a6a6806ab8da657e4e`.

O Guia de Medicamentos é um módulo central de consulta educativa para profissionais e estudantes de enfermagem no contexto do CTI. Foram implementadas **40 fichas**, organizadas em **11 categorias**, com pesquisa própria e global, favoritos, vínculos recíprocos com o Dicionário Clínico e cinco casos fictícios. A implementação técnica não equivale à validação farmacológica ou à aprovação institucional: **todas as fichas e suas fontes permanecem pendentes de revisão clínica**.

## Seleção das 40 fichas

A seleção representa um conjunto inicial para estudo de medicamentos presentes em diferentes contextos de terapia intensiva. Não constitui lista institucional, relação de medicamentos disponíveis em um serviço, ordem de preferência terapêutica ou cobertura completa da farmacoterapia do CTI. As categorias são editoriais; um fármaco pode ter outras classes e usos.

| Categoria | Quantidade | Medicamentos cadastrados |
| --- | ---: | --- |
| Vasoativos | 5 | Noradrenalina; Adrenalina; Dobutamina; Dopamina; Vasopressina |
| Sedativos | 4 | Midazolam; Propofol; Dexmedetomidina; Cetamina |
| Analgésicos | 4 | Fentanila; Morfina; Dipirona; Paracetamol |
| Anticoagulantes | 4 | Heparina não fracionada; Enoxaparina; Varfarina; Rivaroxabana |
| Antiarrítmicos | 3 | Amiodarona; Adenosina; Metoprolol |
| Diuréticos | 2 | Furosemida; Espironolactona |
| Antimicrobianos | 8 | Ceftriaxona; Cefepima; Meropenem; Vancomicina; Linezolida; Metronidazol; Fluconazol; Aciclovir |
| Antieméticos | 2 | Ondansetrona; Metoclopramida |
| Insulinas | 2 | Insulina humana regular; Insulina glargina |
| Eletrólitos | 4 | Cloreto de potássio; Sulfato de magnésio; Gluconato de cálcio; Cloreto de sódio |
| Outros | 2 | Hidrocortisona; Omeprazol |
| **Total** | **40** | **11 categorias** |

O grupo de antimicrobianos inclui antibacterianos, antifúngico e antiviral. A presença de um medicamento neste guia não autoriza sua indicação ou administração.

## Organização das fichas e experiência de uso

Cada registro tipado contém identificador estável, nome genérico, princípio ativo e observações sobre sais/equivalências, aliases, categoria e classe farmacológica. O conteúdo reúne resumo, finalidade, mecanismo de ação, usos educativos no CTI, contextualização das apresentações e vias, efeitos adversos, contraindicações e precauções, cuidados de enfermagem, monitorização, sinais de alerta e vínculos com condições clínicas.

Cada ficha também contém campos próprios para nomes comerciais com rastreabilidade, classificação contextual de medicamento potencialmente perigoso (MPP), referências, versão editorial e situação de revisão. No estado entregue, `clinicalReviewStatus` é `pending` e `reviewedAt` é `null` em todas as 40 fichas. A interface mostra “Pendente de validação clínica” e “Última revisão clínica: não realizada”. A versão editorial não deve ser interpretada como data de revisão profissional.

A tela privilegia o resumo inicial, os cuidados de enfermagem e os sinais de alerta. As demais informações ficam em seções expansíveis, com títulos descritivos. O link de cada ficha pode ser copiado; quando a área de transferência não está disponível, aparece um campo selecionável para cópia manual. Um identificador inexistente apresenta uma mensagem de ficha não encontrada com retorno à pesquisa.

As vias são descritas para reconhecimento educativo e dependem da apresentação exata e da prescrição. O módulo não fornece doses, cálculos de dose, diluições, reconstituição, preparo, compatibilidade, programação de bomba ou ajustes de terapia. A observação de sinais e a comunicação com o enfermeiro e a equipe responsável não substituem avaliação clínica nem protocolos de emergência.

## Pesquisa, filtros, favoritos e conexões

O módulo pode ser aberto em `#medicamentos`; uma ficha usa `#medicamentos/<id>`, por exemplo `#medicamentos/noradrenalina`. A página inicial possui uma área de destaque com pesquisa rápida e acesso à busca completa.

A busca local aceita nome genérico, princípio ativo, aliases, classe farmacológica, categoria e os nomes comerciais verificados que venham a ser cadastrados. Normaliza acentos, maiúsculas e pontuação; termos como “norepinefrina” e “epinefrina” localizam os respectivos aliases. Os filtros por categoria e MPP podem ser combinados à pesquisa. A lista informa a quantidade encontrada e oferece limpeza de filtros quando não há resultados. A busca global do aplicativo inclui o módulo, as fichas e os casos.

**A pesquisa por marca está implementada tecnicamente, mas a cobertura real por marcas está PENDENTE.** As 40 fichas possuem `commercialNames: []`; foram publicados **ZERO nomes comerciais verificados**. Uma marca não deve ser usada como exemplo de pesquisa funcional nesta entrega. O campo somente poderá receber dados depois da conferência de uma bula específica do produto e da apresentação.

O módulo, as fichas e os casos podem ser favoritados pelo mecanismo já existente. Os identificadores usam `module.medicamentos`, `medication.<id>` e `medication-case.<id>`, com a persistência local existente. Não foram criadas novas chaves de armazenamento para o módulo. Pesquisas e respostas dos casos não são enviadas a um servidor.

Os vínculos com o Dicionário Clínico são recíprocos e derivados dos identificadores de condições cadastrados nas fichas: medicamento → condição e condição → medicamentos. Quando há muitos medicamentos relacionados, a ficha clínica permite expandir a lista. Esses vínculos servem para estudo: uma condição relacionada não confirma diagnóstico, indicação automática, escolha terapêutica ou prescrição.

## MPP: escopo e classificação pendente

A sinalização de MPP inclui escopo textual por apresentação, via ou contexto e uma justificativa educativa. Não se deve extrapolar a sinalização de uma formulação intravenosa para todas as apresentações do mesmo princípio ativo. O filtro seleciona os registros sinalizados; não certifica a classificação atual de cada produto.

Todas as classificações usam `verification: 'pending'`. A referência de segurança indicada é o boletim hospitalar do ISMP Brasil de fevereiro de 2019, cuja leitura e vigência não puderam ser confirmadas neste ambiente. A sinalização é uma **proposta editorial pendente**, não adoção de uma lista pela instituição. A ausência de sinalização também não significa ausência de risco.

Antes da homologação, um profissional habilitado deve confrontar o produto, a apresentação e a via com a lista mais recente aplicável e com os procedimentos da instituição. Este trabalho não registra aprovação institucional nem altera protocolos locais.

## Cinco casos fictícios

O acesso geral é `#medicamentos/casos`. Cada caso apresenta cenário fictício, pergunta, três alternativas, feedback específico e possibilidade de tentar novamente. As respostas ficam apenas no estado da tela, sem cadastro de pacientes, login ou certificação de competência.

| Caso | Tema educativo |
| --- | --- |
| O mesmo nome não garante a mesma apresentação | Conferir produto, prescrição e via; esclarecer divergências antes de administrar. Aplicável a todas as fichas. |
| Alarme durante uma infusão prescrita | Observar deterioração e comunicar imediatamente, sem ajustar autonomamente a bomba ou a terapia. |
| Uma alteração durante o uso de anticoagulante | Reconhecer e comunicar sangramento novo e sintomas associados. |
| Mudança de comportamento no acompanhamento da glicemia | Comunicar alterações, acompanhar a pessoa e realizar apenas as verificações previstas dentro da própria competência. |
| Sintomas novos durante tratamento prescrito | Priorizar avaliação e ajuda diante de manifestações respiratórias e outros sintomas novos. |

As fichas apontam para casos pertinentes; os casos permitem retornar ao guia e estudar os medicamentos relacionados. Cenários e feedbacks também aguardam revisão clínica e institucional.

## Fontes, tentativas de acesso e lacunas reais

Foram cadastrados os seguintes endereços para futura conferência:

| Fonte indicada | Escopo cadastrado | Situação em 31/10/2026 |
| --- | --- | --- |
| [Bulário Eletrônico da Anvisa](https://www.gov.br/anvisa/pt-br/sistemas/bulario-eletronico) | `lookup_portal` | Consulta bloqueada com **HTTP 403**, tanto na execução padrão quanto na tentativa com `require_escalated`. |
| [ISMP Brasil — Medicamentos potencialmente perigosos de uso hospitalar, fevereiro de 2019](https://www.ismp-brasil.org/site/wp-content/uploads/2019/02/615-boletim-ismp-fevereiro-2019.pdf) | `safety` | Consulta ao PDF bloqueada com **HTTP 403**, tanto na execução padrão quanto na tentativa com `require_escalated`. Não foi possível ler o documento nem confirmar sua vigência ou eventual substituição. |

O portal da Anvisa é um ponto de pesquisa; **não é uma bula aprovada específica** e não comprova fabricante, registro, sal, apresentação, vias ou afirmações farmacológicas de nenhuma ficha. O boletim do ISMP é uma fonte indicada para segurança; não substitui uma bula e não valida indicações, vias ou preparo de um produto.

Foram conferidas **ZERO bulas aprovadas específicas de medicamentos** nesta execução. Foram publicados **ZERO nomes comerciais verificados**. Não há datas de acesso preenchidas nas fontes pendentes. A data deste relatório não é uma data de consulta bem-sucedida às fontes, nem uma data de revisão clínica.

Por isso, o módulo está implementado para revisão, mas **não cumpre ainda a verificação clínica integral das fichas nem a cobertura de nomes comerciais**. Essas pendências estão visíveis no aplicativo. Não se afirma que todos os requisitos clínicos tenham sido verificados.

## Arquivos envolvidos e manutenção

Os grupos abaixo correspondem aos arquivos criados ou modificados na implementação do módulo; não representam auditoria de cada linha do repositório:

- Dados e contrato: `src/medication-types.ts`, `src/medication-guide.ts`, `src/medication-sources.ts` e os cinco arquivos `src/data/medications-*.ts`.
- Interface: `src/MedicationGuide.tsx`, `src/MedicationFeatured.tsx`, `src/MedicationLinks.tsx`, `src/MedicationCases.tsx`, `src/medication-guide.css` e `src/medication-cases.css`.
- Casos educativos: `src/medication-cases.ts`.
- Integração: `src/main.tsx`, `src/ClinicalDictionary.tsx`, `src/ProjectOverview.tsx`, `src/content-registry.ts`, `src/search.ts` e `src/favorites.ts`.
- Verificações e compilação: `scripts/check-content.mjs`, `scripts/check-medication-browser.mjs`, `src/medication-guide.test.ts`, ajustes nos testes existentes de pesquisa e favoritos e `vite.config.ts`.
- Documentação: este arquivo, `docs/GUIA-MEDICAMENTOS.md`, e a atualização do `README.md`.

O conteúdo permanece em arquivos TypeScript do projeto, sem painel administrativo institucional, serviço de backend ou login. Não foram adicionadas dependências para este módulo. O desenvolvimento e a reconstrução do pacote usam as ferramentas já declaradas no projeto; a pessoa que recebe o pacote estático compilado não precisa instalar Node ou dependências para publicá-lo.

Para atualizar conteúdo, editar o arquivo de dados pertinente e conservar o contrato em `medication-types.ts`. O validador `assertMedications` verifica integridade editorial, identificadores e princípios ativos duplicados, categorias, campos obrigatórios, vínculos clínicos, referências HTTPS e consistência das pendências. Esse validador não prova a correção farmacológica do texto.

Para cadastrar uma marca no futuro, primeiro localizar e conferir a **bula aprovada específica do produto**, fabricante/registro e apresentação. A referência precisa ter `scope: 'product_label'`, `verification: 'verified'` e uma data real de acesso em `accessedAt`. O nome comercial precisa indicar `name`, `presentation`, `referenceId` e uma data real em `verifiedAt`; o `referenceId` deve apontar para aquela referência conferida. O validador rejeita marcas sem essa evidência. Um portal genérico ou a simples existência de um endereço não satisfaz essa exigência.

A revisão clínica exige profissionais habilitados e governança editorial própria. O contrato atual mantém todas as revisões pendentes e `reviewedAt: null`; uma futura mudança de status deve ser implementada com rastreabilidade real, revisão do contrato e das verificações, sem preencher datas ou atribuir aprovação por conveniência.

## Compilação, cache e uso sem conexão

O módulo foi integrado à arquitetura estática existente. O cache e o service worker existentes continuam responsáveis pelo uso sem conexão após a carga inicial bem-sucedida e a instalação do cache pelo navegador. Um primeiro acesso completamente sem rede não baixa o aplicativo. Links externos da Anvisa e do ISMP dependem de acesso à internet e de disponibilidade dos servidores.

O trabalho preserva o mecanismo existente de cache e os PDFs antigos do projeto. A entrega não remove nem substitui os materiais anteriores pelo guia. Passaram **136 testes automatizados em 24 arquivos**, o build com TypeScript e as verificações editoriais, PDFs, livro, folheto e service worker. Passaram **59 grupos de testes no Chromium/Linux**: 14 do guia, 14 do Dicionário Clínico e 31 de regressões anteriores, no mesmo cache `cti-d8f7e0ea4627`. Foram conferidas 440 combinações de rota/largura (320/390/768/1440 pixels), sem falhas finais, erros de execução, violações de CSP ou chamadas externas. Todos os 108 materiais/caderno, incluindo nove PDFs e 96 páginas do livro, permaneceram idênticos byte a byte à entrega anterior. [Resultados, evidências e limitações](medicamentos/README.md). Esses testes não representam revisão clínica, testes em dispositivos físicos/Safari/leitores de tela ou homologação na nova conta Cloudflare.

## Pacote e publicação em outra conta Cloudflare

**Não é necessário recriar o código por causa da perda de acesso à conta Cloudflare.** O projeto já está disponível no repositório GitHub e no pacote de entrega. Uma nova conta pode hospedar uma nova publicação do aplicativo estático, após autorização para publicar e a homologação adequada. Esta entrega **não foi publicada automaticamente**.

O pacote estático final desta entrega está disponível em `downloads/conhecendo-a-cti-guia-medicamentos.zip`. Ele contém o resultado compilado destinado à hospedagem; o ZIP de código-fonte baixado do GitHub tem outra finalidade e não deve ser enviado como se fosse o site pronto.

Na nova conta, usar a área de **Workers e Pages** e a opção de criação/envio de site estático que estiver disponível no painel. Os nomes e caminhos da interface podem variar. Se o painel oferecer envio de ZIP, selecionar o pacote estático compilado. Se exigir uma pasta, extrair o pacote e selecionar a pasta que contém `index.html` na raiz, junto dos recursos compilados e materiais. Não é preciso instalar Node ou executar uma compilação no computador da pessoa que publica quando se utiliza esse pacote pronto.

Depois de uma publicação efetiva, verificar na URL recebida a página inicial, o guia, os favoritos, a busca, os casos, o Dicionário Clínico, a biblioteca e os PDFs. A publicação e os testes de acesso público exigem a conta de destino; um pacote local não comprova que o site foi publicado.

O endereço antigo em `workers.dev` normalmente **não pode ser preservado em uma nova conta**. Isso dependeria da recuperação da conta anterior ou de condições de controle do domínio que precisariam ser verificadas. Se houver domínio próprio sob controle, é possível avaliar sua configuração para a nova hospedagem. Sem isso, haverá uma nova URL.

Os favoritos, checklists e a página do caderno são vinculados ao navegador e ao endereço do aplicativo. Se o endereço mudar, esse progresso local não é transferido automaticamente para a nova origem. O código e os PDFs continuam preservados.

O QR code e os links de divulgação precisam ser atualizados **somente quando a nova URL real estiver conhecida e testada**. Não foi inventado endereço de substituição nem gerado QR code para uma publicação inexistente. A recuperação da conta antiga, quando possível, continua sendo uma alternativa para manter o acesso anterior.

## Roteiro para quem utiliza o guia

1. Abra o aplicativo e toque em **Guia de Medicamentos**, no destaque da página inicial ou na navegação.
2. Pesquise um nome genérico, princípio ativo, alias ou classe; por exemplo, “noradrenalina” ou “norepinefrina”. Use a categoria para restringir a lista.
3. Ao usar o filtro de MPP, leia o escopo e a justificativa na ficha. A classificação permanece pendente e não se aplica automaticamente a qualquer apresentação.
4. Leia o resumo, os cuidados de enfermagem e os sinais de alerta. Expanda as demais seções para estudo e confira a situação das referências.
5. Favorite uma ficha ou copie seu link para reencontrá-la. Use os vínculos para relacionar o conteúdo às condições do Dicionário Clínico.
6. Entre em **Praticar com casos fictícios**, escolha um dos cinco cenários e leia o feedback. O exercício não autoriza condutas e não certifica competência clínica.

Em situações reais, seguir prescrição, bula da apresentação efetiva, protocolos aplicáveis, supervisão profissional e fluxo de comunicação da instituição. O guia entregue é material educativo em revisão.
