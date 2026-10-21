function BrowserHelp() {
  return <p>Abriu pelo WhatsApp? Use a opção <strong>Abrir no navegador</strong>. Se ela não aparecer, copie o link e cole no <strong>Safari no iPhone</strong> ou no <strong>Chrome no Android</strong>.</p>;
}

export function PdfOpenHelp() {
  return <p className="pdf-open-help">O PDF abre em outra aba ou no visualizador do aparelho. Para voltar, selecione a aba <strong>Conhecendo a CTI</strong> ou feche apenas a aba do PDF. Se abrir em outro aplicativo, volte pelo ícone <strong>Conhecendo a CTI</strong> ou pelo alternador de aplicativos. Não é preciso fechar o aplicativo inteiro.</p>;
}

export function PdfInstructions() {
  return <details className="pdf-help mobile-help">
    <summary>Como salvar o PDF no celular — iPhone e Android</summary>
    <p><strong>Abrir PDF</strong> abre o arquivo original no navegador ou no visualizador do celular. O link pede uma nova aba; alguns aparelhos podem baixar o documento. Use os controles do visualizador para ampliar a leitura.</p>
    <h3>iPhone (iOS)</h3>
    <ol>
      <li>No Safari, use o gesto de ampliar com dois dedos para ler o PDF.</li>
      <li>Para voltar ao aplicativo, toque no botão de <strong>abas</strong> do Safari e selecione a aba <strong>Conhecendo a CTI</strong>, ou feche apenas a aba do PDF.</li>
      <li>Se abriu o aplicativo pelo ícone na tela inicial e o PDF abriu no Safari, volte pelo ícone <strong>Conhecendo a CTI</strong> ou pelo alternador de aplicativos.</li>
      <li>Para salvar o PDF aberto, toque em <strong>Compartilhar → Salvar em Arquivos</strong>, escolha uma pasta e toque em <strong>Salvar</strong>. Depois, encontre o arquivo no aplicativo <strong>Arquivos</strong>.</li>
    </ol>
    <h3>Android</h3>
    <ol>
      <li>No Chrome, o PDF pode abrir no próprio navegador ou em outro visualizador. Se ele for baixado, abra <strong>Arquivos/Files → Downloads</strong> e toque no documento.</li>
      <li>Use os controles de zoom do visualizador ou o gesto de ampliar com dois dedos.</li>
      <li>Para voltar, selecione a aba <strong>Conhecendo a CTI</strong> no Chrome ou feche apenas a aba do PDF. Se outro visualizador foi aberto, use <strong>Voltar</strong> do Android ou o alternador de aplicativos.</li>
      <li>Para guardar uma cópia, use <strong>Baixar PDF</strong> na Biblioteca ou o comando <strong>Baixar/Salvar</strong> do visualizador. Procure o arquivo em <strong>Arquivos/Files → Downloads</strong>.</li>
    </ol>
    <p>Os controles dentro do PDF pertencem ao navegador ou ao visualizador. A página do aplicativo continua disponível; não é necessário fechar o aplicativo inteiro para retornar.</p>
    <BrowserHelp/>
    <p><strong>Ler caderno</strong> continua abrindo o livro dentro do aplicativo, com uma página por vez e deslize para os lados. <strong>PDF original</strong> abre o arquivo no navegador. <strong>Baixar para imprimir</strong> mantém o caderno de bolso separado.</p>
  </details>;
}

export function InstallInstructions() {
  return <div className="mobile-help">
    <p>Adicione um ícone do aplicativo à tela inicial do seu celular para abrir o guia com mais facilidade.</p>
    <h3>iPhone (iOS)</h3>
    <ol>
      <li>Abra o endereço do aplicativo no <strong>Safari</strong>.</li>
      <li>Toque em <strong>Compartilhar</strong> (quadrado com uma seta para cima).</li>
      <li>Escolha <strong>Adicionar à Tela de Início</strong> e confirme em <strong>Adicionar</strong>.</li>
    </ol>
    <h3>Android</h3>
    <ol>
      <li>Abra o endereço do aplicativo no <strong>Chrome</strong>.</li>
      <li>Toque no <strong>menu ⋮</strong> e procure <strong>Adicionar à tela inicial</strong> ou <strong>Instalar aplicativo</strong>.</li>
      <li>Confirme em <strong>Adicionar</strong> ou <strong>Instalar</strong>, conforme a opção exibida.</li>
    </ol>
    <p>Os nomes dos menus podem variar conforme o navegador e a versão do celular. Você também pode continuar usando o aplicativo pelo navegador.</p>
    <BrowserHelp/>
  </div>;
}
