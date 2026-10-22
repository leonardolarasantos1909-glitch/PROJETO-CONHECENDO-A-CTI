# Conhecendo a CTI — auditoria e diagnóstico da Fase 0

Consolidação: **22/10/2026**, America/Sao_Paulo. Base examinada: commit `02c5dddbc0c62ff781e27277373b15959e61e231`, correspondente ao pacote v14. Endereço informado pelo responsável: https://proud-math-302f.conhecendoacti.workers.dev/.

O pedido anexado em “Texto colado.txt” foi lido e mantém o mesmo escopo: começar pela auditoria e apresentar diagnóstico/plano antes de mudanças maiores. **Nenhum código do aplicativo, conteúdo, PDF, dependência, configuração de hospedagem ou publicação foi alterado nesta fase.** Foram executados testes/build locais e produzida esta documentação. As Fases 1–7 ainda são propostas.

## Diagnóstico principal

O aplicativo existente oferece uma base educativa funcional e reaproveitável. Não é necessário recriá-lo. O trabalho para avaliação institucional está concentrado em corrigir problemas específicos de acessibilidade/manutenção, ampliar o acolhimento para o segundo público, completar recursos educacionais ainda ausentes e estabelecer rastreabilidade e autorização dos conteúdos.

Os **57 testes automatizados em dez arquivos passaram**, assim como os testes específicos do service worker, TypeScript, compilação e integridade dos materiais. A rodada final de navegador concluiu dez grupos, com 73 destinos únicos e 45 amostras de layout; não houve exceção JavaScript ou aviso de console nos percursos registrados. Isso confirma a linha de base testada e os achados descritos; não constitui validação clínica, certificação de acessibilidade ou aceite institucional.

Há alertas confirmados na cadeia de ferramentas de teste, problemas localizados de navegação/acessibilidade e lacunas de governança. Não foi demonstrado um defeito crítico de execução que exija uma alteração emergencial da publicação. O protótipo continua devendo ser apresentado como **educacional, em avaliação e pendente de validação**, sem afirmar adoção pelo hospital.

## 1. Estrutura, framework e dependências

O repositório tem **213 arquivos versionados**: 51 em `src/`, 110 em `public/`, seis scripts, 23 documentos, 15 arquivos de distribuição e oito arquivos na raiz. Dependências instaladas e gerados locais não entram nessa contagem.

| Parte | Implementação atual |
| --- | --- |
| Interface | React/React DOM 19.3.1, TypeScript 5.7.3 em modo estrito, Lucide 0.468.0. |
| Compilação e estilos | Vite 6.4.4; Tailwind CSS e plugin 4.3.3. |
| Testes | Vitest 3.2.7 e verificação própria do service worker. |
| Navegação | Fragmentos de URL em `src/main.tsx`; componentes próprios, sem dependência de um router externo. |
| Conteúdo | Catálogos separados para módulos, questões, casos, escalas, desenhos, PAV, checklist, Siglário e materiais. |
| Armazenamento | Quatro chaves de progresso em `localStorage`; caches de assets/PDFs no navegador. |
| Documentos | Dois cadernos, cinco apostilas, 96 imagens de páginas e manifesto com transcrição/links do livro. |
| Hospedagem descrita | Upload manual de build/ZIP à Cloudflare. Não há configuração Wrangler, backend ou homologação separada identificada no conjunto rastreado. |

Ambiente utilizado: Node 24.19.0 e npm 11.9.0. `downloads/` tem aproximadamente 692 MB de pacotes/histórico e não faz parte dos arquivos que o aplicativo precisa carregar. Não há login, banco, área administrativa, integração hospitalar ou coletor remoto de uso implementado.

O detalhamento dos componentes, tipos, versões, rotas e referências de código está no [anexo de arquitetura](auditoria-fase-0/arquitetura.md).

## 2. Funcionalidades efetivamente prontas

