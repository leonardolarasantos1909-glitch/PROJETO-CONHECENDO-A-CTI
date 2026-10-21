# Leitura de PDFs com retorno ao aplicativo — v11

As apostilas, o PDF original do caderno, a versão de impressão e as referências locais abrem no leitor interno `#pdf/<id>?page=N`. **Voltar à biblioteca** e **Início** ficam no topo, inclusive durante o carregamento, erros e rolagem. Os PDFs não substituem a navegação do aplicativo nem exigem fechar sua janela.

## Controles

- Uma página por vez, com **Anterior**, **Próxima**, contador e campo **Ir para página**.
- Ampliação de 100% a 200%, com rolagem interna quando a página ampliada for maior que a tela.
- **Ver texto e links da página** apresenta o texto extraído sem resumo e os links recuperados. Links internos mudam a página; links HTTP(S) e e-mail abrem no navegador. O desenho da página continua sendo a referência visual para tabelas e colunas.
- **Baixar PDF** preserva o arquivo e o nome de download. Salvar usa os controles do iPhone/Safari ou Android/Chrome descritos na Biblioteca. Sites externos continuam fora do leitor do aplicativo.
- O caderno em imagens, com deslize horizontal, índice e última página salva no aparelho, continua em **Ler caderno**. O novo leitor de PDFs não acrescenta armazenamento de progresso ou cadastro.

O retorno leva ao cartão do material na Biblioteca e o coloca em foco. **Início** volta ao campo de pesquisa. Apenas os sete documentos conhecidos são aceitos pela rota; não há campo para carregar arquivos ou URLs arbitrárias. Referências a uma página específica são mantidas.

## Arquivos, privacidade e offline

PDF.js **6.4.299**, distribuição legacy, é carregado em um módulo separado ao abrir o leitor. Worker, fontes, mapas e recursos WASM estão na mesma hospedagem, sem CDN, login ou analytics. A licença Apache-2.0 e as licenças dos recursos são incluídas em `pdfjs/`. Para desenvolver, use Node.js 22 a partir de 22.13, ou 24+, e `npm ci`.

`npm run build` copia os recursos do pacote instalado para `dist/pdfjs/` antes de gerar o service worker. `npm run dev` prepara esses arquivos em `public/pdfjs/`, uma pasta gerada e ignorada pelo Git. O cache inicial completo tem aproximadamente **16 MB**, incluindo aplicativo, leitor, dois cadernos, manifesto e 96 imagens. As cinco apostilas, cerca de 75 MB no total, continuam fora desse download inicial e são armazenadas sob demanda ao abrir um documento completo. A busca e a visita à Biblioteca não baixam essas apostilas.

O primeiro acesso exige internet. Após o cache completo, o leitor funciona offline para documentos disponíveis no aparelho. Se um PDF não tiver sido guardado, ou o navegador remover seu cache, a tela informa a falha e mantém os botões para retornar e tentar novamente. **Baixar PDF** oferece uma cópia separada sob controle do usuário. O navegador pode limitar ou remover caches; não há garantia de armazenamento permanente.

Uma única página é renderizada por vez, com limite aproximado de oito milhões de pixels por canvas e cancelamento ao mudar de página ou sair. Texto, links, imagens, créditos e referências dos PDFs originais não foram alterados. Os arquivos mantêm os hashes da v10. Não há campos para pacientes, doses ou ajustes de tratamento acrescentados por esta melhoria. A revisão clínica e institucional do conteúdo permanece pendente.

## Conferência

Os 49 testes automatizados e as verificações de service worker e build passaram. O Chromium passou em oito grupos de verificações, em larguras de 320, 390 e 1440 pixels: primeira e última página dos sete PDFs, próxima/anterior, salto por número, ampliação, texto e links, retorno ao cartão, retorno ao início, botões durante falha offline e leitura após recarregar sem rede. Não houve erros JavaScript ou avisos no console. As capturas do leitor e da busca foram inspecionadas visualmente. Safari/iPhone e Chrome/Android físicos continuam no [roteiro manual](TESTAR-NO-CELULAR.md); emulação de tamanho de tela não substitui esses testes.
