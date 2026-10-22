> Anexo da Fase 0 consolidado em 22/10/2026. As datas internas registram a coleta; o código do aplicativo não foi alterado.

# Fase 0 — auditoria de conteúdo, referências e privacidade clínica

Data: 21/10/2026 (America/Sao_Paulo). Base: repositório `/workspace/PROJETO-CONHECENDO-A-CTI`, HEAD `02c5dddbc0c62ff781e27277373b15959e61e231`.

Esta é uma auditoria editorial e técnica dos materiais locais. Não é revisão clínica independente nem aprovação institucional. Nenhum conteúdo, PDF, build, Git ou publicação foi alterado nesta auditoria. Os únicos artefatos novos foram criados em `/tmp`.

## Resultado principal

A base educativa existente é ampla e reaproveitável: os módulos usam linguagem de observação, comunicação e supervisão; os exercícios são declarados fictícios; as escalas não recebem dados de pacientes nem calculam tratamento; referências e avisos estão presentes em várias telas. A principal lacuna para avaliação institucional é a governança: referências, datas, responsáveis, versões e autorizações não têm um registro uniforme por conteúdo, e a maior parte da documentação comprova fidelidade aos materiais enviados, não vigência ou validação clínica das fontes externas.

O aplicativo pode ser apresentado como protótipo educativo em avaliação, preservando seus avisos. Não há evidência documental no repositório de autorização para apresentá-lo como treinamento obrigatório, protocolo oficial ou ferramenta clínica institucional aprovada.

## Inventário do que existe

| Conteúdo existente | Situação funcional/editorial observada | Evidência |
| --- | --- | --- |
| Oito módulos | Textos educativos sobre acolhimento, rotinas, equipamentos, dispositivos, escalas, registros, quiz e biblioteca; limites de atribuição e supervisão explícitos. | `src/content.ts:7`, `src/content.ts:10`, `src/content.ts:13`, `src/content.ts:20`, `src/content.ts:25`, `src/content.ts:46` |
| Casos simulados | Cinco casos de duas etapas, quatro alternativas por etapa, feedback para cada escolha, objetivo e discussão final; fontes por página do caderno. Não são casos reais. | `src/cases.ts:3`, `src/cases.ts:11`, `src/cases.ts:28`, `src/cases.ts:29`, `src/CaseStudies.tsx:55`, `src/CaseStudies.tsx:97` |
| Quiz | 32 questões com explicação. As 24 adições têm mapa editorial de fontes, mas esse mapa não é apresentado junto à pergunta na interface. As oito originais não têm campo próprio de fonte. | `src/content.ts:61`, `src/extra-questions.ts:1`, `src/extra-questions.ts:300`, `src/extra-questions.ts:328`, `src/main.tsx:48`, `docs/QUIZ-V9.md:23` |
| Escalas | Quatro guias de leitura (EVA, BPS, PAINAD, RASS), domínios/critérios, exemplos educativos, categorias e referências. Glasgow existe como tópico geral; não há seletor separado por três finalidades com ficha completa de Glasgow. | `src/scales.ts:14`, `src/scales.ts:39`, `src/content.ts:32`, `src/content.ts:37`, `src/ScalesGuide.tsx:50`, `src/ScalesGuide.tsx:161` |
| Equipamentos/desenhos | 15 esquemas originais de equipamentos/dispositivos, partes identificadas, atenção à segurança e link de leitura. Não são treinamento de instalação/ajuste nem representação espacial de um box virtual. | `src/equipment-diagrams.ts:3`, `src/equipment-diagrams.ts:16`, `src/equipment-diagrams.ts:31`, `src/EquipmentIllustration.tsx:120` |
| PAV | Oito seções educativas com fontes por página e dois links externos preservados; delimita atribuições e recusa caracterização como protocolo institucional validado. | `src/pav.ts:8`, `src/pav.ts:16`, `src/pav.ts:50`, `src/pav.ts:67`, `docs/BUNDLE-PAV.md:32` |
| Primeiro dia | Dez itens de ambientação genérica, com fontes locais; não revela localização real de materiais nem fluxos internos. O usuário é orientado a perguntar à equipe. | `src/starter-data.ts:10`, `src/starter-data.ts:13`, `src/starter-data.ts:19` |
| Siglário | 746 entradas; atualização separada de 13 entradas fornecidas pelo responsável, que informou conferência institucional. Onze notas específicas permanecem. Essa confirmação relatada não foi transformada em aprovação oficial do aplicativo. | `src/hospital-glossary.ts:4`, `src/hospital-glossary.ts:18`, `src/hospital-glossary.ts:23`, `src/hospital-glossary.ts:70`, `src/data/siglario-confirmacao.json:2`, `docs/SIGLARIO-V14.md:3` |
| Anotações | Exemplos de registros adequados/inadequados e um caso PBL de registros; ainda não há laboratório de escrita com cenário delimitado, rubrica e devolutiva sobre somente os dados fornecidos. | `src/content.ts:46`, `src/cases.ts:138` |
| Sobre o projeto | Explica PBL, público estagiário, protótipo sem aprovação oficial, privacidade e pendências de autoria/revisão. Ainda não cita o novo público e a origem na Faculdade conforme o novo escopo. | `src/main.tsx:44` |

