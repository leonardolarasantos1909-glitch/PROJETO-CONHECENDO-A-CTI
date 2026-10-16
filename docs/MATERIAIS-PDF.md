# Materiais PDF do projeto

Dois arquivos enviados pelo autor para inclusão no aplicativo. A documentação abaixo registra origem e conferência técnica; não constitui revisão clínica.

| Uso | Nome original | Páginas físicas | Arquivo no aplicativo | SHA-256 |
| --- | --- | --- | --- | --- |
| Leitura digital | Caderno_CTI_Adulto_App_A4_Sem_Furos.pdf | 96 A4 | public/materiais/caderno-cti-adulto-digital.pdf | 1643e78fe6e977ca45d6649adedf3dd3f360c3b550a0e8001fc8e1ad7c4f50b5 |
| Impressão opcional | Caderno_CTI_Adulto_4_Por_A4_Atualizado_Sem_Furos.pdf | 24 A4 | public/materiais/caderno-cti-adulto-bolso-a4.pdf | 033f36d3a1cb8c6baecc0214649943d499a91125242da2ccf11580d8fcb9d175 |

Os dois arquivos mantêm a numeração lógica de 01 a 96 e os mesmos textos. A versão de impressão reúne quatro páginas de bolso por A4; seus metadados informam 93 × 140 mm por página de bolso. O aplicativo não a redimensiona nem a identifica como A6 de tamanho exato.

## Preservação e conteúdo

- PDFs originais preservados byte a byte: texto, diagramas vetoriais, links, referências e metadados.
- Referências [1] a [18] nas páginas lógicas 41–44; 27 links externos HTTPS em cada PDF. A versão digital inclui também 12 links internos de navegação.
- A autoria “Leonardo” aparece nos metadados do arquivo para impressão; não há atribuição nominal no corpo dos PDFs. O aplicativo os identifica como materiais enviados pelo autor, sem inventar créditos.
- O próprio material identifica casos didáticos. A página lógica 46 contém um exemplo de anotação; as páginas 47–96 são folhas de horários não preenchidas.
- Não foram identificadas fotografias ou dados reais de pacientes na conferência. Não há JavaScript, ações de execução, formulários interativos ou envio de dados. Os arquivos mantêm o anexo de metadados de proveniência Content Credentials/C2PA presente nos originais.
- Não foram alterados critérios de escalas, parâmetros, referências ou redação. O conteúdo não foi automaticamente convertido em orientação clínica ou novas questões do quiz.

## Uso no aplicativo

Materiais disponíveis na Biblioteca científica e por atalho no início. A versão digital abre em uma nova aba para que o leitor nativo de PDF do navegador gerencie as 96 páginas, inclusive no iPhone. A versão de bolso tem opção de download separada, com instruções de impressão. Há ajuda para salvar em Arquivos no Safari.

Ambos são arquivos estáticos da própria aplicação, sem serviços externos de visualização. O service worker inclui os PDFs no precache e usa a resposta PDF em cache, sem substituí-la pelo HTML de navegação quando offline. A atualização do cache considera os bytes dos PDFs. Os conteúdos ficam disponíveis após um primeiro acesso online e a instalação completa do service worker; armazenamento local e impressão dependem do navegador/dispositivo.

## Impressão opcional

A4, frente única, tamanho real/100% e uma página do PDF por folha. O arquivo já tem quatro páginas de bolso por A4; não selecionar novamente quatro páginas por folha na impressora. Recortar e organizar pela numeração de 01 a 96.

A conferência técnica da preservação dos arquivos não substitui a revisão clínica, bibliográfica ou institucional antes do uso assistencial.
