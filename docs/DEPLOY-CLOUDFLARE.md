# Publicação do CTI Conecta em outra conta Cloudflare

O `wrangler.jsonc` publica `dist/` como assets estáticos, sem backend. Nome de destino informado: `projeto-cti-conect`. Não há `account_id`, token, rota ou domínio herdados na configuração. Se esse nome se referia à conta e não ao Worker, ajuste `name` antes de publicar.

## Pelo painel Workers Builds

Na **nova conta**, autorize o GitHub e conecte `leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI`:

| Configuração | Valor |
| --- | --- |
| Branch de produção | `main` |
| Diretório raiz | Raiz do repositório |
| Node.js | `24` |
| Build | `npm run build` |
| Deploy | `npx wrangler deploy` |
| Assets | `dist/` (declarado no Wrangler) |
| Worker | `projeto-cti-conect` |

A plataforma instala pelo lockfile. O Wrangler também executa `npm run build`, permitindo o deploy direto a partir de `npm ci`. No painel haverá um segundo build; isso é intencional para que o comando de deploy isolado seja reproduzível. A integração do painel deve usar autorização da conta nova, sem copiar credenciais antigas.

## Pela linha de comando

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run deploy:check
npx wrangler login
npx wrangler whoami
npm run deploy
```

Confira a conta exibida por `whoami` antes do deploy. Em CI externo, configure **somente nos segredos seguros do provedor** `CLOUDFLARE_API_TOKEN` (permissão Workers Scripts Edit na conta de destino) e `CLOUDFLARE_ACCOUNT_ID` dessa conta. Não envie tokens pelo chat nem os grave em arquivos versionados. O app estático não requer variáveis, segredos, D1, R2 ou KV. O painel Workers Builds gerencia a autenticação da sua integração.

## Conferência obrigatória após publicar

1. Confira status de sucesso e commit no painel da conta nova. Copie o endereço criado pelo Cloudflare; não deduza o subdomínio da conta.
2. Abra esse endereço e confirme “CTI Conecta”, identidade vermelha e entrada direta.
3. Teste `/#clinica`, `/#escalas`, `/#diluicao`, `/#biblioteca`, `/clinica` e atualização da página.
4. Abra um PDF e teste páginas, busca e download. Confira calculadora/gotejamento, favoritos, checklists e registro/relatório de RCP.
5. Confira manifest, ícones, instalação em iPhone/Android e o QR Code da página Projeto. Teste o QR em outro aparelho antes de distribuir.
6. Aguarde ativação do service worker e teste os materiais já armazenados offline. Apostilas são armazenadas sob demanda. Navegadores podem remover caches.

Não substitua o endereço do site antigo ou seus QR Codes antes dessa conferência. As chaves de armazenamento local foram preservadas; dados de outra origem não migram automaticamente. Os ZIPs antigos de `downloads/` são históricos e não contêm esta versão. Gere a publicação a partir do build atual.