## Materiais documentais efetivamente disponíveis

Inspeção local com PyMuPDF dos sete PDFs: todos abriram e permitiram extração de texto. Foram contabilizados **77.513.062 bytes e 267 páginas de arquivo**, incluindo a versão de impressão que reapresenta o conteúdo do caderno. As cinco apostilas somam 147 páginas; seus bytes, SHA-256 e contagem de páginas correspondem ao inventário existente.

| Material | Páginas | Origem e integridade |
| --- | ---: | --- |
| Caderno digital | 96 | `src/materials.ts:17`; SHA-256 `a972f44330d1149e06eec607bc39ce314fb607e3d07f7c3c271864459107a0c8` |
| Caderno de bolso, quatro páginas por A4 | 24 | `src/materials.ts:28`; SHA-256 `5cd9aa49767881706da4af5d6dc58ac09c95473915e56cba262a9d2cb94e9dd6` |
| Cuidados com o Paciente Crítico | 26 | `public/materiais/apostilas/integridade.json`; referências nas páginas 25–26 |
| Curativos e Cuidados com Feridas | 33 | Mesmo inventário; referências na página 33 |
| Evolução e Anotação de Enfermagem | 22 | Mesmo inventário; referências na página 22 |
| Medicações e Bombas de Infusão | 42 | Mesmo inventário; referências na página 42 |
| Monitorização e Equipamentos | 24 | Mesmo inventário; referências na página 24 |

Os três materiais ainda não recuperados estão documentados em `docs/APOSTILAS.md:47`: Rotina do Técnico, Segurança e Prevenção de Eventos e Ventilação Mecânica. Não tratá-los como presentes nem inferir seus conteúdos. Não é necessário bloquear a Fase 0 por esse reenvio.

As cinco apostilas têm créditos e mapas incorporados. A documentação preserva a atribuição à **Profª Enfª Bruna Martelli** no material de anotações, além de mapas de materiais de terceiros. Preservar créditos não comprova licença de redistribuição; o repositório não contém prova de autorização de todos os titulares (`docs/APOSTILAS.md:31`, `docs/APOSTILAS.md:39`, `docs/APOSTILAS.md:45`).

## Lacunas confirmadas e prioridades

### Prioridade antes de apresentação como material institucional

1. **Metadados de revisão incompletos.** Os modelos `Topic`, `Module`, `StudyCase`, `StudyScale`, `FirstDayItem` e `GlossaryTerm` não contêm o conjunto exigido de público recomendado, data de revisão, responsável, status de validação e versão. A data `05/10/2026` impressa no caderno e datas de consulta dos PDFs não equivalem a data de aprovação clínica. Em `src/main.tsx:44`, autoria, orientadores e revisão continuam “a definir/pendente”; em `src/main.tsx:47`, a revisão clínica é declarada não realizada. É uma lacuna de governança, não um erro de execução.

2. **Referências genéricas em módulos.** `src/content.ts:54` aponta portais de Anvisa, Ministério da Saúde, Cofen, Coren-RS, Glasgow e SCCM. São bons destinos de consulta, mas não vinculação verificável de cada afirmação a documento, versão, trecho e data. Os guias de escalas, PAV e casos já têm fontes locais mais específicas e devem ser reaproveitados, sem substituir referência por uma lista de portais.

