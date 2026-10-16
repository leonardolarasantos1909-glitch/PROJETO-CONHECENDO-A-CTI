# Testar a primeira versão no iPhone

O aplicativo está independente do Google Sites. Para abri-lo por um link no iPhone, esta orientação usa Cloudflare Pages com upload manual do ZIP já compilado. Não é necessário instalar Node.js, abrir terminal ou configurar GitHub no celular.

## 1. Salvar o arquivo pronto

Baixe o arquivo [conhecendo-a-cti-publicar.zip](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/raw/refs/heads/main/downloads/conhecendo-a-cti-publicar.zip) pelo GitHub. Se o repositório for privado, entre na conta com acesso antes de baixar. Se o download direto não iniciar, abra a [página do arquivo](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/blob/main/downloads/conhecendo-a-cti-publicar.zip) e toque no ícone de download (**Download raw file**). No Safari, acompanhe o download e confira o arquivo no aplicativo **Arquivos → Downloads** (a pasta pode estar em iCloud Drive ou No Meu iPhone). Se o arquivo abrir em uma visualização, use **Compartilhar → Salvar em Arquivos**.

Mantenha o arquivo em ZIP. O pacote já tem `index.html` na raiz e inclui os arquivos de produção, ícones, manifesto e service worker. Não envie o ZIP do código-fonte para esse fluxo de upload.

## 2. Criar sua conta de hospedagem

Abra https://dash.cloudflare.com/ no Safari. Crie uma conta e confirme seu e-mail, se solicitado. Essa conta serve para você administrar a hospedagem. Os alunos acessarão o aplicativo sem login. O plano gratuito de Pages é suficiente para este protótipo estático; não é necessário comprar domínio.

## 3. Escolher Pages e upload manual

Procure **Workers & Pages** e toque em **Create application** (Criar aplicativo). Abra a opção de **Pages**, depois **Get started** (Começar) e **Drag and drop your files** (enviar arquivos), conforme os rótulos exibidos. A interface pode mudar ou apresentar traduções diferentes. Escolha o fluxo **Pages / upload direto de arquivos**, sem conectar repositório e sem criar um Worker.

No iPhone, toque na área de envio ou no seletor de arquivos, selecione **Escolher Arquivo / Arquivos** e localize o ZIP em Downloads. Não é necessário arrastar o arquivo. Se o painel não mostrar os controles, no menu do Safari selecione **Solicitar Site para Computador** e tente novamente.

Documentação oficial que confirma o upload de ZIP pelo painel: https://developers.cloudflare.com/pages/get-started/direct-upload/ . Esse método é diferente do upload por linha de comando, que não aceita ZIP.

## 4. Publicar uma versão de teste

Use o nome `conhecendo-a-cti` ou um nome disponível. Envie `conhecendo-a-cti-publicar.zip`. Ao confirmar **Deploy site**, **Save and Deploy** ou o botão equivalente, você publica o protótipo: ele poderá ser acessado por qualquer pessoa que tenha o link. O conteúdo ainda é demonstrativo e pendente de revisão clínica e institucional.

Espere a confirmação de sucesso. Abra o endereço HTTPS terminado em `.pages.dev` mostrado pelo painel. Use o endereço realmente fornecido pelo serviço; este guia não presume que algum nome já esteja disponível. O pacote está preparado para a raiz de um domínio.

## 5. Conferir no iPhone

- Abra os oito módulos e alguns cartões.
- Pesquise “glicemia” e “sonda”.
- Responda ao quiz, veja as explicações e o resultado.
- Confira se o texto está confortável e os botões funcionam.
- Aguarde o primeiro carregamento completo, recarregue uma vez e teste o modo avião. Os conteúdos internos devem continuar disponíveis; links externos precisam de conexão.

Se quiser adicionar um atalho, no Safari toque em **Compartilhar → Adicionar à Tela de Início**. A instalação e o offline precisam ser conferidos no aparelho real após a publicação HTTPS.

## 6. Continuar o desenvolvimento

Envie nesta conversa o link que funcionou e diga o que deseja mudar. Também é possível enviar uma captura da tela que causou dúvida. Nenhum aplicativo foi publicado automaticamente pelo assistente. O próximo passo, após existir uma URL definitiva, é preparar e testar o QR Code que aponta para ela.

Antes de distribuir como material de estágio, valide o conteúdo clínico, as referências, a autoria e a apresentação institucional com os responsáveis pelo projeto. Não coloque dados reais de pacientes no aplicativo.

Para atualizar o site depois de uma nova versão, entre no projeto Pages existente, use **Create a new deployment** ou o comando equivalente e envie o novo ZIP de produção. A opção Code → Download ZIP no GitHub baixa o código-fonte para continuidade do desenvolvimento; esse arquivo não é o pacote de upload estático. Para hospedagem, use sempre downloads/conhecendo-a-cti-publicar.zip.
