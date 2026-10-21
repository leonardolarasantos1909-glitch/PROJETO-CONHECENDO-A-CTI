# Atualizar o Conhecendo a CTI — versão 12

O arquivo pronto é [conhecendo-a-cti-v12.zip](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/raw/refs/heads/main/downloads/conhecendo-a-cti-v12.zip). Ele contém o aplicativo compilado; você não precisa instalar programas ou usar terminal.

## No computador

1. Clique no link acima e salve o ZIP em **Downloads**, sem descompactar. Se o download não começar, abra a [página do arquivo no GitHub](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/blob/main/downloads/conhecendo-a-cti-v12.zip) e use o ícone de download. Ele pode aparecer como **Download raw file**. Não use **Code → Download ZIP**, pois essa opção baixa o código do projeto.
2. Abra [o painel da Cloudflare](https://dash.cloudflare.com/) e entre na conta que administra o aplicativo.
3. Acesse **Workers e Pages** e abra o **mesmo projeto** que publica `proud-math-302f.conhecendoacti.workers.dev`. Confira o endereço dentro do projeto. Não crie outro aplicativo.
4. Na área de implantações desse projeto, use a opção de enviar arquivos ou criar uma nova implantação que você já utilizou. Os nomes dos botões variam; pode aparecer **Criar nova implantação**. Selecione **conhecendo-a-cti-v12.zip**, mantido em ZIP.
5. Confira a seleção, confirme **Publicar**, **Implantar** ou o botão equivalente e aguarde a conclusão.
6. Abra [o endereço atual do aplicativo](https://proud-math-302f.conhecendoacti.workers.dev/). Se aparecer a versão anterior, feche todas as abas do aplicativo e abra novamente com internet. No computador, também pode recarregar com **Ctrl + Shift + R**.

Enviar o código ou o ZIP ao GitHub não atualiza sozinho o aplicativo publicado. A atualização aparece no endereço depois do envio ao mesmo projeto da Cloudflare. Mantendo esse projeto e endereço, o QR Code existente continua válido.

## Abrir os PDFs e voltar ao aplicativo

1. Abra **Biblioteca científica → Apostilas de estudo** e toque em **Abrir PDF** no material desejado.
2. O link abre o arquivo original no navegador ou no visualizador do celular e solicita outra aba. Use os controles desse visualizador ou o gesto de ampliar com dois dedos. Alguns aparelhos podem baixar o documento; nesse caso, abra-o em **Arquivos/Files → Downloads**.
3. Para retornar no **Safari ou Chrome**, use o botão de abas e selecione **Conhecendo a CTI**, ou feche somente a aba do PDF.
4. Se o PDF abriu em outro aplicativo, use **Voltar** no Android ou o alternador de aplicativos. Se você acessa o Conhecendo a CTI pelo ícone na tela inicial, também pode voltar por esse ícone.
5. Para guardar uma cópia, use **Baixar PDF** ou **Baixar para imprimir**. No iPhone, também é possível usar **Compartilhar → Salvar em Arquivos** com o documento aberto.

O aplicativo não exibe mais a folha do PDF reduzida dentro de sua página. Os controles dentro do documento são os do navegador ou do visualizador. A página do aplicativo permanece disponível para retorno; não é preciso fechar o aplicativo inteiro.

O livro de 96 páginas continua em **Ler caderno**, dentro do app, com deslize horizontal e retomada da última página. **PDF original** abre seu arquivo no visualizador. Links antigos do tipo `#pdf/<id>?page=N` continuam válidos como uma página de acesso ao documento, com **Abrir PDF**, **Baixar PDF**, **Voltar à biblioteca** e **Início**; essa página não carrega automaticamente o PDF.

## Conferir a busca e os recursos preservados

- Na tela inicial, use **Pesquisar no app** com **PAV**, **RASS**, **Curativos** e **bomba de infusão**. Toque em um resultado, teste **Mostrar mais resultados** quando aparecer e use **Limpar pesquisa**.
- Um resultado de PDF leva ao cartão na Biblioteca. A pesquisa não inicia downloads nem pesquisa o texto integral dos arquivos.
- Abra uma referência a uma página do caderno e confira o número no visualizador. Alguns visualizadores podem ignorar o salto inicial; o arquivo original continua disponível.
- Marque um item em **Meu primeiro dia**, use **Favoritar** e confira os atalhos do **Glossário**.
- Abra **Rotinas da CTI → Bundle de prevenção da PAV**, os desenhos em Equipamentos e Dispositivos, os cinco casos simulados e o quiz com **32 questões**.
- Abra **Ler caderno**, avance uma página, saia e volte para conferir a retomada.
- Confira os dois cadernos, as cinco apostilas e as opções de salvar e imprimir.

## No iPhone e no Android

Abra o mesmo endereço pelo QR ou pelo link. No iPhone, use Safari; no Android, Chrome. Se estiver dentro do WhatsApp, escolha **Abrir no navegador** ou copie o link para o navegador.

O primeiro acesso precisa de internet. Aguarde o carregamento completo antes de testar os conteúdos internos e a busca offline. As apostilas são guardadas sob demanda quando recebidas por completo; para uma cópia separada, use **Baixar PDF** e abra o arquivo salvo. O navegador pode limitar ou remover o cache.

As pesquisas não são guardadas. Checklist, favoritos e última página do livro ficam apenas naquele navegador, sem cadastro ou sincronização. Limpar os dados do navegador remove esse progresso.

A versão 12 passou nos 49 testes automatizados, no build e nas verificações de navegador, incluindo abertura original dos sete PDFs, ampliação e retorno ao aplicativo. Consulte [a correção dos PDFs e seu registro de verificação](PDFS-V12.md) e o [guia para iPhone e Android](TESTAR-NO-CELULAR.md). A conferência em aparelhos físicos e a revisão clínica e institucional do conteúdo continuam pendentes.
