# Livro virtual — Caderno CTI Adulto

Desde a versão v3, o caderno digital pode ser lido como um livro dentro do aplicativo, sem depender de um visualizador externo. O documento de origem continua sendo `public/materiais/caderno-cti-adulto-digital.pdf`, com 96 páginas A4. A v4 amplia as orientações para iPhone e Android. Os dois PDFs da v2 foram mantidos sem novas alterações.

## Ler no aplicativo

1. Entre em **Biblioteca científica** e toque em **Ler caderno**.
2. Deslize a página para o lado ou use **Anterior** e **Próxima**. No computador, as setas do teclado também funcionam, exceto durante a edição de campos.
3. Use **Índice** para abrir a página 2 e toque nos assuntos do índice original para saltar à página correspondente. Também é possível preencher **Ir para página** e tocar em **Ir**.
4. Abra **Ver texto da página** para ler o texto integral em formato selecionável e acessar os links daquela página.
5. Use **PDF original** para abrir o documento usado como fonte no navegador ou no visualizador do aparelho, solicitando outra aba. Para retornar, selecione a aba **Conhecendo a CTI**, feche apenas a aba do PDF ou volte pelo ícone do aplicativo. A Biblioteca mantém **Baixar PDF**.

O contador informa a página atual. O leitor mantém essa página ao mudar a largura da tela e, desde a v8, retoma a última página válida salva neste navegador ao reabrir. A primeira leitura começa na página 1; **Voltar ao início do caderno** permite reiniciar. As imagens preservam a proporção e a aparência do PDF. Somente a imagem atual e suas vizinhas ficam montadas no leitor, para reduzir o uso de memória. As folhas de horários permanecem modelos em branco, sem campos para coleta de dados no aplicativo.

Na v11, **Pesquisar no app**, na tela inicial, também encontra o caderno e os materiais pelo nome ou pela descrição. Um resultado de PDF abre seu cartão na Biblioteca, sem baixar automaticamente. A busca não pesquisa o texto integral dos PDFs ou das páginas do livro; **Ver texto da página** continua disponível dentro do leitor.

Desde a v12, o PDF original abre diretamente no visualizador do aparelho; o leitor PDF.js da v11 foi retirado. O livro em imagens descrito nesta página continua disponível, com os mesmos controles e progresso local. Links antigos `#pdf/<id>` levam a uma página de acesso ao arquivo, sem renderização ou carregamento automático. Consulte [a correção de abertura dos PDFs](PDFS-V12.md).

Se o manifesto ou uma imagem falhar, o leitor oferece nova tentativa e acesso ao PDF. Os links das referências externas abrem em nova aba e precisam de conexão. A experiência em iPhone e Android físicos, a impressão e as políticas de armazenamento dos navegadores precisam ser confirmadas no aparelho do usuário.

Para salvar o PDF no **iPhone/Safari**, use **Compartilhar → Salvar em Arquivos** caso o documento abra em uma visualização. No **Android/Chrome**, use **Baixar** ou o ícone de seta para baixo do PDF e procure o arquivo em **Arquivos/Files → Downloads**. Se o aplicativo estiver aberto dentro do WhatsApp, escolha **Abrir no navegador**; também é possível copiar o endereço e abrir no Safari ou Chrome.

Para criar o atalho do aplicativo, no **iPhone/Safari** use **Compartilhar → Adicionar à Tela de Início → Adicionar**. No **Android/Chrome**, use **⋮ → Adicionar à tela inicial** ou **Instalar aplicativo** e confirme. Os nomes podem variar conforme o navegador e sua versão.

## Impressão separada

O arquivo **Caderno de bolso para imprimir** continua na Biblioteca e não é usado como fonte do livro virtual. Ele contém 24 folhas A4, cada uma com quatro páginas de bolso, para recortar e organizar de 01 a 96.

Imprima em A4, tamanho real/100%, frente única e uma página do PDF por folha. Não aplique novamente a opção de quatro páginas por folha da impressora, pois o arquivo já está diagramado.

## Arquivos e integridade

| Material | Local | Conferência |
| --- | --- | --- |
| PDF usado como fonte | `public/materiais/caderno-cti-adulto-digital.pdf` | 96 páginas; SHA-256 `a972f44330d1149e06eec607bc39ce314fb607e3d07f7c3c271864459107a0c8` |
| Páginas do livro | `public/caderno/pagina-001.webp` a `pagina-096.webp` | 1440 × 2037 pixels, RGB, fundo branco, WebP qualidade 90; 7.757.070 bytes no total |
| Manifesto | `public/caderno/paginas.json` | 70.676 bytes; origem, hash, dimensões, texto integral e links |

O manifesto contém o texto extraído do PDF sem resumo ou reescrita. Os títulos usam linhas reais das páginas ou “Página N” quando o início é um formulário. Foram preservados 12 links internos de página e 27 links externos HTTP(S), com retângulos proporcionais à página para as áreas clicáveis. A extração não consulta os destinos externos nem executa instruções presentes no documento.

A geração foi conferida por igualdade dos textos com a extração do PDF, hash da fonte, contagem, dimensões e formato das 96 imagens e destinos e coordenadas dos 39 links. A capa também foi inspecionada visualmente. Isso descreve verificações técnicas; não é revisão clínica, validação institucional, varredura antivírus ou teste em iPhone ou Android físico.

