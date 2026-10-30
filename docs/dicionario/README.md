# Dicionário Clínico — entrega para avaliação

Data: **30/10/2026**. Base: `aad89c90e068e7a438239be347c7ac361d6c91ad`. Branch: `modulos/dicionario-clinico`. A hospedagem de produção e o QR Code não foram alterados.

O aplicativo original foi ampliado incrementalmente. O dicionário tem destaque no topo da página inicial, busca local própria, acesso direto no menu lateral e inferior, 30 fichas, favoritos no armazenamento já existente, links compartilháveis e vínculos recíprocos com os materiais do projeto. A busca geral continua disponível e também indexa o módulo e suas fichas.

## Conteúdos entregues e pendências

As 30 fichas apresentam identificação, resumo até 80 palavras, definição, fisiopatologia, causas, manifestações, investigação diagnóstica e tratamento em visão geral, cuidados do técnico e alertas em destaque, dispositivos/escalas relacionados, cenário fictício com resposta comentada, condições associadas e referências. Os resumos maiores têm 67 palavras. Nenhuma ficha inclui doses, ajustes automáticos ou dados de pacientes.

**Todas as fichas estão pendentes de validação clínica, com revisão profissional não realizada e sem responsável ou aprovação institucional inventados.** A conclusão técnica não autoriza uso como protocolo. A conferência editorial realizada durante o desenvolvimento não equivale a revisão clínica habilitada.

| Categoria | Fichas |
| --- | ---: |
| Cardiovasculares | 6 |
| Respiratórias | 6 |
| Neurológicas | 4 |
| Renais e metabólicas | 5 |
| Infecciosas | 4 |
| Gastrointestinais e hepáticas | 3 |
| Hematológicas e outras condições críticas | 2 |

| Ficha | Categoria | Revisão clínica |
| --- | --- | --- |
| Acidente vascular cerebral hemorrágico | Neurológicas | Pendente; não realizada |
| Acidente vascular cerebral isquêmico | Neurológicas | Pendente; não realizada |
| Cetoacidose diabética | Renais e metabólicas | Pendente; não realizada |
| Choque Cardiogênico | Cardiovasculares | Pendente; não realizada |
| Choque hipovolêmico | Hematológicas e outras condições críticas | Pendente; não realizada |
| Choque séptico | Infecciosas | Pendente; não realizada |
| Coagulação intravascular disseminada | Hematológicas e outras condições críticas | Pendente; não realizada |
| Distúrbios do potássio | Renais e metabólicas | Pendente; não realizada |
| Doença renal crônica | Renais e metabólicas | Pendente; não realizada |
| DPOC exacerbada | Respiratórias | Pendente; não realizada |
| Edema agudo de pulmão | Respiratórias | Pendente; não realizada |
| Estado de mal epiléptico | Neurológicas | Pendente; não realizada |
| Estado hiperglicêmico hiperosmolar | Renais e metabólicas | Pendente; não realizada |
| Exacerbação grave da asma | Respiratórias | Pendente; não realizada |
| Fibrilação Atrial | Cardiovasculares | Pendente; não realizada |
| Hemorragia digestiva alta | Gastrointestinais e hepáticas | Pendente; não realizada |
| Infarto Agudo do Miocárdio | Cardiovasculares | Pendente; não realizada |
| Infecção do trato urinário complicada | Infecciosas | Pendente; não realizada |
| Insuficiência Cardíaca | Cardiovasculares | Pendente; não realizada |
| Insuficiência hepática aguda | Gastrointestinais e hepáticas | Pendente; não realizada |
| Insuficiência respiratória aguda | Respiratórias | Pendente; não realizada |
| Lesão renal aguda | Renais e metabólicas | Pendente; não realizada |
| Meningite | Infecciosas | Pendente; não realizada |
| Pancreatite aguda | Gastrointestinais e hepáticas | Pendente; não realizada |
| Pneumonia | Respiratórias | Pendente; não realizada |
| Sepse | Infecciosas | Pendente; não realizada |
| Síndrome Coronariana Aguda | Cardiovasculares | Pendente; não realizada |
| Síndrome do desconforto respiratório agudo | Respiratórias | Pendente; não realizada |
| Traumatismo cranioencefálico | Neurológicas | Pendente; não realizada |
| Tromboembolismo Pulmonar | Cardiovasculares | Pendente; não realizada |

O [inventário de revisão](inventario-revisao.json) relaciona os identificadores, versões e referências de cada ficha. As condições relacionadas são associações educativas; sua apresentação não confirma diagnóstico, causalidade ou coexistência no paciente.

## Rastreabilidade científica

Foram tentados os **25 endereços distintos** vinculados às fichas. A rede do ambiente respondeu `Tunnel connection failed:403 Forbidden` tanto no modo padrão quanto na nova tentativa com escalonamento. **Zero fontes foram verificadas por leitura independente.** Não foi possível confirmar os títulos exatos, versões, vigência ou vinculação de cada afirmação às recomendações. As fontes propostas incluem NICE, KDIGO, SCCM, NHLBI, GINA/GOLD, AHA, AASLD, o consenso indicado no PMC e o Manual MSD. Sua identificação não equivale à confirmação da fonte ou da ficha.

