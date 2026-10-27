# Como testar o novo módulo de acolhimento familiar

O pacote `conhecendo-a-cti-acolher-familia.zip` já contém o aplicativo completo com os recursos anteriores e o novo módulo. Não é preciso instalar Node ou gerar PDFs para usar o pacote pronto.

1. **Baixe o ZIP da nova entrega no computador.** Guarde também a versão anterior. Não escolha “Code → Download ZIP”, que baixa o código-fonte em outro formato.
2. **Encaminhe o pacote para teste em um ambiente separado**, com apoio da responsável/TI. O site atual ainda não foi atualizado. Utilize o fluxo de arquivos estáticos da conta Cloudflare; o ZIP traz `index.html` na raiz. Se o painel exigir uma pasta, a TI pode extrair e enviar somente o conteúdo do ZIP.
3. No endereço de teste, procure o card **Acolher também é cuidar** na tela inicial. Ele também aparece na busca: pesquise “família”, “acolhimento familiar” ou o nome do módulo.
4. Abra as cinco seções. Em **O que dizer? O que evitar?**, toque em cada situação para comparar as falas. Em **Simulador**, escolha uma resposta, leia a explicação e avance ou tente novamente. Todos os casos são fictícios.
5. Em **Material para entregar ao familiar**, confira as quatro páginas pela numeração ou por Anterior/Próxima. **Baixar PDF** entrega a versão pronta para impressão; **PDF para leitura** mostra as páginas A5 em sequência.
6. Para imprimir o folheto, escolha **A4, paisagem, tamanho real/100%, frente e verso pela borda curta**. A montagem já é 4|1 na frente e 2|3 no verso. Não selecione novamente modo livreto ou várias páginas por folha. Faça primeiro uma cópia e dobre ao meio para conferir. Pelo botão **Imprimir**, desative cabeçalhos e rodapés automáticos do navegador.
7. Solicite à enfermeira/equipe responsável a revisão dos textos, do folheto e da informação local de visitação antes de entregá-lo às famílias. Não há aprovação institucional registrada nesta versão.
8. Após testes e autorização para publicação, atualize o **mesmo projeto atual** da Cloudflare, mantendo o endereço `https://proud-math-302f.conhecendoacti.workers.dev/`. O QR Code continuará apontando para o aplicativo. Depois da atualização, o acesso direto será `https://proud-math-302f.conhecendoacti.workers.dev/#acolher-familia`.

## No celular e sem internet

- **iPhone:** abrir no Safari. Para salvar o PDF, Compartilhar → Salvar em Arquivos. Para o app, Compartilhar → Adicionar à Tela de Início.
- **Android:** abrir no Chrome. Salvar o PDF em Downloads. Para o app, menu de três pontos → Instalar aplicativo ou Adicionar à tela inicial.
- Se abrir no WhatsApp, use “Abrir no navegador” ou copie o endereço para Safari/Chrome.
- Com internet, aguarde o app carregar completamente e reabra uma vez. Depois desligue Wi-Fi/dados móveis e teste o módulo e o folheto. O primeiro acesso exige internet; links externos também.

O novo módulo não pede cadastro ou dados de pacientes. As respostas do simulador ficam somente na tela e são reiniciadas ao sair. Os favoritos continuam locais. Familiares podem receber apenas o folheto; não precisam instalar ou acessar o aplicativo.

Se o computador da empresa bloquear o download, encaminhe o alerta à TI. Para detalhes de implementação, arquivos alterados e pendências, consulte [Acolher também é cuidar](ACOLHER-FAMILIA.md).
