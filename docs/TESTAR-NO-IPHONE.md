# Publicar e testar o aplicativo no iPhone

O aplicativo está independente do Google Sites. Não é necessário instalar Node.js, abrir terminal ou configurar GitHub no celular. Se você já publicou o aplicativo, atualize **o mesmo projeto** pelo fluxo de envio que já utilizou na Cloudflare, usando o novo ZIP. Assim o endereço e o QR Code continuam os mesmos. As etapas 2 a 4 abaixo descrevem uma primeira publicação alternativa em Cloudflare Pages; não é necessário criar outro projeto para atualizar o atual.

Antes de seguir no computador da empresa: um pacote anterior teve um alerta de antivírus. A v3 mantém os mesmos PDFs de compatibilidade da v2; não foi realizada varredura antivírus completa. Os testes de integridade e funcionamento descritos no projeto não substituem essa análise. Encaminhe eventual alerta à TI, sem desativar proteções.

## 1. Salvar o arquivo pronto

Baixe o arquivo [conhecendo-a-cti-v3.zip](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/raw/refs/heads/main/downloads/conhecendo-a-cti-v3.zip) pelo GitHub. Se o repositório for privado, entre na conta com acesso antes de baixar. Se o download direto não iniciar, abra a [página do arquivo](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/blob/main/downloads/conhecendo-a-cti-v3.zip) e toque no ícone de download (**Download raw file**). No Safari, acompanhe o download e confira o arquivo no aplicativo **Arquivos → Downloads** (a pasta pode estar em iCloud Drive ou No Meu iPhone). Se o arquivo abrir em uma visualização, use **Compartilhar → Salvar em Arquivos**.

Mantenha o arquivo em ZIP. O pacote já tem `index.html` na raiz e inclui os arquivos de produção, ícones, manifesto e service worker. Não envie o ZIP do código-fonte para esse fluxo de upload.

## 2. Criar sua conta de hospedagem

Abra https://dash.cloudflare.com/ no Safari. Crie uma conta e confirme seu e-mail, se solicitado. Essa conta serve para você administrar a hospedagem. Os alunos acessarão o aplicativo sem login. O plano gratuito de Pages é suficiente para este protótipo estático; não é necessário comprar domínio.

## 3. Escolher Pages e upload manual

Para uma primeira publicação em Pages, procure **Workers e Pages**, toque em **Criar aplicativo**, abra **Pages** e selecione **Começar** e **Arrastar e soltar seus arquivos**, conforme os rótulos exibidos. A interface pode mudar ou apresentar traduções diferentes. Selecione o fluxo **Pages / upload direto de arquivos** para essa alternativa. Se você já usa o projeto Workers do endereço atual, atualize esse projeto em vez de seguir esta etapa de criação.

No iPhone, toque na área de envio ou no seletor de arquivos, selecione **Escolher Arquivo / Arquivos** e localize o ZIP em Downloads. Não é necessário arrastar o arquivo. Se o painel não mostrar os controles, no menu do Safari selecione **Solicitar Site para Computador** e tente novamente.

Documentação oficial que confirma o upload de ZIP pelo painel: https://developers.cloudflare.com/pages/get-started/direct-upload/ . Esse método é diferente do upload por linha de comando, que não aceita ZIP.

## 4. Publicar uma versão de teste

Use o nome `conhecendo-a-cti` ou um nome disponível. Envie `conhecendo-a-cti-v3.zip`. Ao confirmar **Publicar site**, **Salvar e publicar** ou o botão equivalente, você publica o protótipo: ele poderá ser acessado por qualquer pessoa que tenha o link. O conteúdo ainda é demonstrativo e pendente de revisão clínica e institucional.

Espere a confirmação de sucesso. Abra o endereço HTTPS terminado em `.pages.dev` mostrado pelo painel. Use o endereço realmente fornecido pelo serviço; este guia não presume que algum nome já esteja disponível. O pacote está preparado para a raiz de um domínio.

## 5. Conferir no iPhone

- Abra os oito módulos e alguns cartões.
- Pesquise “glicemia” e “sonda”.
- Responda ao quiz, veja as explicações e o resultado.
- Confira se o texto está confortável e os botões funcionam.
- Abra **Biblioteca científica → Ler caderno**. Deslize para o lado, teste **Anterior**, **Próxima**, **Índice** e **Ir para página**.
- Toque em um assunto do índice para conferir o salto de página. Abra **Ver texto da página** e confira o texto e os links.
- Teste **PDF original** e, na Biblioteca, **Baixar PDF** e **Baixar para imprimir**. Se o Safari abrir o documento, use **Compartilhar → Salvar em Arquivos**.
- Aguarde o primeiro carregamento completo, que prepara cerca de 10 MB de arquivos para o uso offline, recarregue uma vez e teste o modo avião. Abra inclusive uma página do livro ainda não visitada. Os conteúdos internos devem continuar disponíveis; links externos precisam de conexão.

Se quiser adicionar um atalho, no Safari toque em **Compartilhar → Adicionar à Tela de Início**. A instalação e o offline precisam ser conferidos no aparelho real após a publicação HTTPS.

## 6. Continuar o desenvolvimento

Envie nesta conversa o resultado do teste e diga o que deseja mudar. Também é possível enviar uma captura da tela que causou dúvida. A hospedagem não é atualizada automaticamente pelo envio dos arquivos ao GitHub. O endereço de teste informado pelo autor é https://proud-math-302f.conhecendoacti.workers.dev/ e já tem QR Code no repositório; ele continua válido se você atualizar o mesmo projeto mantendo esse endereço.

Antes de distribuir como material de estágio, valide o conteúdo clínico, as referências, a autoria e a apresentação institucional com os responsáveis pelo projeto. Não coloque dados reais de pacientes no aplicativo.

Para atualizar o site depois de uma nova versão, entre no projeto existente e envie o novo ZIP de produção pelo mesmo fluxo de implantação que já utilizou. No Pages, a opção pode aparecer como **Criar nova implantação**. A opção Code → Download ZIP no GitHub baixa o código-fonte para continuidade do desenvolvimento; esse arquivo não é o pacote de upload estático. Para hospedagem, use **downloads/conhecendo-a-cti-v3.zip**. Depois da publicação, recarregue; se o leitor antigo continuar aparecendo, feche todas as abas do aplicativo e abra novamente com conexão. Consulte também [o guia do livro virtual](LIVRO-VIRTUAL.md).
