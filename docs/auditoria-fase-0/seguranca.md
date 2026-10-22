> Anexo da Fase 0 consolidado em 22/10/2026. As datas internas registram a coleta; o código do aplicativo não foi alterado.

# Fase 0 — segurança, dependências e implantação

Data: 21/10/2026. Repositório: `PROJETO-CONHECENDO-A-CTI`, commit `02c5dddbc0c62ff781e27277373b15959e61e231`. Auditoria somente de leitura; nenhum pacote, código, configuração de hospedagem ou publicação foi alterado.

## Diagnóstico executivo

A aplicação é uma PWA estática React, sem servidor de aplicação, login, banco, integração hospitalar ou coleta remota implementada. O mecanismo de armazenamento atual é compatível com a proposta sem cadastro: guarda somente identificadores permitidos e a página do caderno no navegador. A camada de apresentação usa os mecanismos de escape do React e não foi encontrado uso de `dangerouslySetInnerHTML`, `innerHTML`, `eval` ou `new Function` no código da aplicação.

Há um problema confirmado a tratar antes de consolidar a homologação: a consulta atual ao banco do npm sinalizou **três pacotes de desenvolvimento**, sendo dois classificados como críticos e um moderado pelo npm. Isso não equivale a vulnerabilidade crítica demonstrada no aplicativo entregue ao navegador. A consulta separada com `--omit=dev` retornou zero alertas; isso também não constitui certificado de segurança.

O repositório descreve entrega manual por ZIP, mas não contém configuração reproduzível do projeto Cloudflare, ambiente separado de homologação ou CI. Os cabeçalhos presentes no arquivo `_headers` cobrem cache; não é possível confirmar os cabeçalhos efetivamente aplicados na publicação. A tentativa de consultar o endereço público foi bloqueada no proxy antes de uma resposta do site; isso não prova indisponibilidade do aplicativo.

## 1. Dependências efetivas e auditoria do npm

Versões efetivas conferidas no lockfile:

| Dependência | Versão | Uso |
| --- | --- | --- |
| React / React DOM | 19.3.1 / 19.3.1 | Interface enviada ao navegador |
| lucide-react | 0.468.0 | Ícones da interface |
| Vite | 6.4.4 | Ferramenta de desenvolvimento e build |
| TypeScript | 5.7.3 | Verificação e compilação |
| Tailwind CSS / @tailwindcss/vite | 4.3.3 / 4.3.3 | Estilos/build |
| Vitest / @vitest/mocker | 3.2.7 / 3.2.7 | Testes |
| tinypool | 1.1.1 | Dependência transitiva dos testes |
| esbuild / Rollup | 0.25.12 / 4.64.7 | Build |

Evidências: `package.json:12`, `package.json:17`; versões e `dev: true` em `package-lock.json:1218`, `package-lock.json:2096`, `package-lock.json:2238`. O ambiente executou Node `v24.19.0` e npm `11.9.0`.

Consultas executadas sem instalação e sem correção automática:

- `npm --cache /tmp/cti-phase0-npm-cache audit --json`: saída 1 por alertas, resposta válida do banco do npm. Resultado: **3 pacotes**, 2 críticos e 1 moderado, todos na árvore de desenvolvimento/testes.
- `npm --cache /tmp/cti-phase0-npm-cache audit --omit=dev --json`: saída 0, **0 alertas** nas dependências de produção consultadas.

A primeira tentativa sem acesso de rede não consultou o banco; a segunda, com autorização de rede, foi concluída. Arquivos brutos: `/tmp/cti-phase0-npm-audit.json` e `/tmp/cti-phase0-npm-audit-production.json`.

