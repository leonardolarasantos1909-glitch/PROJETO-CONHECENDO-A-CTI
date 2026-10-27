# Calculadora comum — Conhecendo a CTI

Entrega de **27/10/2026**, sobre a versão de acolhimento familiar `18a5f0167e43991293c4ebb176d14978607c1873`, na branch `ferramentas/calculadora`.

A calculadora faz soma, subtração, multiplicação e divisão, com vírgula decimal, troca de sinal, apagar e limpar. Usa a identidade visual do aplicativo, aceita teclado e funciona offline após o carregamento inicial completo. Não exige cadastro, não envia contas e não guarda histórico. Sair da ferramenta reinicia a conta.

## Como acessar e usar

1. Na nova versão, abra **Calculadora** em “Mais recursos para aprender”, na tela inicial, ou pesquise “calculadora”. O menu de ferramentas também oferece o atalho.
2. Toque nos números e na operação desejada. Exemplo: **12,5 × 2 = 25**. Pode usar ponto ou vírgula; a apresentação usa vírgula.
3. **+/−** troca o sinal do número atual. **Apagar** remove o último caractere. **Limpar** reinicia a conta. Ao obter um resultado, uma operação continua a conta; um número inicia outra.
4. Com o painel selecionado, use números, +, −, * e / no teclado. **Enter** no painel ou **=** calcula, **Backspace** apaga e **Esc** limpa. Enter em um botão mantém sua ativação normal. Os atalhos não são capturados quando o foco está na busca ou em outros campos, nem quando se usa Ctrl/Cmd/Alt.
5. Pode favoritar a calculadora para encontrá-la rapidamente. O atalho interno é `#calculadora`.

Multiplicação e divisão têm precedência: **2 + 3 × 4 = 14**. São aceitos até 15 dígitos por número e 120 caracteres por conta. O resultado admite até 15 dígitos inteiros e é arredondado, quando necessário, a até 12 casas decimais. Divisão por zero e limites excedidos exibem uma mensagem. É possível corrigir, limpar ou iniciar outra conta.

## Atualizar sem trocar o endereço

O ZIP `conhecendo-a-cti-com-calculadora.zip` contém o aplicativo completo, já compilado, incluindo acolhimento familiar e folhetos. Não é necessário instalar Node para enviar o pacote pronto à hospedagem.

1. Baixe o ZIP e guarde a versão anterior para retorno.
2. Encaminhe para teste no ambiente separado de homologação com a responsável/TI. O envio ao GitHub não atualiza automaticamente o site. Não use “Code → Download ZIP”: esse botão baixa o código-fonte.
3. Confira a calculadora e os recursos existentes no endereço de teste, inclusive sem rede depois do primeiro carregamento.
4. Após autorização de publicação, envie o conteúdo do pacote pelo mesmo fluxo de arquivos estáticos do projeto atual da Cloudflare, com `index.html` na raiz. Se o painel aceitar ZIP, envie o ZIP pronto; caso peça uma pasta, extraia somente o conteúdo desse arquivo.
5. Mantenha o mesmo projeto e o endereço `https://proud-math-302f.conhecendoacti.workers.dev/`, preservando o QR Code. Depois da atualização, o atalho direto será `https://proud-math-302f.conhecendoacti.workers.dev/#calculadora`.

Depois de uma atualização autorizada, feche as abas/janelas antigas do aplicativo e reabra com internet para carregar a nova versão. Não é necessário limpar os dados do navegador.

**Nenhum deploy foi feito nesta entrega.** Não houve alteração de `main`, domínio ou QR Code.

## Implementação e preservação

- `src/calculator.ts` e `src/calculator.test.ts`: aritmética e estados puros. Frações com BigInt evitam o erro binário de `0,1 + 0,2`; o arredondamento ocorre somente ao final. Expressões não são executadas como código: não usa `eval` ou `Function`.
- `src/Calculator.tsx` e `src/calculator.css`: interface responsiva, botões nomeados, visor acessível, foco e teclado. Estado apenas em memória, sem nova chave de armazenamento.
- `src/new-tools.ts`, `src/main.tsx`, `src/content-registry.ts` e `src/search.test.ts`: rota, atalhos, busca, favoritos e registro da ferramenta. Os catálogos compartilhados reaproveitam os mesmos IDs.
- `scripts/check-calculator-browser.mjs` e `scripts/package-calculator-review.py`: navegação e regressões, pacote e preservação dos anexos.

Não houve nova dependência, login, banco ou serviço remoto. O build gera o cache com todos os assets, incluindo o componente carregado sob demanda da calculadora. Os nove módulos, nove PDFs, 96 páginas do livro, Siglário, perfis, checklists, simulações e materiais anteriores foram preservados.

Para reproduzir: `npm ci`, `npm test`, `npm run build` e `python3 scripts/package-calculator-review.py`. O aplicativo não depende de Python em execução; o script de empacotamento usa somente sua biblioteca padrão. A suíte complementar exige Playwright/Chromium e Python/PyMuPDF no ambiente de teste, como descrito no relatório anterior.

Verificação concluída: **114 testes automatizados em 22 arquivos**, build e service worker aprovados; **31 grupos de navegador**, 103 destinos e regressões dos recursos anteriores aprovados no Chromium local. Todos os 108 arquivos de materiais/caderno, incluindo os nove PDFs, permanecem idênticos à entrega anterior. O pacote contém 126 arquivos e 70.301.275 bytes, com SHA-256 `b8dabf4df62e5bc92d721057da9b623a64cf8656921a4f542eca0538c75fb01e` e cache `cti-938cecb18315`.

Testes, capturas e integridade estão em [evidências da calculadora](calculadora/README.md). A automação em Chromium/Linux não substitui ensaios em aparelhos iPhone/Android, Safari e leitores de tela reais. Esta entrega não modifica as pendências clínicas e institucionais dos materiais anteriores.
