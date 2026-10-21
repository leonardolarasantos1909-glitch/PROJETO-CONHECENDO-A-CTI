# Conhecendo a CTI

Protótipo PWA educativo, em português, para acolhimento de estagiários de Técnico em Enfermagem em terapia intensiva. React, TypeScript, Vite, Tailwind CSS e ícones Lucide. Sem login, backend, analytics ou coleta de identificação dos estudantes. Marcações, favoritos, visitas e a página do caderno ficam somente no navegador.

## Acesso ao protótipo e QR Code

Endereço de teste informado pelo autor: https://proud-math-302f.conhecendoacti.workers.dev/ . O QR Code usa a página inicial, sem o fragmento `#acolhimento`.

- [QR Code em PNG](downloads/qr-conhecendo-a-cti.png).
- [Cartaz A4 em PDF](downloads/cartaz-conhecendo-a-cti.pdf).

O conteúdo do QR foi decodificado e conferido localmente. A conexão ao endereço publicado não pôde ser verificada deste ambiente por bloqueio do proxy; confirme em iPhone e Android que a página abre e que módulos, pesquisa e quiz funcionam. Se o endereço mudar, gere e teste outro QR. Os arquivos são para avaliação do protótipo; revisão clínica e institucional continua pendente antes da distribuição aos estagiários.

## Baixar a versão pronta

**Estado de segurança:** houve relato de bloqueio antivírus em um pacote anterior. A versão v10 mantém os recursos anteriores e acrescenta um tópico educativo sobre o bundle de prevenção da PAV; não há resultado de varredura antivírus completa. Os testes de integridade e funcionamento não substituem essa análise. No computador da empresa, encaminhe eventual alerta à TI, sem desativar proteções. [Histórico da versão v2](docs/PACOTE-V2.md).

[Baixar conhecendo-a-cti-v10.zip](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/raw/refs/heads/main/downloads/conhecendo-a-cti-v10.zip)

Este ZIP já está compilado e pronto para upload em hospedagem estática. Para atualizar o endereço atual, envie-o **ao mesmo projeto da Cloudflare**, pelo fluxo de implantação que já funcionou com a v2. Mantenha o arquivo em ZIP para esse envio; não é necessário instalar Node.js. Se o repositório for privado, entre no GitHub com a conta que tem acesso antes de baixar. O [guia para celular](docs/TESTAR-NO-CELULAR.md) orienta iPhone e Android e também descreve uma primeira publicação alternativa em Pages.

Se o download direto não iniciar, abra a [página do arquivo no GitHub](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/blob/main/downloads/conhecendo-a-cti-v10.zip) e use **Download raw file** (ícone de download). A opção **Code → Download ZIP** baixa o código-fonte do repositório e não substitui esse pacote pronto para hospedagem.

O envio ao GitHub guarda o projeto e permite baixar os arquivos; ele não atualiza automaticamente a hospedagem. As alterações aparecem no endereço atual depois de enviar o ZIP v10 à Cloudflare. Mantendo o endereço, o QR Code continua válido.

Consulte também o [passo a passo para atualizar a versão 10](docs/ATUALIZAR-V10.md).

## Desenvolvimento

Requer Node.js 22 ou 24 e npm. Na raiz do repositório:

```sh
npm ci
npm run dev
```

Abra o endereço informado pelo Vite no navegador da sua máquina (porta padrão 5173). No ambiente de onboarding, use requisições locais para validação; não há prévia web integrada garantida. A aplicação usa rotas por fragmento (`#acolhimento`, por exemplo), sem exigir regras especiais de redirecionamento.

## Verificação e versão de produção

```sh
npm test
npm run build
npm run preview -- --port 4173
```

O build confere a correspondência SHA-256 entre o livro e seu PDF de origem, verifica as imagens e os links, verifica TypeScript, gera `dist/` e cria o service worker com a lista exata de arquivos produzidos. As páginas do livro já estão incluídas no repositório; Python é necessário somente para regenerá-las após trocar o PDF, conforme [o guia do livro virtual](docs/LIVRO-VIRTUAL.md).

