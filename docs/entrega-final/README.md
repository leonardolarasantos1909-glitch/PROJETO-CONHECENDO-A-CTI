# Evidências da entrega final

Verificações em 22/10/2026 sobre a versão compilada da branch de revisão. **Sem deploy na Cloudflare.**

- [Matriz dos 14 critérios](MATRIZ-ACEITACAO.md): nove aprovados localmente, quatro parciais pelos limites descritos e homologação real não executada.
- [Navegador, 20 grupos](evidencias/navegador.json): rotas, formulários, foco, layouts, contraste, cache, cabeçalhos simulados e limites.
- [Testes automatizados](evidencias/testes.txt): 91 testes em 19 arquivos e verificação do service worker.
- [Build](evidencias/build.txt): catálogo, livro, apostilas, TypeScript, Vite e geração do cache.
- [Auditoria npm completa](evidencias/npm-audit.json) e [produção](evidencias/npm-audit-production.json).
- [Integridade do pacote](evidencias/pacote.json): ZIP, SHA-256, CRC e comparação dos materiais.
- [Resumo consolidado](resultados.json).
- [Exportação de avaliação simulada](evidencias/avaliacao-simulada.json): respostas fixas de teste, sem pessoa identificada, somente versão e campos permitidos.

Capturas: [início móvel](evidencias/inicio-mobile.png), [perfil selecionado](evidencias/perfil-inicio.png), [laboratório](evidencias/laboratorio.png), [cena do box fictício](evidencias/box-virtual.png), [escalas](evidencias/escalas-mobile.png), [quiz](evidencias/quiz.png), [atalho de teclado](evidencias/atalho-mobile.png) e [Sobre em desktop](evidencias/sobre-desktop.png).

Os caminhos `/tmp` do JSON identificam os artefatos da execução original; as cópias versionadas estão nesta pasta. A matriz usa links relativos para essas cópias. Nenhuma captura contém dados reais de pacientes.

## Reproduzir as verificações

Na raiz do repositório, usando o Node de `.nvmrc`:

```sh
npm ci
npm test
npm run build
```

Para os testes complementares de navegador, o ambiente desta execução usou Playwright instalado separadamente e Chromium em `/usr/bin/chromium`. Playwright não foi acrescentado às dependências normais do app. A TI/desenvolvedor pode instalá-lo somente no ambiente de testes:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
```

Leia a primeira linha de `dist/sw.js`. Use o nome completo do cache gerado no comando seguinte, substituindo o exemplo se o build for diferente:

```sh
CTI_EXPECTED_CACHE=cti-24151e273c6b node scripts/check-browser-final.mjs
```

O comando usa sintaxe de shell Linux/macOS. O script inicia um servidor local em `127.0.0.1:4221` que aplica `_headers`, executa os fluxos e encerra o servidor. Requer Python 3. Aceita `CTI_REPO`, `CTI_BROWSER_PORT`, `CTI_CHROMIUM_PATH` e `CTI_PYTHON` se necessário. Para usar o Chromium do sistema, defina `CTI_CHROMIUM_PATH=/usr/bin/chromium`. Resultados e capturas são gravados em `/tmp/cti-final-*`; em outro sistema, ajuste esse diretório no script antes de executar. Não é uma ação de publicação.

A automação registra o contexto e falha se o cache esperado não corresponder à versão testada. Uma instalação extra de Playwright é destinada ao teste; não entra no ZIP estático nem altera o lockfile por esse comando. Os ensaios em aparelhos, leitores de tela e hospedagem reais seguem o [checklist de homologação](../HOMOLOGACAO-TECNICA.md).
