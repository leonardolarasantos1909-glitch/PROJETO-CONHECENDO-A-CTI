# Atualizar o Conhecendo a CTI — versão 13

Baixe [conhecendo-a-cti-v13.zip](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/raw/refs/heads/main/downloads/conhecendo-a-cti-v13.zip). Esse pacote contém o aplicativo pronto; não é necessário instalar programas nem usar terminal.

## Publicar no computador

1. Salve o ZIP em **Downloads**, sem descompactar. Se o download não começar, abra a [página do arquivo no GitHub](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/blob/main/downloads/conhecendo-a-cti-v13.zip) e use o ícone de download. Ele pode aparecer como **Download raw file**. Não use **Code → Download ZIP**, que baixa o código do projeto.
2. Abra [o painel da Cloudflare](https://dash.cloudflare.com/) com a conta que administra o aplicativo.
3. Em **Workers e Pages**, abra o **mesmo projeto** que publica `proud-math-302f.conhecendoacti.workers.dev`. Confira o endereço dentro dele; não crie outro aplicativo.
4. No fluxo de envio de arquivos que você já utilizou, escolha a opção de nova implantação e selecione **conhecendo-a-cti-v13.zip**. Os nomes dos botões variam; pode aparecer **Criar nova implantação**.
5. Confirme **Publicar**, **Implantar** ou o botão equivalente e aguarde a conclusão.
6. Abra [o endereço atual do app](https://proud-math-302f.conhecendoacti.workers.dev/). Se ainda aparecer a versão anterior, feche as abas do aplicativo e abra novamente com internet. No computador, também pode usar **Ctrl + Shift + R**.

Enviar ao GitHub guarda o código e o ZIP, mas não atualiza sozinho a publicação. Ao enviar este pacote ao mesmo projeto da Cloudflare, o endereço e o QR Code continuam válidos.

## Conferir o siglário dentro do app

1. Na tela inicial, toque em **Siglário**. A tela deve mostrar **Siglas e significados**, com **746 entradas** do material fornecido.
2. Pesquise **AAS**, **SpO2** ou **balanço hídrico**. A definição deve aparecer na própria página, sem abrir outro site.
3. Use **Filtrar por inicial**, escolhendo uma letra ou **0–9**. Para restaurar a lista, escolha **Todas as iniciais** ou limpe a pesquisa.
4. Confira o contador. A lista mostra até **40 termos** inicialmente; **Mostrar mais termos** acrescenta mais 40.
5. Procure **HD** e confira as duas entradas com significados diferentes. As grafias e os símbolos recebidos, como **C.**, **CA**, **Ca**, **D+** e **D-**, foram preservados.
6. Marque um termo com **Favoritar**, abra **Meus favoritos** e teste o atalho. Favoritos antigos sem equivalente no novo material levam ao siglário geral; os demais dados de aprendizado continuam no aparelho.
7. Confira as entradas marcadas **Conferir com a fonte**, como **MSSA** e **TG EXT**. Os textos recebidos foram preservados para revisão, sem correções clínicas automáticas.

O conteúdo foi transcrito do texto enviado para o projeto. A consulta funciona dentro do app e não depende de abrir o relatório do Google. Mudanças futuras no relatório não aparecem automaticamente nesta cópia. A revisão clínica e institucional permanece pendente.

## Testar sem internet

Com conexão, aguarde o carregamento completo do aplicativo e recarregue uma vez. Depois, ative o modo avião e teste o **Siglário**, uma pesquisa e o **Ler caderno**. O navegador precisa manter o cache para que a consulta offline funcione. As apostilas continuam sendo guardadas sob demanda; **Baixar PDF** oferece uma cópia separada em Arquivos/Downloads.

## Recursos mantidos

- A busca na tela inicial continua encontrando assuntos, escalas, termos, materiais e casos simulados.
- Os sete PDFs continuam abrindo os arquivos originais no navegador ou no visualizador do aparelho, como na v12. Para retornar, escolha a aba **Conhecendo a CTI**, feche apenas a aba do PDF ou volte pelo ícone do app.
- **Ler caderno** mantém 96 páginas, deslize horizontal, índice e retomada da página salva.
- Os oito módulos, o quiz de 32 questões, os cinco casos, o checklist, os desenhos, os favoritos e o progresso local foram preservados.

No iPhone, use Safari; no Android, Chrome. Se o link estiver dentro do WhatsApp, escolha **Abrir no navegador** ou copie o endereço para o navegador. Os estudantes continuam sem login. As marcações e os favoritos ficam apenas naquele navegador, sem sincronização entre aparelhos.

A v13 passou em 55 testes automatizados, nos testes do service worker, no build e em 11 grupos de verificações no navegador, incluindo pesquisa, favoritos e consulta offline. O ZIP foi conferido e contém os arquivos prontos para publicação. Consulte [origem, fidelidade e conferência do siglário](GLOSSARIO-V13.md) e o [guia para iPhone e Android](TESTAR-NO-CELULAR.md). A conferência em aparelhos físicos e a revisão clínica e institucional continuam pendentes.