| Recurso | Estado encontrado |
| --- | --- |
| Módulos | Oito módulos e 36 assuntos: acolhimento, rotinas, equipamentos, escalas, dispositivos, registros, quiz e biblioteca. |
| Busca | 806 registros indexados, pesquisa local por nome/sigla/alias/tema, resultados com categoria e links internos, paginação e consulta offline. |
| Siglário | 746 entradas e 745 grafias distintas; filtro por inicial; duas definições de HD separadas; notas e atualização fornecida pelo responsável preservadas. |
| Primeiro dia | Checklist de dez itens, progresso local, orientações, links e reinício. Não certifica competência. |
| Casos e quiz | Cinco casos fictícios de duas decisões cada, feedback por alternativa, discussão e referências; quiz de 32 questões com explicações. |
| Escalas | EVA, BPS, PAINAD e RASS com guias, critérios e comparação; Glasgow como assunto introdutório. Não há formulário de paciente ou calculadora terapêutica. |
| Equipamentos | 15 desenhos educativos com partes numeradas, descrição, legenda, cuidados de observação e leitura complementar. |
| PAV | Tópico educativo com oito medidas e fontes, sem apresentação como protocolo institucional validado. |
| PDFs/livro | Sete PDFs originais e livro de 96 páginas com navegação horizontal, índice e retomada local; abertura nativa dos PDFs com retorno orientado ao app. |
| Preferências | Favoritos, visitas aos módulos, marcações e página do caderno; exclusão local de progresso. Quiz/casos não salvam um histórico permanente de respostas. |
| Instalação | PWA, orientações para iPhone/Android e acesso por link/QR sem cadastro. Instalação e cache dependem do navegador. |

Os sete PDFs abriram na inspeção local e seus hashes foram conferidos. Somam **267 páginas de arquivo**, incluindo as 24 páginas do caderno para impressão que reapresentam o conteúdo digital. As cinco apostilas somam 147 páginas. Três apostilas anteriormente enviadas continuam documentadas como não recuperadas; não foram tratadas como disponíveis.

## 3. Comparação com os módulos solicitados

| Pedido | Situação real | Incremento necessário |
| --- | --- | --- |
| A — Busca e glossário | Existentes; parciais perante a organização nova. | Acrescentar filtro de categoria à busca geral e metadados editoriais. Manter o nome Siglário e os destinos atuais. |
| B — Checklist do primeiro plantão | Funcional como “primeiro dia”. | Preservar o roteiro e seu progresso; ajustar a apresentação dos dois públicos. |
| C — Checklist de integração | Ausente. | Criar roteiro independente de colaborador, com validação dos itens locais. |
| D — Casos interativos | Funcionais. | Reaproveitar cinco casos; completar governança/revisão e fontes do quiz por pergunta. |
| E — Laboratório de anotações | Laboratório ausente; textos, exemplos e caso de registros já existem. | Acrescentar cenário delimitado, exercício e rubrica sem dados reais ou inferências. |
| F — Seletor de escalas | Parcial: quatro abas e comparação; Glasgow introdutório. | Organizar por dor, sedação/agitação e consciência, sem decisão clínica autônoma. |
| G — CTI virtual | Box interativo ausente; 15 desenhos estáticos reaproveitáveis. | Montar cena fictícia 2D com seleção por toque/teclado e lista textual equivalente. |
| H — Feedback/PBL | Ausente. | Propor questionário demonstrativo/local; coleta remota depende de aprovação de privacidade específica. |

**Os dois perfis ainda não existem.** O aplicativo atende visualmente o estagiário e não tem preferência local ou checklist separado de colaborador. A base comum pode ser preservada e apenas priorizada por perfil, sem bloquear conteúdos gerais.

**Sobre o Projeto já existe e está parcial.** Apresenta origem no estágio/PBL, privacidade, instalação, créditos/revisão pendentes e ausência de aprovação oficial. Falta incorporar a origem na Faculdade informada no novo pedido, o objetivo ampliado, os dois públicos, funcionalidades e roteiro de demonstração. Participantes e revisores não podem ser preenchidos por inferência.