O servidor de desenvolvimento não registra service worker. Para testar a experiência offline, abra a versão de produção, aguarde a ativação do service worker, recarregue uma vez e use o modo offline do navegador. O cache inicial inclui cerca de 10 MB de arquivos, com as 96 páginas do livro e os dois PDFs do caderno. As cinco apostilas adicionais (cerca de 75 MB no total) são armazenadas sob demanda ao abrir cada PDF completo; não fazem parte desse download inicial. O shell e os conteúdos internos ficam disponíveis; fontes externas exigem conexão. O primeiro acesso precisa de rede. O navegador pode remover caches conforme suas políticas de armazenamento.

## Atualização manual da publicação

Não há publicação automática configurada. O autor informou o endereço de teste na Cloudflare registrado acima. O responsável pode atualizar o mesmo projeto com o ZIP pronto; para gerar um pacote a partir do código, execute `npm ci` e `npm run build` e publique **somente os arquivos de `dist/`**, com `index.html` na raiz. Use HTTPS e cabeçalho `Cache-Control: no-cache` para `index.html`, `sw.js` e manifesto; os arquivos em `assets/` possuem hash e podem ter cache longo. Este protótipo usa caminhos absolutos e não está configurado para subdiretórios como GitHub Pages de projeto. Para isso, adapte conscientemente o `base`, manifesto e caminhos do service worker em uma tarefa de código.

Nenhuma credencial é necessária para rodar localmente. A atualização da hospedagem é feita na conta Cloudflare do responsável. O QR Code incluído aponta para o endereço de teste informado pelo autor e permanece válido enquanto esse endereço for mantido. Teste sua abertura em Android e iPhone; se trocar o domínio ou endereço, gere e confira outro QR.

A instalação PWA pode ser oferecida pelo navegador em dispositivos compatíveis. Veja “Sobre o projeto”.

- **iPhone, no Safari:** Compartilhar → Adicionar à Tela de Início → Adicionar.
- **Android, no Chrome:** menu ⋮ → Adicionar à tela inicial ou Instalar aplicativo → confirmar. Os nomes podem variar conforme a versão.

Se o link abrir dentro do WhatsApp, escolha **Abrir no navegador**; se essa opção não aparecer, copie o endereço e cole no Safari ou Chrome. Instalação e experiência em dispositivos físicos precisam ser verificadas na URL HTTPS final.

## Organização

