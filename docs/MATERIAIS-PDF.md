# Materiais PDF do projeto

Dois arquivos enviados pelo autor para inclusão no aplicativo. A documentação abaixo registra origem e conferência técnica; não constitui revisão clínica. A tabela inicial identifica os arquivos originais recebidos. A versão v2 distribui cópias de compatibilidade conforme a seção ao final.

| Uso | Nome original | Páginas físicas | Arquivo no aplicativo | SHA-256 |
| --- | --- | --- | --- | --- |
| Leitura digital | Caderno_CTI_Adulto_App_A4_Sem_Furos.pdf | 96 A4 | public/materiais/caderno-cti-adulto-digital.pdf | 1643e78fe6e977ca45d6649adedf3dd3f360c3b550a0e8001fc8e1ad7c4f50b5 |
| Impressão opcional | Caderno_CTI_Adulto_4_Por_A4_Atualizado_Sem_Furos.pdf | 24 A4 | public/materiais/caderno-cti-adulto-bolso-a4.pdf | 033f36d3a1cb8c6baecc0214649943d499a91125242da2ccf11580d8fcb9d175 |

Os dois arquivos mantêm a numeração lógica de 01 a 96 e os mesmos textos. A versão de impressão reúne quatro páginas de bolso por A4; seus metadados informam 93 × 140 mm por página de bolso. O aplicativo não a redimensiona nem a identifica como A6 de tamanho exato.

## Preservação e conteúdo

- Os originais recebidos permanecem preservados. Nas cópias da versão v2, texto, diagramas vetoriais, links, referências, dimensões, autoria e aparência das páginas foram conferidos contra os originais; o arquivo PDF foi regravado e o manifesto auxiliar C2PA omitido.
- Referências [1] a [18] nas páginas lógicas 41–44; 27 links externos HTTPS em cada PDF. A versão digital inclui também links internos de navegação de ida e volta; a inspeção dos objetos identifica 59 ações GoTo.
- A autoria “Leonardo” aparece nos metadados do arquivo para impressão; não há atribuição nominal no corpo dos PDFs. O aplicativo os identifica como materiais enviados pelo autor, sem inventar créditos.
- O próprio material identifica casos didáticos. A página lógica 46 contém um exemplo de anotação; as páginas 47–96 são folhas de horários não preenchidas.
- Não foram identificadas fotografias ou dados reais de pacientes na conferência. Não há JavaScript, ações de execução, formulários interativos ou envio de dados. Os originais contêm um anexo de proveniência Content Credentials/C2PA. As cópias da versão v2 não incluem esse manifesto auxiliar nem suas assinaturas de proveniência; os metadados de autoria e o conteúdo visível foram preservados.
- Não foram alterados critérios de escalas, parâmetros, referências ou redação. O conteúdo não foi automaticamente convertido em orientação clínica ou novas questões do quiz.

## Uso no aplicativo

Materiais disponíveis na Biblioteca científica e por atalho no início. A versão digital abre em uma nova aba para que o leitor nativo de PDF do navegador gerencie as 96 páginas, inclusive no iPhone. A versão de bolso tem opção de download separada, com instruções de impressão. Há ajuda para salvar em Arquivos no Safari.

Ambos são arquivos estáticos da própria aplicação, sem serviços externos de visualização. O service worker inclui os PDFs no precache e usa a resposta PDF em cache, sem substituí-la pelo HTML de navegação quando offline. A atualização do cache considera os bytes dos PDFs. Os conteúdos ficam disponíveis após um primeiro acesso online e a instalação completa do service worker; armazenamento local e impressão dependem do navegador/dispositivo.

## Impressão opcional

A4, frente única, tamanho real/100% e uma página do PDF por folha. O arquivo já tem quatro páginas de bolso por A4; não selecionar novamente quatro páginas por folha na impressora. Recortar e organizar pela numeração de 01 a 96.

A conferência técnica da preservação dos arquivos não substitui a revisão clínica, bibliográfica ou institucional antes do uso assistencial.

## Cópias de compatibilidade — pacote v2

Os PDFs foram regravados com pypdf, removendo somente os anexos auxiliares C2PA e suas referências. Isso omite a proveniência criptográfica das cópias; não significa que o manifesto fosse malicioso ou que fosse a causa do alerta. Não houve alteração no texto ou layout. Todas as 120 páginas foram comparadas: texto, posições, dimensões, links, metadados e renderização a 72 dpi coincidiram. As cópias passaram na leitura estrita e não contêm anexos ou ações automáticas. Ações de link URI/GoTo foram mantidas.

| Arquivo distribuído v2 | Bytes | SHA-256 |
| --- | --- | --- |
| caderno-cti-adulto-bolso-a4.pdf | 1242866 | 5cd9aa49767881706da4af5d6dc58ac09c95473915e56cba262a9d2cb94e9dd6 |
| caderno-cti-adulto-digital.pdf | 1196355 | a972f44330d1149e06eec607bc39ce314fb607e3d07f7c3c271864459107a0c8 |

Isso é uma conferência estrutural e visual, não uma varredura antivírus nem garantia de segurança. O alerta relatado continua sem causa identificada. Consulte [o registro do pacote v2](PACOTE-V2.md).