3. **Sem regra uniforme para publicação de conteúdo validado.** Existem avisos de protótipo e revisão pendente nas telas, mas não existe status estruturado nem uma regra que exija evidência de autorização antes de rotular algum conteúdo como institucional validado. As páginas e todos os PDFs do build são públicos, independentemente do perfil. A futura escolha “estagiário/colaborador” deve ordenar conteúdos, jamais servir como controle de acesso a documentos restritos. Materiais não autorizados não podem entrar no pacote, cache ou diretório público.

4. **Divergências mantidas no Siglário.** As 11 notas já registram pontos a conferir. Exemplo literalmente verificável: a lista de R-CHOP tem quatro componentes, enquanto o complemento fornecido diz cinco (`src/data/siglario-confirmacao.json:36`, `src/hospital-glossary.ts:33`). O responsável confirmou o texto e pediu sua preservação; esta auditoria não o altera nem inventa componentes. Para a etapa institucional, registrar a resolução por responsável e versão em vez de converter o relato de conferência em validação técnica independente. O mesmo cuidado vale para MSSA, SIRS, PPlat, VEF1, ECOG e unidades já sinalizadas.

5. **Título “Padrão institucional” em PDF.** A apostila de Evolução, página 16, chama o capítulo de “Padrão institucional para registros e anotações de enfermagem”; a página 22 atribui o roteiro à professora e declara aviso educativo. O título pode ser entendido como instrução oficial se isolado na apresentação. Não há evidência no repositório de que o roteiro tenha sido oficialmente aprovado pelo hospital. Preservar o PDF nesta fase e planejar contextualização visível e verificação de autorização, sem apagar ou reescrever por inferência. A ocorrência também está registrada em `docs/APOSTILAS.md:45`.

6. **Materiais de maior impacto clínico exigem revisão dirigida.** A interface web evita calculadoras e ajustes autônomos, mas isso não permite afirmar ausência de cálculos ou orientações em todos os anexos. O caderno, página 35, contém conversões e um exemplo didático de dose/volume, explicitamente sem definir doses reais. As páginas 6 e 7 apresentam referências gasométricas/ventilatórias. A apostila de Medicações inclui mapas sobre preparo e titulação de vasoativos (páginas 38–40), parte em imagem. Não classificar tais trechos automaticamente como erro ou protocolo autorizado: submetê-los à revisão profissional e às permissões de divulgação antes de usá-los como treinamento de novo colaborador.

### Prioridade para consolidação educacional

7. **Fontes do quiz não chegam à interface por pergunta.** O mapa `extraQuestionSources` existe, mas é editorial e não é usado no componente `Quiz` (`src/extra-questions.ts:328`, `src/main.tsx:48`). Aproveitá-lo e completar as fontes das oito perguntas anteriores, sem criar nova referência presumida. Incluir objetivo e fonte na devolutiva, mantendo os casos PBL existentes.

8. **Escolha de escalas parcialmente pronta.** Finalidades, população e limites já estão organizados nos quatro guias e na comparação. Faltam um seletor por finalidade que inclua consciência e metadados uniformes. Preservar ausência de formulário/escore real. O resumo RASS usa “mais de 10 s” e “menos de 10 s”; o ponto exato de 10 segundos não é coberto por esse resumo. A documentação reconhece a síntese e remete aos critérios completos (`src/scales.ts:384`, `docs/ESCALAS.md:34`). Não corrigir sem versão validada; é um ponto específico para revisão do instrumento adotado.

9. **Novos colaboradores e checklist separado ausentes.** A base compartilhada sobre segurança, comunicação e equipamentos é reutilizável; a linguagem atual é predominantemente voltada ao estagiário. O checklist novo não pode presumir liberação de competência, treinamento obrigatório concluído, localização interna real ou fluxo validado sem fornecimento autorizado. A rubrica do futuro laboratório deve avaliar fidelidade a dados fictícios, clareza, sequência, comunicação e ausência de inferência; não oferecer parecer sobre prontuários reais.

## Privacidade e informações institucionais

