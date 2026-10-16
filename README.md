# Conhecendo a CTI

Protótipo PWA educativo, em português, para acolhimento de estagiários de Técnico em Enfermagem em terapia intensiva. React, TypeScript, Vite, Tailwind CSS e ícones Lucide. Sem login, backend, analytics ou coleta de identificação dos estudantes.

## Acesso ao protótipo e QR Code

Endereço de teste informado pelo autor: https://proud-math-302f.conhecendoacti.workers.dev/ . O QR Code usa a página inicial, sem o fragmento `#acolhimento`.

- [QR Code em PNG](downloads/qr-conhecendo-a-cti.png).
- [Cartaz A4 em PDF](downloads/cartaz-conhecendo-a-cti.pdf).

O conteúdo do QR foi decodificado e conferido localmente. A conexão ao endereço publicado não pôde ser verificada deste ambiente por bloqueio do proxy; confirme no iPhone que a página abre e que módulos, pesquisa e quiz funcionam. Se o endereço mudar, gere e teste outro QR. Os arquivos são para avaliação do protótipo; revisão clínica e institucional continua pendente antes da distribuição aos estagiários.

## Baixar a versão pronta

**Estado de segurança:** houve relato de bloqueio antivírus no pacote anterior. A versão v2 é uma cópia de compatibilidade com PDFs regravados, não uma versão certificada por antivírus. No computador da empresa, peça à TI que analise o novo pacote antes de abri-lo ou utilizá-lo; não ignore alertas. [Detalhes da alteração e limites da verificação](docs/PACOTE-V2.md).

[Baixar conhecendo-a-cti-v2.zip](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/raw/refs/heads/main/downloads/conhecendo-a-cti-v2.zip)

Este ZIP já está compilado e pronto para upload em hospedagem estática, como Cloudflare Pages. Salve sem descompactar para o fluxo de upload direto do Pages. Não é necessário instalar Node.js para usar esse pacote. Se o repositório for privado, entre no GitHub com a conta que tem acesso antes de baixar.

Se o download direto não iniciar, abra a [página do arquivo no GitHub](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/blob/main/downloads/conhecendo-a-cti-v2.zip) e use **Download raw file** (ícone de download). A opção **Code → Download ZIP** baixa o código-fonte do repositório e não substitui esse pacote pronto para hospedagem.

O envio ao GitHub guarda o projeto e permite baixar os arquivos. Não há hospedagem do aplicativo ou GitHub Pages ativado por este envio.

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

O build verifica TypeScript, gera `dist/` e cria o service worker com a lista exata de arquivos produzidos. O servidor de desenvolvimento não registra service worker. Para testar a experiência offline, abra a versão de produção, aguarde a ativação do service worker, recarregue uma vez e use o modo offline do navegador. O shell e os conteúdos internos ficam disponíveis; fontes externas exigem conexão. O primeiro acesso precisa de rede. O navegador pode remover caches conforme suas políticas de armazenamento.

## Publicação (apenas com aprovação)

Não há publicação automática configurada. Após aprovação do responsável, execute `npm ci` e `npm run build`, e publique **somente `dist/`** em uma hospedagem estática com HTTPS na raiz de um domínio. Use cabeçalho `Cache-Control: no-cache` para `index.html`, `sw.js` e manifesto; os arquivos em `assets/` possuem hash e podem ter cache longo. Este protótipo usa caminhos absolutos e não está configurado para subdiretórios como GitHub Pages de projeto. Para isso, adapte conscientemente o `base`, manifesto e caminhos do service worker em uma tarefa de código.

Nenhuma credencial é necessária para rodar localmente. Credenciais da hospedagem só serão necessárias quando for escolhida e autorizada a publicação. Depois que existir uma URL HTTPS definitiva, gere o QR Code apontando para ela e teste com Android e iPhone. Nenhum QR Code definitivo é incluído nesta versão.

A instalação PWA pode ser oferecida pelo navegador em dispositivos compatíveis. Veja “Sobre o projeto”. No Safari do iPhone, utilize Compartilhar → Adicionar à Tela de Início. Instalação e experiência em dispositivos físicos precisam ser verificadas na URL HTTPS final.

## Organização

- `src/content.ts`: módulos, tópicos, fontes de consulta e questões estruturados para atualização.
- `src/main.tsx`: navegação, pesquisa, progresso local, detalhes, quiz e instalação.
- `src/style.css`: identidade visual, responsividade e acessibilidade.
- `src/content.test.ts`: testes de pesquisa, integridade dos módulos e correção do quiz.
- `public/`: manifesto e ícones próprios, sem identidade visual institucional.
- `scripts/build-sw.mjs`: geração do cache offline a partir do build real.
- `src/materials.ts` e `src/PdfMaterials.tsx`: catálogo e cartões dos PDFs de apoio.
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
6. Em produção, conferir manifesto, ativação do service worker e recarregamento offline.
7. Antes de uso educacional real, concluir revisão clínica e testes em iOS/Android físicos.

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

O conteúdo clínico é demonstrativo e continua pendente de revisão clínica e institucional, conforme os limites descritos acima. Referências específicas, autoria e permissões de eventuais materiais incorporados devem ser conferidas durante essa revisão. A publicação com HTTPS e o QR Code definitivo continuam sujeitos à definição da hospedagem e à autorização do responsável.

A tentativa anterior de integração com o Google Sites está encerrada. O histórico dessa tentativa é mantido apenas no ambiente de desenvolvimento; solicitações antigas de acesso à rede e de envio de páginas não são pendências da versão atual.

Para testar usando somente um iPhone, consulte [o passo a passo de publicação e teste](docs/TESTAR-NO-IPHONE.md).

## Cadernos em PDF

Os dois cadernos enviados pelo autor estão em **Biblioteca científica**, com atalho na tela inicial. Os arquivos distribuídos são cópias de compatibilidade: textos, layout, referências, links e autoria foram conferidos contra os originais; os anexos auxiliares de proveniência C2PA foram omitidos. Os originais permanecem preservados separadamente.

- **Leitura digital:** caderno completo com 96 páginas. O botão “Ler caderno” abre o leitor nativo do navegador em nova aba; “Baixar PDF” permite salvar o arquivo.
- **Impressão opcional:** 24 páginas A4 com quatro páginas de bolso por folha (96 páginas lógicas). O botão “Baixar para imprimir” entrega o PDF já diagramado. Imprimir A4, tamanho real/100%, uma página do PDF por folha e frente única; não aplicar novamente a opção de quatro páginas por folha da impressora. Recortar e organizar pela numeração.

No iPhone, se o Safari abrir o PDF em vez de baixá-lo, usar Compartilhar → Salvar em Arquivos. A impressão e a abertura no leitor nativo precisam ser confirmadas no dispositivo do usuário.

Os PDFs entram no cache offline do PWA após instalação completa do service worker em um primeiro acesso online (aproximadamente 2,3 MiB adicionais). O comportamento pode depender das políticas de armazenamento do navegador. Não há formulários no aplicativo para coletar dados das folhas de horários. As folhas presentes nos PDFs são modelos em branco; o exemplo de anotação é didático. A inclusão dos arquivos não significa revisão clínica ou validação institucional.

Consulte [o registro de origem e integridade](docs/MATERIAIS-PDF.md).