- `src/content.ts`: módulos, tópicos, fontes de consulta e questões estruturados para atualização.
- `src/scales.ts`, `src/ScalesGuide.tsx` e `src/scales-guide.css`: conteúdo educativo, domínios/critérios e abas acessíveis EVA, BPS, PAINAD e RASS, com referências do caderno.
- `src/scales.test.ts`: conferência dos critérios textuais e dos pontos contra as páginas do caderno.
- `src/main.tsx`: navegação, pesquisa, progresso local, detalhes, quiz e instalação.
- `src/starter-data.ts` e `src/StarterTools.tsx`: checklist do primeiro dia e glossário pesquisável.
- `src/equipment-diagrams.ts` e `src/EquipmentIllustration.tsx`: esquemas originais e legendas dos 15 equipamentos e dispositivos.
- `src/cases.ts` e `src/CaseStudies.tsx`: cinco casos PBL fictícios, feedback por alternativa e discussão final.
- `src/favorites.ts`, `src/Favorites.tsx` e `src/learning-storage.ts`: catálogo seguro de favoritos e armazenamento local de preferências de estudo.
- `src/style.css`: identidade visual, responsividade e acessibilidade.
- `src/content.test.ts`: testes de pesquisa, integridade dos módulos e correção do quiz.
- `public/`: manifesto e ícones próprios, sem identidade visual institucional.
- `scripts/build-sw.mjs`: geração do cache offline a partir do build real.
- `src/materials.ts` e `src/PdfMaterials.tsx`: catálogo e cartões dos cadernos de apoio.
- `src/apostilas.ts` e `src/ApostilaMaterials.tsx`: catálogo das apostilas, cartões na Biblioteca e atalhos nos módulos relacionados.
- `scripts/estilizar-apostilas.py`: adaptação vetorial da paleta, com verificação do conteúdo preservado.
- `scripts/check-apostilas.mjs` e `scripts/check-sw.mjs`: integridade dos PDFs e testes de cache sob demanda e respostas HTTP Range.
- `src/MobileInstructions.tsx`: orientações para salvar PDFs e adicionar o aplicativo à tela inicial em iPhone e Android.
- `src/BookReader.tsx`, `src/book.ts` e `src/book-reader.css`: leitor horizontal e validação do manifesto do livro.
- `scripts/preparar-caderno.py`: extração de texto e links e geração das imagens do livro a partir do PDF.
- `scripts/check-book.mjs`: conferência do livro e do hash de origem antes do build.
- `public/caderno/`: manifesto com texto integral e 96 imagens WebP, incluídos no cache offline.
- `public/materiais/`: cópias de compatibilidade dos PDFs enviados pelo autor, conforme docs/PACOTE-V2.md.

## Conteúdo e limites

Todo conteúdo é **demonstrativo e pendente de revisão clínica**. Os links da biblioteca são portais oficiais de consulta, não referências que comprovem validação de cada afirmação. Os responsáveis devem revisar conteúdo, fontes específicas, atribuições profissionais, versões dos instrumentos e exemplos antes de uso por estagiários. A revisão clínica ainda não tem data ou responsável definido. Os exercícios de escalas trabalham seleção e contexto, sem calculadoras ou pontuações não validadas.

Os exemplos de anotações são fictícios e incompletos; não devem ser copiados para prontuários. O aplicativo não oferece prescrição nem ajuste de ventilação. Os cadernos anexados mantêm o conteúdo original do autor, incluindo quadros de estudo e referências, sujeitos à revisão indicada abaixo. O aplicativo não substitui prescrição, protocolos autorizados ou supervisão do enfermeiro. Não é publicação oficial do hospital citado no contexto do projeto.

Apenas os IDs dos módulos visitados são armazenados em `localStorage`, sem identificação. O botão em “Sobre o projeto” permite apagá-los. Visita não significa conclusão ou certificação. Não há entrada de dados clínicos ou pessoais. Links externos e provedores de hospedagem possuem suas próprias políticas de privacidade.

## Roteiro manual complementar

1. Abrir os oito módulos e um tópico de cada módulo com conteúdo; fechar o diálogo por botão e Escape.
2. Buscar “cânula”, “glicemia” e uma palavra inexistente; limpar o campo.
3. Responder o quiz, verificar explicações, pontuação e reinício; filtrar um assunto.
4. Recarregar e conferir visitas; apagá-las em Sobre o projeto.
5. Navegar com teclado e em largura de celular; verificar ausência de rolagem horizontal.
6. Em Escalas, alternar EVA, BPS, PAINAD e RASS por toque e teclado; abrir as referências e conferir a comparação e o tópico Glasgow. Em Biblioteca científica, abrir “Ler caderno”; testar deslize horizontal, Anterior/Próxima, Índice, salto para uma página, links, texto da página e PDF original. Conferir separadamente o download de impressão.
7. Em produção, conferir manifesto, ativação do service worker e recarregamento offline, incluindo uma página do livro ainda não visitada.
8. Antes de uso educacional real, concluir revisão clínica e testes em iOS/Android físicos.

## Direção atual do projeto

