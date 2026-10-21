# Atualizar o Conhecendo a CTI — versão 14

Baixe [conhecendo-a-cti-v14.zip](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/raw/refs/heads/main/downloads/conhecendo-a-cti-v14.zip). O pacote contém o aplicativo pronto; não é necessário instalar programas nem usar terminal.

## Publicar no computador

1. Salve o ZIP em **Downloads**, sem descompactar. Se o download não começar, abra a [página do arquivo no GitHub](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/blob/main/downloads/conhecendo-a-cti-v14.zip) e use o ícone de download, que pode aparecer como **Download raw file**. Não use **Code → Download ZIP**, pois essa opção baixa o código do projeto.
2. Abra [o painel da Cloudflare](https://dash.cloudflare.com/) com a conta que administra o aplicativo.
3. Em **Workers e Pages**, abra o **mesmo projeto** que publica `proud-math-302f.conhecendoacti.workers.dev`. Confira o endereço dentro dele.
4. No fluxo de envio de arquivos que você já utilizou, escolha a opção de nova implantação e selecione **conhecendo-a-cti-v14.zip**. O botão pode aparecer como **Criar nova implantação**.
5. Confirme **Publicar**, **Implantar** ou o botão equivalente e aguarde a conclusão.
6. Abra [o endereço atual do aplicativo](https://proud-math-302f.conhecendoacti.workers.dev/). Se ainda aparecer a versão anterior, feche todas as abas do app e abra novamente com internet. No computador, também pode usar **Ctrl + Shift + R**.

O envio ao GitHub guarda o código e o ZIP; a atualização do aplicativo publicado depende deste envio à Cloudflare. Mantendo o mesmo projeto e endereço, o QR Code continua válido.

## Conferir o que mudou

1. Abra **Siglário**. O total continua sendo **746 entradas**.
2. Pesquise **NPT**: a definição deve ser **Nutrição parenteral total**.
3. Pesquise **PPlat** e também **PPlato**: ambos devem encontrar a entrada com o nome visível **PPlat**, mantendo a definição enviada, **Pressão de Plantô**. Se havia um favorito antigo dessa entrada, teste sua abertura.
4. Pesquise **TG EXT**: deve aparecer **Tangente externa**, sem a antiga nota sobre a definição ter vindo separada no primeiro envio.
5. Pesquise **R-CHOP** e **R-CVP**: confira os contextos adicionais fornecidos. O link externo de R-CVP é opcional; o texto da entrada pode ser lido dentro do app.
6. Confira que **MV — Murmúrio vesicular** e as demais definições reenviadas continuam como informadas pelo autor.
7. Use a pesquisa da tela inicial e os favoritos para chegar às mesmas entradas. As marcações e a última página lida do caderno continuam neste navegador.

A informação de que houve conferência com a instituição foi fornecida pelo autor. Ela não representa uma verificação independente ou uma aprovação oficial registrada pela aplicação. Algumas notas específicas de revisão permanecem porque o texto mantido contém divergências, como a enumeração de quatro medicamentos acompanhada da expressão “cinco medicamentos” em R-CHOP. Nenhum medicamento foi acrescentado por suposição.

## Testar no celular e sem internet

No iPhone, abra no **Safari**; no Android, no **Chrome**. Se o link estiver dentro do WhatsApp, use **Abrir no navegador** ou copie o endereço para o navegador. Os estudantes continuam sem login.

Com conexão, aguarde o carregamento completo e recarregue uma vez. Depois, ative o modo avião e teste o **Siglário**, uma pesquisa e o **Ler caderno**. O navegador precisa manter o cache. O link de referência externa exige internet; os textos do Siglário ficam no app. Os PDFs continuam abrindo os arquivos originais no visualizador do aparelho, e as apostilas são guardadas sob demanda.

A v14 passou em **57 testes automatizados**, nos testes do service worker, no build e em **11 grupos de verificações no navegador**, incluindo os textos reenviados, os favoritos e a consulta offline. A integridade do ZIP pronto foi conferida; veja o registro em [Siglário v14](SIGLARIO-V14.md). A conferência em aparelhos físicos e a revisão clínica independente continuam pendentes. Consulte também o [guia para iPhone e Android](TESTAR-NO-CELULAR.md).
