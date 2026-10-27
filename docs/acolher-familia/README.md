# Verificação do módulo de acolhimento familiar

Execução local em **27/10/2026**, sobre a base final anterior `1fed72be139fc7c2d77cb6b5e2fb15805bcecece`. Não houve deploy ou teste do serviço Cloudflare.

- [Testes automatizados](evidencias/testes.txt): 103 testes em 21 arquivos, mais verificações do service worker.
- [Build](evidencias/build.txt): 871 registros de revisão, livro, apostilas, folheto, TypeScript, Vite e cache gerado a partir dos arquivos reais.
- [Navegador](evidencias/navegador.json): 27 grupos aprovados, 102 destinos, 112 verificações de layout em 320/390/768/1440 px e 167 amostras de contraste.
- [Matriz do pedido](ACEITACAO.md): critérios e limites da validação.
- [Auditoria npm](evidencias/npm-audit.json): zero alertas na consulta completa; nenhuma dependência nova no aplicativo.
- [Resumo consolidado](resultados.json) e [integridade do ZIP](evidencias/pacote.json).
- [PDFs fornecidos](evidencias/pdfs-gerados.json): quatro páginas A5, duas faces A4, conteúdo integral e ordem dos painéis conferidos independentemente do gerador.
- [Impressão Chromium](evidencias/impressao-navegador.json): duas faces A4, ordem correta, textos integrais e ausência de menus.

As cópias de captura e impressão incluem [folheto A4 frente](evidencias/folheto-frente.png), [verso](evidencias/folheto-verso.png), [preto e branco](evidencias/folheto-cinza.png), [impressão do navegador](evidencias/impressao-navegador.pdf), [módulo](evidencias/modulo.png), [simulador](evidencias/simulador.png) e [prévia móvel](evidencias/previa-mobile.png). Não contêm informações reais de pacientes.

## Reproduzir

```sh
npm ci
npm test
npm run build
python3 scripts/package-family-review.py
```

O aplicativo não depende de Python para funcionar. O empacotamento usa somente a biblioteca padrão do Python 3. Regenerar os PDFs após alterar a fonte editorial exige ReportLab e as fontes DejaVu do sistema; os arquivos prontos e seus hashes já estão incluídos no repositório.

A suíte complementar `scripts/check-family-browser.mjs` requer Playwright em ambiente de teste separado, Chromium e Python/PyMuPDF para conferir a impressão. Nesta execução, Playwright foi instalado em `/tmp/cti-family-browser`, sem alterar dependências/lockfile do app. O script e `serve-review.py` podem ser copiados juntos para esse ambiente. Configure `CTI_REPO` para a raiz do projeto, `CTI_CHROMIUM_PATH` quando usar Chromium do sistema e `CTI_EXPECTED_CACHE` com a versão da primeira linha de `dist/sw.js`. Os comandos e variáveis seguem a convenção de shell Linux/macOS. O servidor local simula `_headers` e não publica nada.

## Limites

Testes de toque/instalação em iPhone e Android físicos, Safari, leitores de tela e impressoras reais não foram executados. Não foi declarada conformidade WCAG integral. A impressão automatizada e a prévia física dos PDFs não comprovam a configuração de uma impressora particular; faça uma cópia de teste.

Os acessos externos de pesquisa foram bloqueados por erro 403 do proxy. Links clínicos foram registrados como leituras propostas, sem data de acesso ou validação. Enfermeira/equipe responsável precisam conferir fontes, vigência normativa, textos, regra local da CTI Cardio e autorização de distribuição antes de uso institucional.