O autor optou por desenvolver **Conhecendo a CTI** como um aplicativo independente, aproveitando a base funcional existente. O desenvolvimento e o uso do aplicativo não dependem do acesso ao Google Sites, de exportações ou do envio de novos PDFs. O aplicativo mantém pesquisa, quiz com explicações, adaptação para celular e recursos de PWA, sem login.

Os oito módulos são:

1. Bem-vindo à CTI.
2. Rotinas da CTI.
3. Equipamentos hospitalares.
4. Escalas clínicas.
5. Dispositivos.
6. Anotações de enfermagem.
7. Quiz interativo.
8. Biblioteca científica.

O conteúdo clínico é demonstrativo e continua pendente de revisão clínica e institucional, conforme os limites descritos acima. Referências específicas, autoria e permissões de eventuais materiais incorporados devem ser conferidas durante essa revisão. O endereço HTTPS de teste e o QR Code já estão registrados acima; essa disponibilidade não implica validação do conteúdo para uso no estágio.

A tentativa anterior de integração com o Google Sites está encerrada. O histórico dessa tentativa é mantido apenas no ambiente de desenvolvimento; solicitações antigas de acesso à rede e de envio de páginas não são pendências da versão atual.

Para usar, salvar os PDFs e testar em iPhone ou Android, consulte [o passo a passo para celular](docs/TESTAR-NO-CELULAR.md).

## Caderno como livro e PDFs

Os dois cadernos enviados pelo autor estão em **Biblioteca científica**, com atalho na tela inicial. Os arquivos distribuídos são cópias de compatibilidade: textos, layout, referências, links e autoria foram conferidos contra os originais; os anexos auxiliares de proveniência C2PA foram omitidos. Os originais permanecem preservados separadamente.

- **Leitura digital:** “Ler caderno” abre `#caderno` dentro do aplicativo, com uma página por vez e deslize horizontal. O leitor tem Anterior/Próxima, contador, Índice, campo para ir a uma página e “Ver texto da página” com o texto integral e os links. Os links internos do índice original continuam navegáveis. “PDF original” abre o PDF usado como fonte em nova aba; “Baixar PDF”, na Biblioteca, permite salvar esse mesmo arquivo. Desde a v8, a leitura retoma a última página válida salva neste navegador; o leitor oferece um botão para voltar ao início.
- **Impressão opcional:** 24 páginas A4 com quatro páginas de bolso por folha (96 páginas lógicas). O botão “Baixar para imprimir” entrega o PDF já diagramado. Imprimir A4, tamanho real/100%, uma página do PDF por folha e frente única; não aplicar novamente a opção de quatro páginas por folha da impressora. Recortar e organizar pela numeração.

Para salvar os PDFs:

- **iPhone, no Safari:** se o documento abrir em vez de baixar, toque em Compartilhar → Salvar em Arquivos e escolha uma pasta.
- **Android, no Chrome:** toque em Baixar ou no ícone de seta para baixo do visualizador de PDF; depois procure o arquivo em Arquivos/Files → Downloads. Os nomes dos controles podem variar.

O deslize, a abertura do PDF, o download, a impressão e o offline precisam ser confirmados nos aparelhos físicos de ambos os sistemas. As imagens do livro preservam a aparência do PDF; a opção de texto facilita a leitura sem depender do tamanho da imagem.

Os PDFs, o manifesto e as imagens do livro entram no cache offline do PWA após instalação completa do service worker em um primeiro acesso online. Esse conjunto, somado ao aplicativo, representa cerca de 10 MB. O comportamento pode depender das políticas de armazenamento do navegador. Não há formulários no aplicativo para coletar dados das folhas de horários. As folhas presentes nos PDFs são modelos em branco; o exemplo de anotação é didático. A inclusão dos arquivos não significa revisão clínica ou validação institucional.

Consulte [o registro de origem e integridade](docs/MATERIAIS-PDF.md) e [o guia de geração e uso do livro virtual](docs/LIVRO-VIRTUAL.md).

## Apostilas temáticas — v5