| Pacote afetado | Aviso e intervalo retornado pelo banco | Situação local |
| --- | --- | --- |
| @vitest/mocker | [GHSA-82fw-gwwq-j7x9](https://github.com/advisories/GHSA-82fw-gwwq-j7x9): Path Traversal / Arbitrary File Read via Redirect Mock; `>=2.1.0 <4.1.11`, moderado | 3.2.7 está no intervalo |
| @vitest/mocker | [GHSA-qxg6-89mg-rqv8](https://github.com/advisories/GHSA-qxg6-89mg-rqv8): code injection via unauthenticated manual mock registration; `>=2.1.0-beta.7 <4.1.12`, moderado | 3.2.7 está no intervalo |
| tinypool | [GHSA-5gmw-xhrv-c9v3](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3): prototype pollution gadget in worker options leads to RCE; `<=2.1.0`, crítico | 1.1.1 está no intervalo |
| tinypool | [GHSA-85c8-ppgw-ccpr](https://github.com/advisories/GHSA-85c8-ppgw-ccpr): prototype pollution gadget to RCE in run() options; `<2.1.2`, crítico | 1.1.1 está no intervalo |

O resumo agrega Vitest como crítico pela árvore afetada. São três pacotes sinalizados e quatro avisos distintos, não três explorações demonstradas. A recomendação automática disponibilizada pelo npm é **Vitest 5.0.5**, com mudança de versão principal (`isSemVerMajor: true`). Não foi aplicada nem testada nesta fase.

Contexto: `package.json:10` executa `vitest run`, não um serviço público de testes. As dependências Vitest/tinypool/mocker são de desenvolvimento e não foram encontradas como código importado ou identificadores no bundle estático existente. Não foi reproduzida exploração, nem demonstrado endpoint vulnerável no Workers. Recomendação P1: atualizar o conjunto de testes em alteração isolada e revisar compatibilidade com Node/Vite, executar instalação pelo lockfile e todos os testes/build. Não usar `npm audit fix --force` sem revisão. Até lá, não expor serviços de desenvolvimento/testes em rede aberta. `dev` e `preview` atualmente escutam em `0.0.0.0` (`package.json:7` e `package.json:9`); isso é útil no ambiente de desenvolvimento, mas não deve ser usado como hospedagem institucional.

## 2. Dados, formulários, chamadas externas e XSS

### Funcionalidades prontas e verificáveis no código

- Sem nome, matrícula, e-mail, senha ou campo de dados de paciente. Os formulários existentes servem à busca, às marcações e ao número de página do caderno: `src/HomeSearch.tsx:67`, `src/StarterTools.tsx:40`, `src/StarterTools.tsx:98`, `src/BookReader.tsx:239`.
- Quatro chaves de aprendizado locais: `cti-first-day-v1`, `cti-favorites-v1`, `cti-book-page-v1`, `cti-visited`. Leitura tolerante a JSON inválido e armazenamento bloqueado, filtro por allowlist, sem converter valores locais em URLs ou HTML: `src/learning-storage.ts:3`, `src/learning-storage.ts:6`, `src/learning-storage.ts:28`; visitas em `src/main.tsx:25`.
- O botão de apagar progresso remove somente as chaves do aplicativo: `src/learning-storage.ts:48` e `src/main.tsx:35`. Isso não remove os caches offline de materiais; a interface não promete esse apagamento.
- Favoritos usam IDs de catálogo e migração conhecida, não links arbitrários vindos do armazenamento: `src/Favorites.tsx:13`, `src/favorites.ts`.
- O livro valida o manifesto, caminhos locais e links externos antes de renderizar: `src/book.ts:33`, `src/book.ts:38`; protocolos executáveis como `javascript:` não são aceitos nessa validação.
- PDFs são resolvidos por catálogo conhecido e número de página limitado: `src/pdf-catalog.ts:11`, `src/pdf-catalog.ts:15`. A abertura em nova aba usa `noopener noreferrer`: `src/PdfReader.tsx:21`.
- Busca e siglário são locais. Não foi identificado cliente de analytics, banco remoto, beacon, WebSocket, XHR ou SDK hospitalar. O fetch da interface recupera `/caderno/paginas.json`; o service worker faz requisições de arquivos da mesma origem. Referências externas são links opcionais: `src/BookReader.tsx:51`, `scripts/build-sw.mjs:138`, `src/StarterTools.tsx:118`.
- Não foram encontradas credenciais ou tokens de serviço no código/configurações rastreados inspecionados. `.env*` é ignorado por Git (`.gitignore:7`). Isso não equivale a varredura completa do histórico Git ou dos sistemas externos.

### Limites e recomendações

- `localStorage` e Cache Storage pertencem à origem e ao navegador; não são cofre nem mecanismo de autorização. São adequados aos IDs de aprendizado atuais, não a dados reais de pacientes, empregados ou avaliações identificáveis.
- QR Code e ausência de login significam conteúdo público. Uma cópia offline ou PDF baixado não pode ser revogada remotamente. Somente documentos expressamente autorizados para distribuição pública devem entrar na base/ZIP.
- “Sem analytics” não significa ausência de registros técnicos da hospedagem. Política e retenção de logs Cloudflare não estão configuradas ou demonstradas neste repositório e precisam de confirmação com o responsável pela hospedagem antes de alegações sobre anonimato.
- Não há feedback remoto implementado. Se aprovado futuramente, consentimento, finalidade, campos, retenção, responsáveis e acesso precisam ser definidos antes de criar endpoint, banco ou analytics, conforme o novo escopo do usuário. Progresso e feedback não devem receber identificadores desnecessários.

## 3. Offline e atualização

Aspectos positivos confirmados:

- O service worker só é registrado em build de produção (`src/main.tsx:50`). Cache tem versão por hash calculado com os arquivos reais (`scripts/build-sw.mjs:163`). A versão usa cache inicial e cache separado de apostilas.
- Apostilas seguem allowlist derivada de manifesto validado e SHA-256, sem incluir todo o volume no precache: `scripts/build-sw.mjs:24`, `scripts/build-sw.mjs:35`, `scripts/build-sw.mjs:142`.
- Cache sob demanda aceita somente resposta PDF completa 200, evita cache de HTML/erros/206 e trata Range/If-Range: `scripts/build-sw.mjs:71`, `scripts/build-sw.mjs:87`, `scripts/build-sw.mjs:117`.
- Falhas de cota ou abertura de cache não impedem a leitura online da apostila; PDF não baixado retorna mensagem 503 offline: `scripts/build-sw.mjs:120`, `scripts/build-sw.mjs:144`.
- Métodos diferentes de GET e URLs de outra origem não são interceptados: `scripts/build-sw.mjs:138`.
- Os testes específicos cobrem Range, If-Range, resposta offline, falha de armazenamento e allowlist: `scripts/check-sw.mjs:68` até `scripts/check-sw.mjs:143`. A linha de base confirmou a execução do baseline de 57 testes + SW e build.

Riscos/limites de operação:

- A instalação exige todos os arquivos do precache; falta de rede/cota impede completar a instalação, sem garantia de offline no primeiro acesso. O navegador pode remover caches.
- Não há `skipWaiting`; uma atualização pode aguardar o fechamento de abas. Isso evita troca abrupta, mas precisa de instrução de atualização e teste manual em iPhone/Android.
- Ao ativar uma nova versão, caches `cti-*` antigos, inclusive apostilas, são removidos (`scripts/build-sw.mjs:64`). Apostilas precisarão ser baixadas novamente. Isso já faz parte da arquitetura, não é evidência de corrupção de arquivos.
- Não há interface de inventário/cota dos arquivos offline, nem telemetria de sucesso de instalação (coleta remota também não foi autorizada). Se for necessário melhorar o retorno visual do cache, planejar interface local sem acrescentar rastreamento.

## 4. Cloudflare, cabeçalhos e homologação

- `public/_headers:1` define `no-cache` para entrada, service worker, manifesto, materiais e caderno, e cache longo para assets com hash. **São regras no repositório; não foi demonstrado que a publicação atual as aplica.**
- Não existem regras CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` ou política de enquadramento nesse arquivo. Isso é lacuna de endurecimento a avaliar, não prova de exploração. HSTS e outros cabeçalhos podem ser fornecidos pela plataforma fora do repositório; não foram inferidos.
- Não foram encontrados no conjunto rastreado `wrangler.toml`, `wrangler.json`, `wrangler.jsonc`, worker de aplicação, `functions/`, configuração de CI em `.github/`, infraestrutura declarativa ou bindings de D1/KV/R2. O código existente pode ser servido como assets estáticos; não há backend hospitalar a auditar no repositório.
- O procedimento documentado é upload manual de `dist/`/ZIP ao mesmo projeto; não há pipeline automático (`README.md:51`). Nome/conta, configurações reais, logs e permissões Cloudflare não podem ser reconstruídos só por esse código.
- **Não existe configuração de homologação separada identificada.** Não foi executado nem criado deploy de homologação. A Fase 7 depende de o responsável aprovar e disponibilizar um ambiente separado, com o mesmo conjunto de assets e testes de cabeçalhos, cache, navegação/404 e PDFs. Preservar o projeto de produção e QR atual.
- Recomendações P1/P2 após aprovação: documentar configuração mínima, responsáveis e rollback; criar homologação separada; validar HTTPS e cabeçalhos reais; definir políticas de conteúdo/conexão/referrer/enquadramento compatíveis com o livro e futuras integrações autorizadas; conferir cache e MIME de `.pdf`, `.webmanifest`, `.js` e `sw.js` no ambiente real. Não substituir isso por configuração presumida de Workers.

## 5. Triagem estrutural dos PDFs

Foi feita leitura estrutural local dos sete PDFs com PyMuPDF, sem executar conteúdo e sem imprimir dados dos documentos. Não foram encontrados objetos com marcadores de `JavaScript`, `JS`, `Launch`, `OpenAction` ou `AA`. Três apostilas contêm um stream com tipo `EmbeddedFile` e subtipo `application/c2pa`, compatível com metadados de proveniência; o catálogo não lista anexos (`embfile_count = 0`). Isso não foi tratado como código executável, vírus ou causa do alerta histórico de antivírus. Resultado bruto: `/tmp/cti-phase0-pdf-active-content.json`.

Essa triagem, os hashes e o CRC não são varredura antivírus, verificação completa de privacidade ou validação clínica. Nomes e páginas dos sete materiais continuam conforme o inventário existente; o anexo de conteúdo apresenta a avaliação de texto/privacidade.

## 6. Priorização proposta para o plano

1. **P1 — Ferramentas de desenvolvimento:** atualizar o conjunto Vitest/tinypool/mocker em mudança isolada, aprovada e testada, sem publicar dependências de desenvolvimento nem expor seus servidores.
2. **P1 — Homologação e governança de implantação:** definir responsável Cloudflare, ambiente separado, controle de versões e rollback; confirmar permissões públicas dos materiais. Nenhuma publicação nesta fase.
3. **P1/P2 — Cabeçalhos reais:** conferir configuração no ambiente autorizado e acrescentar endurecimento compatível; não afirmar proteção a partir de um arquivo que ainda não foi verificado na hospedagem.
4. **P2 — Reprodutibilidade:** estabelecer Node suportado também em configuração (`engines`/arquivo de versão/CI), pois hoje README é a principal orientação. A auditoria não requer migrar arquitetura nem criar backend.
5. **P2 — Atualização/offline:** documentar expiração, novo download de apostilas e instalação em aparelhos físicos; considerar retorno local de estado/cota sem analytics.

Conclusão: não foi encontrada nesta inspeção uma vulnerabilidade de aplicação que exija alteração emergencial da produção. Há alertas confirmados na cadeia de testes e lacunas de preparação institucional/deploy a resolver de forma incremental. A Fase 0 fornece evidências e limites; não aprova oficialmente conteúdo, segurança, implantação ou uso assistencial.