O [registro das tentativas](fontes-acesso.json) contém os endereços e erros. Todas as referências permanecem `verification:pending`, sem `accessedAt` e sem data de publicação presumida. A interface exibe a pendência em cada referência. Portais de diretrizes ou conferências não foram apresentados como suporte confirmado de todas as afirmações. É necessário localizar o documento específico vigente, conferir versões/substituições e revisar integralmente o texto com profissional habilitado antes de validação e aplicação institucional. AASLD, KDIGO e demais documentos que possam ter versões antigas ou preliminares precisam dessa conferência.

## Preservação e organização

- Nove módulos anteriores, primeiro dia e integração, rotinas, escalas, equipamentos/dispositivos, Siglário, anotações, casos/quiz, acolhimento familiar, PDFs, caderno, perfis, busca e calculadora continuam disponíveis.
- A nova navegação móvel tem seis atalhos e preserva os cinco anteriores; o dicionário abre em um toque.
- As relações são cadastradas uma vez e geram os links nos dois sentidos. VNI aponta à definição no Siglário; CNAF e ventilador abrem os tópicos existentes. Não foi inventado um módulo de VNI.
- Nenhuma dependência, conta, armazenamento remoto, banco ou serviço de IA foi adicionado. Favoritos usam `cti-favorites-v1`; não há novas chaves de armazenamento.
- O texto clínico é um chunk independente para reutilizar o cache e manter o código principal abaixo do aviso de tamanho do Vite. O service worker existente inclui o novo chunk e a interface carregada sob demanda.
- Os 108 arquivos de materiais e caderno foram comparados byte a byte com a versão com calculadora. Nove PDFs e 96 páginas do livro foram preservados. Referências e créditos anteriores não foram reescritos.

## Arquivos

Criados: `src/clinical-types.ts`, `src/clinical-dictionary.ts`, `src/clinical-dictionary.test.ts`, `src/ClinicalDictionary.tsx`, `src/ClinicalDictionaryFeatured.tsx`, `src/ClinicalRelated.tsx`, `src/clinical-dictionary.css`, seis arquivos `src/data/clinical-*.ts`, `scripts/check-clinical-browser.mjs`, `scripts/package-clinical-review.py`, o pacote em `downloads/` e esta documentação.

Modificados: `src/main.tsx`, `src/search.ts` e seus testes, `src/favorites.ts` e seus testes, `src/content-registry.ts`, `src/ScalesGuide.tsx`, `src/StarterTools.tsx`, `src/ProjectOverview.tsx`, `scripts/check-content.mjs`, `vite.config.ts` e `README.md`. Mudanças de hospedagem: nenhuma.

O [guia em português](../DICIONARIO-CLINICO.md) explica o uso, a manutenção e a atualização do mesmo projeto na Cloudflare após autorização. O ZIP é uma compilação estática para avaliação, sem dados ou arquivos secretos de configuração.

## Verificação

**125 testes automatizados em 23 arquivos passaram**, incluindo validação dos dados, busca, filtros, catálogos, links e bloqueio de aprovação clínica sem evidências. TypeScript, build e verificações de conteúdo, PDFs, folheto, livro e service worker passaram. O projeto não possui comando de lint separado.

**45 grupos de navegador passaram, sem falhas finais:**14 do dicionário e 31 de regressão dos recursos anteriores, no mesmo build/cache `cti-ae2d21c4a39b`. O dicionário foi conferido em 128 combinações de rota/largura, incluindo todas as 30 fichas, e as regressões em 120 combinações. Larguras 320/390/768/1440 pixels, sem rolagem horizontal nos cenários avaliados. Busca, sete categorias, identificação de revisão pendente, referências, links recíprocos, teclado/foco, cópia de link com alternativa manual, favoritos persistentes e armazenamento bloqueado, nova aba offline e recarga offline passaram. Foram auditadas 12 amostras de contraste do dicionário, com razão mínima 5,60:1, e 10 controles principais, com alvos mínimos 44 pixels; isso não é uma auditoria completa WCAG.

Não houve erros de execução, violações de CSP ou pedidos a serviços externos nos testes de navegação. O catálogo atual contém 903 registros, incluindo o novo módulo e 30 fichas. O runner de regressões anterior foi reutilizado sem alterações; seu identificador interno de fase `calculator` é histórico e o cache registrado comprova o build desta entrega.

Pacote: 128 arquivos, 70.352.761 bytes, SHA-256 `fa7273e4f881acfcc0ed944e534eba5752d03ae2297a61fff584c45af465ce3f`. CRC válido, arquivos idênticos ao `dist`, caminhos seguros, `index.html` na raiz e 108 materiais preservados byte a byte.

- [Resultados estruturados](resultados.json).
- [Testes automatizados](evidencias/testes.txt) e [build](evidencias/build.txt).
- [Navegação do dicionário](evidencias/navegador-dicionario.json) e [regressões anteriores](evidencias/navegador-regressoes.json).
- [Integridade do pacote e materiais](evidencias/pacote.json).
- Capturas: [início no celular](evidencias/inicio-celular.png), [ficha no celular](evidencias/ficha-celular.png), [índice no computador](evidencias/indice-computador.png) e [ficha no computador](evidencias/ficha-computador.png).

O relatório de resultados e os arquivos de evidência acompanham esta entrega. A automação usa Chromium em Linux e servidor local que aplica `dist/_headers`; não representa homologação real na Cloudflare, testes físicos de iPhone/Android, Safari, VoiceOver/TalkBack/NVDA ou certificação WCAG. Fontes bibliográficas e aprovação clínica/institucional continuam pendentes. Nenhum deploy foi realizado.