A Biblioteca inclui cinco apostilas (147 páginas): Cuidados com o Paciente Crítico, Curativos e Cuidados com Feridas, Evolução e Anotação de Enfermagem, Medicações e Bombas de Infusão, e Monitorização e Equipamentos. A adaptação visual usa bordô e sálvia nos elementos vetoriais, preservando os textos, as imagens, as fontes, os créditos, as referências, os links e a paginação. Capas e mapas rasterizados conservam suas cores originais. Os documentos abrem como PDF em nova aba e também podem ser baixados. O caderno com leitor virtual e a versão de bolso continuam disponíveis.

Rotinas, Equipamentos, Dispositivos e Anotações de enfermagem têm atalhos para os materiais relacionados. A busca do início também encontra as apostilas na Biblioteca. As instruções de download para iOS e Android permanecem disponíveis.

As apostilas são guardadas em cache sob demanda, sem acrescentar cerca de 75 MB à instalação inicial. Para uma cópia offline sob controle do usuário, baixe o PDF e abra-o em Arquivos/Downloads. O cache do navegador depende de espaço, recebimento completo e políticas locais, sendo renovado em atualizações.

Os PDFs de Rotina do Técnico, Segurança e Prevenção de Eventos, e Ventilação Mecânica não puderam ser transferidos por excederem 32 MiB. Aguardam reenvio comprimido ou em partes de até 25 MB. Não foram incluídos materiais inventados para esses arquivos. A revisão clínica e institucional permanece pendente. Consulte [o inventário, os créditos e a integridade das apostilas](docs/APOSTILAS.md).

## Escalas clínicas — v6

A opção **Escalas** do menu móvel e **Escalas clínicas** da barra lateral abre `#escalas`. A seção apresenta quatro abas: EVA, BPS, PAINAD e RASS. Cada uma explica finalidade, quando utilizar, domínios observados, leitura, cuidados e referências, com links para as páginas correspondentes do caderno. A comparação distingue autorrelato, observação da dor e avaliação de agitação/sedação. Glasgow continua disponível na mesma seção, e a busca do início inclui o conteúdo ampliado.

A EVA tem uma linha ilustrativa sem medida calibrada; a RASS inclui um resumo educativo dos dez níveis. O conteúdo é para estudo, sem cálculo de escore, dados de paciente, metas universais ou orientação para ajustar medicamentos. Os textos se baseiam no caderno e nos materiais já fornecidos; os PDFs, referências e créditos permanecem intactos. A revisão clínica e institucional continua pendente. Consulte [as fontes e os limites da seção de escalas](docs/ESCALAS.md).

## Itens e critérios das escalas — v7

Cada aba de Escalas mostra a seção **Itens e critérios da escala** após a apresentação. Na BPS, três quadros expansíveis apresentam os critérios de expressão facial, membros superiores e adaptação à ventilação, de 1 a 4 pontos. Na PAINAD, cinco quadros trazem respiração, vocalização, face, linguagem corporal e consolabilidade, de 0 a 2 pontos. Os 27 descritores são transcritos do caderno, com links para as páginas 11–14.

A EVA explica o autorrelato, a marcação e a medida da linha física; contexto e horário não são fatores somados. A RASS mostra os elementos de observação e os dez níveis, incluindo os tempos de contato visual descritos no caderno. A leitura é educativa: não soma respostas de paciente nem define tratamento. Os tempos da RASS são apresentados como resumo da fonte, com remissão ao formulário adotado. Consulte [os critérios, as fontes e as pendências de revisão](docs/ESCALAS.md).


## Ferramentas para o estágio — v8

A página inicial inclui os atalhos **Meu primeiro dia**, **Glossário** e **Meus favoritos**. O checklist tem dez itens marcáveis e o glossário reúne 29 siglas e termos, com busca por aliases e explicações, links relacionados e fontes. Os oito módulos existentes continuam disponíveis; esses atalhos não são módulos adicionais nem alteram a contagem de visitas.