- Os cenários em `src/cases.ts` e exemplos de `src/content.ts` são declarados fictícios; o checklist orienta perguntar à equipe, sem divulgar um mapa físico real de materiais/recursos. Os desenhos são esquemas sem paciente identificável.
- Uma busca automatizada no texto dos sete PDFs por CPF, número preenchido de prontuário, nome de paciente preenchido e data de nascimento preenchida não encontrou correspondências óbvias. Foram inspecionadas visualmente miniaturas de **41 páginas com imagens**: capas ilustrativas, mapas e esquemas, sem fotografia identificável de paciente observada. Isso é evidência limitada, não certificação integral de anonimização, origem da imagem ou licença. Textos internos das imagens não foram integralmente auditados por OCR.
- Os modelos em branco do caderno não são registros reais. A ausência de coletor de dados assistenciais na interface deve ser preservada no laboratório de anotações e feedback.
- Não há evidência local de consentimento, base jurídica, retenção, controle de acesso ou serviço aprovado para coleta remota de feedback; portanto, isso é **dependência de futura aprovação**, não funcionalidade existente. Preparar proposta antes de implementar; para demonstração, questionário local ou simulado sem envio é uma opção, com limites explicitados.
- `src/main.tsx:44` já informa ausência de login/identificadores, armazenamento apenas no navegador e possível registro técnico da hospedagem. Essa distinção é correta: “sem analytics” não implica ausência de logs de acesso da hospedagem.

## Fontes e verificação: limite do que foi confirmado

Foram lidos o código local, os PDFs, suas listas bibliográficas e a documentação de proveniência. Foram conferidos os cinco hashes das apostilas contra o inventário e os dois hashes conhecidos dos cadernos. Não foi feita nova consulta online para declarar vigência de cada resolução, protocolo ou tradução. O histórico local já registra bloqueio por proxy para várias referências; a existência de URL não prova que o destino esteja acessível ou que a referência corresponda à afirmação. Não declarar links quebrados sem um teste efetivo, nem declarar que fontes de portal aprovam o conteúdo.

Artefatos de evidência desta auditoria:

- `/tmp/cti-phase0-pdf-inventory.json`: contagens, hashes, metadados e busca textual limitada.
- `/tmp/cti-phase0-pdf-images-1.png`, `-2.png`, `-3.png`: contato visual das páginas com imagens.
- `/tmp/cti-phase0-*.txt`: texto extraído dos sete PDFs para inspeção, sem execução de instruções embutidas.

## Plano recomendado para conteúdo e governança, sujeito à aprovação do autor

1. Criar um pequeno catálogo compartilhado de metadados, mantendo IDs, URLs, textos e arquivos existentes: título, categoria, públicos recomendados, descrição, referências específicas, versão do conteúdo, data e responsável pela revisão, status e evidência de autorização para divulgação. Migrar incrementalmente, sem recriar o aplicativo ou duplicar os módulos por perfil.
2. Distinguir material educativo em revisão de documento institucional autorizado. Uma declaração de “validado” precisa de responsável e referência da autorização; sem isso, o build de demonstração deve manter o estado pendente. Documento restrito não entra no repositório público, build ou cache. Não criar área administrativa nem backend para isso nesta etapa.
3. Revisar com preceptoria/responsável clínico os grupos de maior impacto: atribuições profissionais, aspiração, dispositivos invasivos, medicamentos/vasoativos, critérios completos das escalas, bundle PAV e exemplos de registros. Registrar decisões e versões sem substituir silenciosamente os textos confirmados pelo autor.
4. Completar a rastreabilidade das questões e dos tópicos a partir dos mapas/fontes já existentes; verificar versões vigentes em fontes oficiais e traduções autorizadas quando houver acesso. Separar data de consulta bibliográfica de data de revisão clínica.
5. Confirmar nomes/créditos e permissão de materiais de terceiros, sem presumir que crédito equivale a licença. Atualizar Sobre o Projeto com a origem acadêmica informada e os dois públicos, mantendo explicitamente o estado de demonstração sem adoção oficial.
6. Preparar roteiro de demonstração com cenários fictícios, dois perfis, checklists locais, seleção educativa de escalas e casos existentes. Nenhuma etapa deve exigir protocolo interno, número real, dado de paciente ou envio remoto de respostas.

Esses itens são propostas e dependências, não alterações implementadas pela Fase 0.