## 4. Todas as rotas e navegação

São **16 rotas-base**, além de variações de assunto, escala, caso, termo e material:

| Destino | Tela |
| --- | --- |
| `#inicio` e entrada sem fragmento | Início com pesquisa, atalhos, progresso e módulos. |
| `#modulos` | Pesquisa e grade de módulos na estrutura da inicial. |
| `#acolhimento` | Acolhimento e acesso ao primeiro dia. |
| `#rotinas` | Organização de rotinas e PAV. |
| `#equipamentos` | Equipamentos e desenhos. |
| `#escalas` | Quatro guias detalhados e tópico Glasgow. |
| `#dispositivos` | Dispositivos e desenhos. |
| `#registros` | Conteúdo e exemplos de anotações. |
| `#quiz` | Casos PBL e quiz. |
| `#biblioteca` | Sete PDFs e seis portais de consulta. |
| `#primeiro-dia` | Checklist do estagiário. |
| `#glossario` | Siglário; rota antiga intencionalmente preservada. |
| `#favoritos` | Conteúdos salvos localmente. |
| `#caderno` | Livro virtual. |
| `#pdf/<id>` | Página leve de compatibilidade com abertura do PDF original. |
| `#projeto` | Sobre, privacidade, instalação e exclusão local de progresso. |

Variantes: `#<módulo>/<assunto>`, `#escalas/<escala>`, `#quiz/<caso>`, `#biblioteca/<material>`, `#glossario/<termo>` e `#pdf/<id>?page=<n>`. A busca do Siglário também lê `?q=`. Rotas-base desconhecidas mostram uma página de destino não encontrado.

O menu desktop tem cinco entradas principais e três ferramentas; a barra móvel tem Início, Módulos, Escalas, Biblioteca e Projeto. Primeiro dia, Siglário e favoritos continuam disponíveis pelos atalhos da inicial e pela navegação de ferramentas. Não são funcionalidades ausentes no celular.

## 5. Problemas confirmados e melhorias recomendadas

| Achado | Evidência/efeito | Encaminhamento |
| --- | --- | --- |
| Alertas em dependências de testes | `npm audit` sinalizou três pacotes de desenvolvimento: dois críticos e um moderado no resumo do npm. São quatro avisos distintos, com contexto descrito no anexo. | Fase 1: migração isolada e testada da cadeia Vitest/mocker/tinypool. Não aplicar correção forçada automaticamente. |
| Contraste e leitura de textos secundários | Amostras de CSS têm razões abaixo de 4,5:1 para texto pequeno: descrições de cards 3,68:1; legenda lateral 3,11:1; rodapé 2,88:1. Parte da tipografia usa 8–12 px. | Fase 1: ajustar tons/tamanhos específicos e verificar os fundos/estados, preservando identidade e composição. |
| Foco no quiz ao avançar/refazer | O botão que tinha foco é removido; o componente não dirige o foco à nova pergunta. Reprodução de navegador registrada no anexo. | Fase 1: direcionar foco e acrescentar identificação textual da escolha/resposta esperada. Reaproveitar o padrão dos casos. |
| Estado da navegação principal | Links principais/móveis não expõem `aria-current`; o item Módulos não recebe seleção visual quando a própria rota é `#modulos`. | Fase 1: corrigir sem redesenhar o menu. |
| Referências/revisão sem estrutura uniforme | Tópicos e perguntas não têm o conjunto de fontes, público, versão, responsável, data e status pedido. Parte das fontes do quiz só existe no mapa editorial. | Fases 3–4: metadados progressivos e fontes por conteúdo/pergunta, sem inventar revisão. |
| Identificadores dependentes do título | Assuntos/favoritos derivam slugs de títulos; associação de quatro escalas depende da ordem em arrays. | Antes de renomear/reordenar: IDs explícitos e migração de atalhos, mantendo compatibilidade. |
| Manutenção concentrada | Shell, roteamento, Sobre e quiz estão em JSX denso em `main.tsx`. Versão npm 0.1.0 não identifica o pacote v14 distribuído. | Extração incremental quando necessária e identificação separada de build/versão editorial. Não trocar framework. |
| Homologação/configuração não reproduzíveis no repositório | Não há Wrangler, CI ou ambiente separado identificado; `_headers` contém regras de cache, sem comprovação de aplicação no ambiente real. | Planejar ambiente separado, responsáveis, rollback e teste de cabeçalhos/MIME após autorização. |

