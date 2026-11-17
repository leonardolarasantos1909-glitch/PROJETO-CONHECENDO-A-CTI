function BrowserHelp() {
  return <p>Abriu pelo WhatsApp? Use a opção <strong>Abrir no navegador</strong>. Se ela não aparecer, copie o link e cole no <strong>Safari no iPhone</strong> ou no <strong>Chrome no Android</strong>.</p>;
}

export function PdfOpenHelp(){return <p className="pdf-open-help">Leia os materiais no aplicativo, com navegação por páginas, zoom e busca. Para guardar uma cópia, use Baixar PDF.</p>;}
export function PdfInstructions(){return <details className="pdf-help"><summary>Como salvar o PDF no celular</summary><p>No iPhone, baixe o PDF e use Compartilhar → Salvar em Arquivos. No Android, procure o arquivo em Downloads. O caderno para impressão é separado da versão digital.</p><BrowserHelp/></details>;}

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