## Regenerar após atualizar o PDF

As páginas e o manifesto já estão incluídos no repositório. **Não é preciso instalar Python para usar o ZIP pronto ou fazer um build do código sem alterar o PDF.**

Se o PDF de origem for atualizado em uma futura alteração autorizada, preserve os originais e regenere o livro antes de compilar. O script usa Python 3.11 ou superior, PyMuPDF 1.26.6 e Pillow 12.3.0. Na raiz do repositório, por exemplo em Linux:

```sh
python3 -m venv /tmp/cti-livro-venv
/tmp/cti-livro-venv/bin/python -m pip install PyMuPDF==1.26.6 Pillow==12.3.0
/tmp/cti-livro-venv/bin/python scripts/preparar-caderno.py
npm test
npm run build
```

O script resolve os caminhos a partir do próprio repositório, processa uma página por vez, mantém o PDF intacto e informa hash, quantidade de páginas, bytes e avisos. Ele substitui apenas imagens próprias reconhecidas pelo manifesto anterior e remove somente páginas geradas que tenham ficado obsoletas. Não apaga outros arquivos encontrados no diretório.

O comando `npm run build` executa primeiro `scripts/check-book.mjs`. Essa conferência compara o SHA-256 do PDF com `sourceSha256` do manifesto, exige as imagens WebP esperadas e valida os destinos dos links. Um PDF trocado sem regenerar as páginas faz o build falhar, em vez de publicar um livro desatualizado.

## Offline e atualização da hospedagem

O service worker inclui o aplicativo, os dois PDFs, o manifesto e todas as imagens do livro no cache inicial: cerca de 10 MB de arquivos estáticos. O primeiro acesso requer conexão e tempo para concluir essa preparação. Para testar offline, use o build de produção, aguarde a ativação do service worker, recarregue e tente abrir também uma página ainda não visitada. O servidor `npm run dev` não registra o service worker. O navegador pode remover os dados armazenados conforme suas políticas.

Para atualizar a hospedagem manual, envie **`downloads/conhecendo-a-cti-v12.zip`** ao mesmo projeto em que o aplicativo já está publicado. O ZIP deve conter os arquivos de `dist/`, com `index.html` na raiz. Manter o projeto e o endereço preserva o destino do QR Code. Siga o [passo a passo da versão 12](ATUALIZAR-V12.md). Depois da implantação, recarregue o aplicativo; se houver uma atualização do service worker aguardando, feche todas as abas do aplicativo e abra-o novamente com conexão.

Consulte [a origem e preservação dos PDFs](MATERIAIS-PDF.md), [o histórico do pacote v2](PACOTE-V2.md) e [o roteiro de uso, publicação e teste em iPhone e Android](TESTAR-NO-CELULAR.md).

## Conferência da entrega v3 — 16/10/2026

- `npm test`: quatro testes de conteúdo aprovados. `npm run build`: conferência do livro, TypeScript e compilação aprovados; cache `cti-39ecbcc6feed`.
- Navegador Chromium com tela de celular 390 × 844, rotação 844 × 390 e computador 1440 × 1000: gesto de toque horizontal, botões, teclado, índice, salto por número, limites 1/96, texto integral, links e recuperação de falhas aprovados. A rotação após deslizar e selecionar uma página manteve a seleção.
- Offline: manifesto, todas as 96 imagens e ambos os PDFs disponíveis em cache; a página 96 abriu após recarregar sem rede. Downloads preservaram nomes e hashes. Sem erros JavaScript ou rolagem horizontal da página inteira nos tamanhos verificados.
- Capturas do leitor no computador e celular inspecionadas visualmente. Esses testes usam emulação no Chromium; o Safari e o iPhone físico continuam no roteiro manual.
- ZIP `conhecendo-a-cti-v3.zip`: 110 arquivos, 9.434.378 bytes, `index.html` na raiz. CRCs válidos e cada arquivo extraído idêntico ao build testado. SHA-256: `c468af9b1781763092d07f7ebcdb82b69ba57e1ba082d012f61e53e9bfc0e253`.

## Instruções para iOS e Android — entrega v4

A Biblioteca inclui “Como salvar o PDF no celular — iPhone e Android”. Em Sobre o projeto, as instruções de tela inicial também têm passos separados para os dois sistemas. Ambos explicam como abrir o link fora do navegador interno do WhatsApp.

`npm test` (quatro testes) e `npm run build` aprovados. Em Chromium com larguras de 390 e 360 pixels, a ajuda abriu por teclado, as listas numeradas de ambos os sistemas apareceram sem rolagem horizontal da página e o leitor continuou navegando entre páginas. Capturas das instruções foram inspecionadas; não houve teste em aparelhos físicos.

ZIP v4: 110 arquivos, 9.434.884 bytes; CRCs válidos e arquivos idênticos ao build testado. PDFs, manifesto e 96 imagens do livro permaneceram idênticos à v3. SHA-256: `0a86500c7160d53d94873a6e0c6cc861ec3c645d24aac508169a152a387077cc`.
