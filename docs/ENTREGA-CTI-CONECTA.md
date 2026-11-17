# Entrega — CTI Conecta

## Implementado e preservado

A base disponível do repositório confirmado foi expandida para CTI Conecta, com identidade vermelha, fontes locais, navegação direta, React Router, calculadora, registro manual de RCP, enciclopédia derivada dos conteúdos existentes, integração, índice CTI virtual e leitor PDF interno. O conteúdo educativo e os sete PDFs foram preservados. Não foi recuperado o commit `d7a60e6` do repositório inacessível.

## Evidências

- TypeScript: aprovado (também executado em cada build).
- Testes unitários: 75 aprovados em 12 arquivos.
- Service worker: testes de cache, Range/If-Range e falhas de armazenamento aprovados.
- Playwright: 10 verificações aprovadas, cinco em computador e cinco em celular emulado no Chromium. Incluem navegação, rotas diretas e reload, validação visual de identidade/ausência de perfil, calculadora/limpeza de valores, favoritos, checklists, armazenamento bloqueado, RCP/histórico, escalas, leitura PDF, gesto lateral, busca, zoom e download real.
- Build: integridade do livro/5 apostilas, TypeScript, Vite e service worker aprovados.
- Wrangler: dry-run aprovado; 356 arquivos estáticos reconhecidos, sem backend ou bindings.
- Inspeção responsiva: sem transbordamento horizontal em 1440px e 390px; botão de RCP com cor RGB 182, 51, 70 (#b63346).
- Autenticação Cloudflare: `wrangler whoami` retornou ausência de login. Publicação real e conferência de URL ainda não realizadas.

As capturas de tela, logs e resultados temporários não são versionados. O perfil de celular não substitui teste em Safari ou aparelho físico. O bundle PDF.js possui aviso de tamanho do Vite; está separado e carregado sob demanda.

## Pendências

- Autenticar a nova conta e publicar o Worker `projeto-cti-conect`, depois conferir o resultado e o endereço no Cloudflare.
- Fornecer tabela institucional de diluição e eventuais conteúdos/arquivos exclusivos da versão inacessível.
- Revisão clínica e institucional do acervo, testes físicos e da instalação PWA.
- CTI virtual entregue como índice educativo dos módulos, não como simulação 3D. Glasgow mantém a introdução disponível, sem formulário validado completo inventado.

[Desenvolvimento e funcionalidades](CTI-CONECTA.md) · [Publicação e configurações do painel](DEPLOY-CLOUDFLARE.md).

## Arquivos criados ou modificados

- `.gitignore`
- `README.md`
- `docs/CTI-CONECTA.md`
- `docs/DEPLOY-CLOUDFLARE.md`
- `docs/ENTREGA-CTI-CONECTA.md`
- `index.html`
- `package-lock.json`
- `package.json`
- `playwright.config.ts`
- `public/icon-192.png`
- `public/icon-512.png`
- `public/icon.svg`
- `public/manifest.webmanifest`
- `scripts/build-sw.mjs`
- `scripts/prepare-pdf.mjs`
- `src/ApostilaMaterials.tsx`
- `src/InstallHint.tsx`
- `src/MobileInstructions.tsx`
- `src/PdfMaterials.tsx`
- `src/PdfReader.tsx`
- `src/ProjectQr.tsx`
- `src/book-reader.css`
- `src/case-studies.css`
- `src/connect.css`
- `src/equipment-illustrations.css`
- `src/features/calculator/Calculator.tsx`
- `src/features/calculator/calculations.test.ts`
- `src/features/calculator/calculations.ts`
- `src/features/knowledge/Knowledge.tsx`
- `src/features/resuscitation/Resuscitation.tsx`
- `src/features/resuscitation/session.test.ts`
- `src/features/resuscitation/session.ts`
- `src/home-search.css`
- `src/learning-storage.ts`
- `src/learning-tools.css`
- `src/main.tsx`
- `src/pav-guide.css`
- `src/pdf-catalog.test.ts`
- `src/pdf-catalog.ts`
- `src/pdf-reader.css`
- `src/scales-guide.css`
- `src/search.test.ts`
- `src/search.ts`
- `src/starter-tools.css`
- `src/style.css`
- `tests/e2e/app.spec.ts`
- `vitest.config.ts`
- `wrangler.jsonc`
