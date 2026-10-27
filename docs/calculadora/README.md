# Evidências da calculadora comum

Entrega de **27/10/2026**, sobre o commit `18a5f0167e43991293c4ebb176d14978607c1873`. Alterações na branch `ferramentas/calculadora`; sem publicação na Cloudflare ou modificação de `main`.

- [Testes automatizados](evidencias/testes.txt): 114 testes em 22 arquivos e verificações do service worker.
- [Build](evidencias/build.txt): 872 registros do catálogo, livro, apostilas, folheto, TypeScript, Vite e cache do build.
- [Navegador](evidencias/navegador.json): 31 grupos aprovados e 103 destinos; regressões das funcionalidades anteriores, operações da calculadora, teclado, erros, busca/favoritos, responsividade e uso offline.
- [Preservação](evidencias/preservacao.json): todos os 108 arquivos anteriores de materiais/caderno, incluindo nove PDFs e as 96 páginas do livro, idênticos à versão anterior.
- [Pacote](evidencias/pacote.json): ZIP com 126 arquivos e 70.301.275 bytes; CRC válido, caminhos seguros, conteúdo idêntico ao build e SHA-256 conferido.
- [Resumo](resultados.json), [matriz de aceitação](ACEITACAO.md), [captura móvel](evidencias/calculadora-mobile.png) e [desktop](evidencias/calculadora-desktop.png).

O motor de contas usa somente dados locais em memória, operações aritméticas e frações com BigInt. São conferidos decimais, precedência, associatividade, sinais, operadores substituídos, continuação de resultado, edição, divisão por zero, recuperação, limites e rejeição de texto executável. Não usa `eval`, `Function`, rede ou armazenamento. A interface utiliza os componentes, a paleta e a navegação existentes, sem dependência nova.

Para reproduzir, execute `npm ci`, `npm test`, `npm run build` e `python3 scripts/package-calculator-review.py`. A suíte complementar é `scripts/check-calculator-browser.mjs`, com Playwright/Chromium e Python/PyMuPDF no ambiente de testes, além de `serve-review.py`. Nesta execução, Playwright foi instalado isoladamente em `/tmp/cti-calculator-browser`, sem alterar as dependências do aplicativo. Os scripts de navegador e servidor podem ser copiados juntos para esse ambiente. Configure `CTI_REPO`, `CTI_CHROMIUM_PATH`, se necessário, e `CTI_EXPECTED_CACHE` com o identificador da primeira linha de `dist/sw.js`. O servidor simula `_headers` localmente e não realiza deploy.

A automação usa Chromium em Linux. Não foram realizados testes em iPhone/Android físicos, Safari, leitores de tela ou um ambiente Cloudflare real; não há declaração de conformidade WCAG integral. As pendências de revisão clínica/institucional dos materiais herdados permanecem registradas nas entregas anteriores.