Ao abrir um tópico de Equipamentos hospitalares ou Dispositivos, o diálogo mostra um esquema educativo com partes numeradas, legenda e pontos de atenção. Os quinze tópicos têm ilustrações genéricas originais, sem pacientes, logotipos, parâmetros ou instruções operacionais. O módulo Quiz reúne cinco casos fictícios com duas etapas cada, feedback específico por alternativa e discussão com o preceptor, preservando as oito questões anteriores.

Use **Favoritar** para guardar módulos, assuntos, escalas, termos e o caderno; a lista abre o conteúdo correspondente. A última página do caderno é retomada ao reabrir o leitor e pode ser zerada pelo botão **Voltar ao início do caderno**. Os dados ficam no navegador, sem cadastro ou sincronização. Se o armazenamento estiver bloqueado, as ferramentas continuam em memória com aviso sobre a limitação. **Sobre o projeto → Apagar meus dados de aprendizado** remove somente as quatro chaves desse progresso.

Os recursos internos novos integram o build e seu cache offline. Os PDFs, as 96 imagens do caderno, referências e créditos foram preservados. Autoria, orientação e revisão clínica/institucional continuam pendentes de informações e conferência pelos responsáveis. Consulte [fontes, adaptação e verificação da v8](docs/MELHORIAS-V8.md) e o [passo a passo de atualização](docs/ATUALIZAR-V8.md).


## Quiz ampliado — v9

O **Quiz de revisão**, no módulo Quiz interativo, passa de oito para **32 questões**: as oito originais foram preservadas e foram acrescentadas 24. Os temas são Segurança, Registros, Ética, Escalas, Dispositivos, Equipamentos, Rotinas e Comunicação. Cada questão tem quatro alternativas, uma resposta adequada e uma explicação. O filtro por assunto, a pontuação, o reinício e os cinco casos PBL da v8 foram mantidos. As alternativas e o filtro ficam mais legíveis no celular, com fonte de 14 pixels e controles de pelo menos 44 pixels.

As questões novas usam os módulos e o caderno já fornecidos, com mapa de fontes e revisão educativa em [Quiz v9](docs/QUIZ-V9.md). Não introduzem doses, metas de tratamento, ajustes de suporte ou dados de pacientes. A revisão clínica e institucional continua pendente. O quiz continua sem cadastro e seus resultados não são sincronizados entre aparelhos. Para publicar o pacote no mesmo endereço, siga [Atualizar versão 9](docs/ATUALIZAR-V9.md).


## Bundle de prevenção da PAV — v10

Em **Rotinas da CTI**, o tópico **Bundle de prevenção da PAV** abre um guia com oito seções: higiene das mãos, cabeceira quando indicada, higiene oral conforme POP, circuito e condensado, cuff, secreções e aspiração, avaliação diária da necessidade de ventilação pela equipe e conferência/registro. A tela distingue cuidados acompanhados pelo estagiário de decisões e atribuições da equipe e preserva a avaliação individual e o protocolo do serviço.

A busca encontra “PAV”, “bundle”, “pneumonia associada a ventilacao mecanica” e os assuntos internos do guia. O tópico pode ser favoritado e aberto pelo atalho direto `#rotinas/bundle-de-prevencao-da-pav`. As oito seções são uma organização para estudo, sem formulário assistencial, pontuação ou certificação. Os oito módulos e as 32 questões do quiz continuam disponíveis.

A base são o caderno e as apostilas já fornecidas. Links de Anvisa e Cofen são preservados conforme as referências do caderno; não foi possível recuperar novamente os textos externos. Não são prescritos antisséptico universal, pressão de cuff ou mudanças de sedação/ventilação. A revisão clínica e institucional permanece pendente; veja [fontes e limites do tópico](docs/BUNDLE-PAV.md) e [como atualizar a versão 10](docs/ATUALIZAR-V10.md).