A auditoria de produção das dependências (`npm audit --omit=dev`) retornou **zero alertas**. Isso não certifica segurança e não transforma os alertas das ferramentas em uma exploração demonstrada no site estático. Não foram identificados no código inspecionado backend, analytics, uso de HTML executável vindo de entradas, tokens de serviço ou integração hospitalar. Histórico Git completo e sistemas externos não foram auditados como uma análise de segurança integral.

## 6. Conteúdo clínico, referências, privacidade e autorização

- Existem avisos de protótipo, supervisão e revisão pendente. Fontes dos casos, escalas e PAV frequentemente apontam páginas locais; a biblioteca inclui seis portais. Portais e fidelidade ao PDF não comprovam validade de cada recomendação nem revisão clínica independente.
- Não há regra central que exija evidência antes de rotular um conteúdo como “institucional validado”. O futuro catálogo deverá exigir responsável, data e autorização aplicável para esse rótulo. Documento restrito não pode ser protegido apenas ocultando um link: não deve entrar no pacote público.
- As 13 entradas reenviadas do Siglário foram preservadas conforme a confirmação relatada pelo responsável. Onze notas permanecem, incluindo a divergência entre quatro itens enumerados e “cinco medicamentos” em R-CHOP. Esta fase não altera essas definições.
- A apostila de registros contém o título “Padrão institucional” na página 16, sem evidência de aprovação oficial no repositório. Preservar o arquivo nesta fase; planejar contexto visível e verificação de autorização antes de apresentá-lo como instrução institucional.
- A interface não calcula condutas, mas **não é correto afirmar que todos os anexos estão livres de cálculos ou orientação clínica**: há exemplo didático de dose/volume e mapas de medicamentos/vasoativos já existentes. Esses trechos exigem revisão dirigida, sem alteração ou exclusão automática.
- Foram preservados créditos existentes nos PDFs. Crédito não comprova licença de redistribuição; as autorizações de materiais de terceiros precisam ser confirmadas para a etapa institucional.
- A inspeção textual limitada dos sete PDFs e a observação de 41 páginas com imagens não encontraram correspondências óbvias de dados de pacientes ou foto identificável. Isso não certifica anonimização, licença ou todo texto contido em imagens; OCR e auditoria integral de documentos não foram concluídos.
- A triagem estrutural dos PDFs não encontrou JavaScript/Launch/OpenAction/AA; isso não é varredura antivírus. Não foi atribuída causa ao alerta antigo relatado pelo usuário.
- O armazenamento atual guarda somente IDs de aprendizado e página do livro. Não há formulário assistencial nem coleta remota de feedback. Caches/PDFs baixados podem permanecer no aparelho; um material público não pode ter revogação remota garantida.
- Configuração e retenção dos logs da hospedagem não são demonstradas pelo repositório. “Sem analytics” não equivale a ausência de registros técnicos na Cloudflare.

Ver [auditoria clínica/editorial](auditoria-fase-0/conteudo-clinico.md) e [segurança e implantação](auditoria-fase-0/seguranca.md).

## 7. Testes, critérios de aceitação e limitações

