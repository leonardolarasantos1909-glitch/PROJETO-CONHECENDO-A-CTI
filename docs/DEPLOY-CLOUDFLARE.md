# Deploy no Cloudflare Workers

Este projeto usa React, TypeScript e Vite. O build gera os arquivos estáticos em `dist/`. O Wrangler publica essa pasta diretamente, sem código de backend.

No painel Workers Builds, configure:

- Repositório: `leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI`.
- Branch de produção: `main`.
- Diretório raiz: raiz do repositório.
- Comando de build: `npm run build`.
- Comando de deploy: `npx wrangler deploy`.
- Node.js: 24 (ou 22.13+ na linha 22).

O nome do Worker é `conhecendo-a-cti`, correspondente ao endereço informado. O `wrangler.jsonc` declara `assets.directory` como `./dist` e também executa o build antes do deploy. Assim, o comando direto `npx wrangler deploy` funciona após `npm ci`; no painel, o build pode ser executado novamente pelo Wrangler.

Para validar sem publicar:

```sh
npm ci
npm test
npm run build
npx wrangler deploy --dry-run
```

Para publicar, execute `npx wrangler deploy` com autenticação e acesso ao Worker na conta Cloudflare correta. Não salve tokens no repositório. As rotas usam fragmentos, portanto não é necessário adicionar fallback SPA nem Worker de backend.
