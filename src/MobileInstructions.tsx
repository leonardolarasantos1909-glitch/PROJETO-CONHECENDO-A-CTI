function BrowserHelp() {
  return <p>Abriu pelo WhatsApp? Use a opção <strong>Abrir no navegador</strong>. Se ela não aparecer, copie o link e cole no <strong>Safari no iPhone</strong> ou no <strong>Chrome no Android</strong>.</p>;
}

export function PdfInstructions() {
  return <details className="pdf-help mobile-help">
    <summary>Como salvar o PDF no celular — iPhone e Android</summary>
    <p>Toque em <strong>Baixar PDF</strong> ou <strong>Baixar para imprimir</strong> e siga as instruções do seu celular.</p>
    <h3>iPhone (iOS)</h3>
    <ol>
      <li>Se o Safari abrir o PDF, toque em <strong>Compartilhar</strong> (quadrado com uma seta para cima).</li>
      <li>Escolha <strong>Salvar em Arquivos</strong>, selecione uma pasta e toque em <strong>Salvar</strong>.</li>
      <li>Depois, encontre o PDF no aplicativo <strong>Arquivos</strong>, na pasta escolhida.</li>
    </ol>
    <h3>Android</h3>
    <ol>
      <li>No Chrome, confirme o download. Se o PDF abrir na tela, procure <strong>Baixar</strong> (seta para baixo) ou <strong>menu ⋮ → Baixar</strong>, quando disponível.</li>
      <li>Abra o aplicativo <strong>Arquivos</strong> ou <strong>Files</strong> e procure a pasta <strong>Downloads</strong>.</li>
    </ol>
    <BrowserHelp/>
    <p>Para ler no aplicativo, toque em <strong>Ler caderno</strong> e deslize as páginas para os lados. No leitor, a opção <strong>PDF original</strong> abre o documento no navegador.</p>
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