| Critério solicitado | Resultado desta Fase 0 |
| --- | --- |
| 1. Navegadores móveis/desktop | Build local testado no Chromium com larguras móveis e desktop. Safari/iPhone e Android reais não foram testados. |
| 2. Navegação entre módulos | 73 destinos únicos, 32 diálogos de assuntos e sete páginas de acesso aos PDFs percorridos; detalhes e problemas no anexo de navegador. |
| 3. Troca de perfil sem login | Não executável: perfis ainda ausentes. |
| 4. Pesquisa e filtros | Busca e filtro por inicial existentes avaliados. Filtro de categoria geral ainda não existe. |
| 5. Persistência dos checklists | Primeiro dia disponível e testado; checklist de colaborador ausente. |
| 6. Casos clínicos | Os cinco casos fictícios foram percorridos nas duas etapas, com alternativas, feedback, discussão, fontes e repetição. |
| 7. Exercícios de anotação | Não executável: laboratório/rubrica ainda ausentes. Exemplos e caso de registros são recursos distintos. |
| 8. Escalas | Quatro guias/abas e limites educativos avaliados, sem calculadora de tratamento. Seletor completo por finalidade ainda parcial. |
| 9. Acessibilidade do CTI virtual | Não executável: box ainda ausente. Desenhos e legendas existentes foram inspecionados. |
| 10. Dados identificáveis de pacientes | Nenhum achado óbvio na inspeção limitada descrita; ausência integral em todos os documentos/imagens não certificada. |
| 11. Referências | Existentes e inventariadas; rastreabilidade por item e verificação externa de vigência incompletas. |
| 12. Funcionalidades anteriores | 57 testes, testes do service worker e integridade de materiais aprovados; regressões de navegador documentadas. |
| 13. Build/execução/navegação | Build aprovado; sem exceções JavaScript críticas nos percursos registrados. Há defeitos específicos de acessibilidade/navegação a corrigir. |
| 14. Deploy de homologação | Não executado: ambiente separado/configuração/acesso não disponibilizados. Nenhum deploy foi criado ou alterado. |

A tentativa de consultar a URL pública foi bloqueada pelo proxy antes de obter uma resposta do aplicativo (CONNECT 403; HTTP 000). **Isso não demonstra indisponibilidade do site.** Não foi possível confirmar sua versão atual, seus cabeçalhos efetivos, a instalação em aparelhos reais ou a homologação no Workers. Também não foram executados leitores de tela reais, avaliação completa WCAG, pentest, auditoria completa de histórico Git ou conferência online de todas as fontes clínicas.

## 8. Riscos, dependências e decisão seguinte

Para a demonstração: corrigir os problemas confirmados, identificar o protótipo como educacional em avaliação e mostrar apenas cenários fictícios e materiais cuja divulgação esteja autorizada. Para uma implantação oficial: atribuir responsáveis, confirmar fontes/créditos/permissões, revisar conteúdo de maior impacto clínico e aprovar a homologação. A conclusão de checklists não poderá ser apresentada como comprovação de habilitação profissional.

Dependências do responsável: aceite do plano; nomes/créditos; revisão profissional e itens autorizados do novo checklist; confirmação da distribuição de materiais; responsável Cloudflare e ambiente separado; aparelhos/leitores de tela para os ensaios manuais. Nenhuma dessas lacunas deve ser preenchida por inferência.

O [plano detalhado das Fases 1–7](PLANO-APRIMORAMENTO-INSTITUCIONAL.md) descreve alterações, reutilização, testes, critérios de conclusão, privacidade e reversibilidade. **A próxima ação proposta é a Fase 1, após aprovação do diagnóstico e do plano.** A publicação de produção não faz parte desta entrega.

## Anexos de evidência

- [Arquitetura, inventário e comparação A–H](auditoria-fase-0/arquitetura.md).
- [Conteúdo, PDFs, referências e privacidade clínica](auditoria-fase-0/conteudo-clinico.md).
- [Dependências, segurança, offline e Cloudflare](auditoria-fase-0/seguranca.md).
- [Acessibilidade estática e cálculo de contraste](auditoria-fase-0/acessibilidade.md).
- [Navegação, responsividade e ensaios em Chromium](auditoria-fase-0/navegador.md).
- [Resultados e limitações consolidados](auditoria-fase-0/resultados.json).
