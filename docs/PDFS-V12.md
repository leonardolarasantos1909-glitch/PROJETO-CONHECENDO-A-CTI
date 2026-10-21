# Abertura dos PDFs originais — v12

A v11 colocou as folhas A4 em um leitor dentro da página do aplicativo. No celular, elas ficaram pequenas e a abertura não correspondeu ao que o autor esperava de um PDF. A v12 substitui essa leitura como padrão: **Abrir PDF** aponta diretamente ao arquivo original no navegador ou no visualizador do aparelho.

## O que mudou

As cinco apostilas, a versão de impressão, o PDF original do caderno e as referências locais usam links diretos aos arquivos. O link solicita uma nova aba para preservar a página do aplicativo. Dependendo do sistema e do navegador, o arquivo pode abrir em outro visualizador ou ser baixado. O gesto de ampliar e os controles de leitura são oferecidos pelo visualizador escolhido pelo aparelho.

A visualização em canvas com PDF.js foi retirada, incluindo dependência, worker, fontes, mapas e recursos WASM. O aplicativo deixa de reduzir a folha ao espaço de um cartão. As apostilas não são carregadas automaticamente pela busca, pela visita à Biblioteca ou pela página de compatibilidade; os dois cadernos permanecem no cache inicial.

A rota antiga `#pdf/<id>?page=N` continua aceita para os sete documentos conhecidos. Ela apresenta uma página leve com **Abrir PDF**, **Baixar PDF**, **Voltar à biblioteca**, **Início** e acesso à página indicada. Ela não renderiza o documento nem aceita URLs ou arquivos arbitrários. As referências mantêm o fragmento `#page=N` no endereço do PDF; a aplicação desse salto depende do visualizador.

**Ler caderno** continua sendo o livro em imagens do aplicativo, com 96 páginas, deslize horizontal, índice, texto integral e retomada da última página salva no navegador. Esse leitor é independente da abertura dos PDFs originais e foi preservado.

## Como retornar

| Situação | Como voltar ao Conhecendo a CTI |
| --- | --- |
| PDF em outra aba do Safari ou Chrome | Use o seletor de abas e escolha a aba do aplicativo, ou feche somente a aba do PDF. |
| PDF em um visualizador separado no Android | Use o comando **Voltar** do sistema ou o alternador de aplicativos. |
| Aplicativo aberto pelo ícone na tela inicial | Volte pelo ícone **Conhecendo a CTI** ou pelo alternador de aplicativos. |

O arquivo PDF nativo não contém um botão HTML do aplicativo. Seus controles pertencem ao navegador ou ao visualizador. **Voltar à biblioteca** e **Início** aparecem na página de acesso da rota antiga, antes de abrir o arquivo. Isso evita prometer um controle que o aplicativo não pode inserir no visualizador nativo.

No Android sem visualizador integrado, o navegador pode baixar o arquivo. Abra **Arquivos/Files → Downloads** e toque no PDF. No iPhone, **Compartilhar → Salvar em Arquivos** permite guardar uma cópia. Os controles variam por versão; consulte [o guia de celular](TESTAR-NO-CELULAR.md).

## Arquivos e offline

Os dois cadernos, as cinco apostilas, o manifesto e as 96 imagens do livro permanecem idênticos à versão anterior, conforme as verificações de integridade. Esta correção não acrescenta textos clínicos, doses, dados de pacientes, autoria ou aprovação institucional. A revisão clínica e institucional do conteúdo continua pendente.

O cache inicial volta a aproximadamente 10 MB, com o aplicativo, o livro e os dois cadernos. As cinco apostilas, cerca de 75 MB no total, continuam sendo armazenadas sob demanda ao receber o arquivo completo. O tratamento de respostas completas, Range e If-Range é preservado. O primeiro acesso exige internet e o navegador pode limitar ou remover seus arquivos. **Baixar PDF** mantém a opção de uma cópia independente em Arquivos/Downloads.

A busca, os favoritos, o checklist, o quiz e o progresso local continuam sem cadastro. O endereço e o QR Code permanecem os mesmos ao publicar o pacote no mesmo projeto da Cloudflare.

## Verificação

- `npm test`: 49 testes em nove arquivos aprovados, mais a verificação de respostas Range/If-Range e cache offline do service worker.
- `npm run build`: integridade do livro e das cinco apostilas, TypeScript e build aprovados. Cache final `cti-4755c636fdba`; 10.797.751 bytes no cache inicial.
- Chromium: oito grupos de verificações dos PDFs e sete de regressão da busca aprovados, sem erros JavaScript ou avisos de console. Os sete arquivos abriram no visualizador nativo do navegador, em outra aba; fechar essa aba preservou a página e a rolagem do aplicativo.
- Ampliação nativa a 300% e seleção de página conferidas; downloads dos dois cadernos e de uma apostila preservaram nome e SHA-256. Referências de página, rotas antigas, livro de 96 páginas, preferências e instruções de retorno conferidos.
- Larguras de 320, 390 e 1440 pixels: Biblioteca e controles sem rolagem horizontal da página; links principais com alvos de pelo menos 44 pixels e fonte de 14 pixels. Capturas da Biblioteca e do PDF ampliado inspecionadas visualmente.
- Offline: busca, livro, bytes integrais do PDF previamente aberto e abertura no visualizador nativo após recarregar aprovados. As apostilas continuam fora do download inicial.
- Estes testes usaram Chromium no Linux, com emulação de tamanho de tela. Safari/iPhone e Chrome/visualizador de Android físicos continuam pendentes.

O roteiro inclui conferir os links dos sete PDFs, tipo de resposta PDF, preservação da aba do aplicativo, referências de página, downloads, arquivos inalterados, busca, livro e offline. Testes em navegador automatizado não substituem a conferência do Safari em iPhone e do Chrome/visualizador em Android físicos.

Para publicar, siga [Atualizar versão 12](ATUALIZAR-V12.md). Os registros da v11 permanecem como histórico; a abertura descrita nesta página substitui o leitor de PDFs daquela entrega.

## Pacote conferido

`downloads/conhecendo-a-cti-v12.zip`: 118 arquivos, 70.145.461 bytes, `index.html` na raiz. CRCs válidos e todos os arquivos idênticos ao build testado; PDFs, manifesto e 96 imagens do livro idênticos à v11. SHA-256: `ab76a8ac3677fac6474496951bbfa001a2e999845cbc6744efbf918975a2c9ec`.
