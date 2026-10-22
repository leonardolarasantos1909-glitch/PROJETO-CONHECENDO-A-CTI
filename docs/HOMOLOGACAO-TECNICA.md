# Checklist técnico de homologação — preparação

Preparado em 22/10/2026 para a Fase 1. **Este documento não cria um ambiente nem comprova uma implantação.** A produção atual permanece sob o endereço informado pelo responsável; o QR Code não foi alterado.

## Antes de publicar em um ambiente de teste

- Apresentar o pacote, o nome e o endereço do projeto separado, os responsáveis e a configuração proposta para aprovação.
- Confirmar que o destino é uma homologação separada; não usar a publicação atual para testar mudanças.
- Registrar o commit, a versão/hash do cache, o SHA-256 do pacote e uma cópia da versão anterior para retorno.
- Publicar somente os arquivos compilados de `dist/`, com `index.html` na raiz. Não enviar código-fonte, `node_modules`, documentos internos ou o histórico de ZIPs.
- Confirmar autorização para divulgação pública dos materiais. Sem login, esconder um link não protege um documento incluído no pacote ou no cache.

## Cabeçalhos e tipos a verificar no endereço real

O arquivo `public/_headers` contém regras de cache. Sua existência não comprova que o projeto Workers as aplica. Consultar as respostas reais após uma implantação autorizada e registrar os resultados.

| Recurso | Tipo esperado | Cache e comportamento a conferir |
| --- | --- | --- |
| `/` e `/index.html` | `text/html` | Revalidação da entrada; não entregar HTML antigo indefinidamente. |
| `/sw.js` | `text/javascript` ou `application/javascript` | Revalidação do script; URL na raiz e escopo apropriado. Não servir HTML no lugar do script. |
| `/manifest.webmanifest` | `application/manifest+json` | Revalidação, ícones e caminhos válidos. |
| `/assets/*.js` | JavaScript | Nome com hash e cache longo; não fazer fallback HTML para um asset ausente. |
| `/assets/*.css` | `text/css` | Nome com hash e cache longo. |
| `/materiais/*.pdf` e apostilas | `application/pdf` | PDF original, abertura nativa, download e respostas Range/If-Range compatíveis. Não substituir por HTML. |
| `/caderno/*.webp` | `image/webp` | Integridade e exibição das páginas. |
| `/caderno/paginas.json` | `application/json` | Manifesto correspondente ao PDF e às imagens do build. |

Avaliar e testar no ambiente autorizado políticas de conteúdo/conexão/enquadramento, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e HTTPS/HSTS. Escolher regras compatíveis com estilos, SVGs, PDFs e navegação existentes; não aplicar uma CSP genérica sem testes. Cabeçalhos fornecidos pela plataforma fora do repositório também precisam ser conferidos. Esta Fase 1 não presumiu nem modificou esses controles na Cloudflare.

## Navegação e atualização

- Abrir a página por HTTPS e pelos fragmentos existentes, incluindo módulos, assuntos, escalas, casos, Siglário, livro e páginas de acesso a PDF.
- Confirmar nomes das abas do navegador, seleção dos menus, navegação por teclado, link para pular ao conteúdo e retorno de foco ao fechar assuntos.
- Responder, avançar, concluir e reiniciar o quiz; conferir o foco e os textos de resposta. Exercícios não certificam competência.
- Abrir cada PDF original, ampliar no visualizador do aparelho e retornar ao aplicativo sem fechar a aba principal.
- Instalar/abrir o PWA em iPhone/Safari e Android/Chrome reais; verificar também o fluxo quando o link chega pelo WhatsApp.
- Aguardar a instalação completa do service worker, recarregar e testar sem rede. O primeiro acesso exige internet; o navegador pode remover armazenamento.
- Conferir o cache inicial e a disponibilidade das apostilas sob demanda. Apostila não carregada por completo não deve ser prometida como disponível offline.
- Testar a chegada de uma atualização com abas antigas abertas e após fechá-las. Não há troca forçada de versão no meio da leitura; a atualização pode aguardar o fechamento das abas.
- Conferir que marcações, favoritos, visitas e página do livro continuam locais e que a opção de apagá-los não remove dados não relacionados.

## Privacidade, referências e aceite

- Confirmar ausência de formulários de paciente, coleta remota, banco e analytics não aprovados.
- Verificar autorizações dos materiais, referências, responsáveis e status de revisão. Data de build não é data de revisão clínica.
- Usar apenas cenários fictícios na demonstração. Não apresentar o protótipo como protocolo oficial ou implantação institucional aprovada.
- Registrar navegador/aparelho, resultado, defeito, responsável e reteste de cada verificação. Automação Chromium não substitui Safari, leitores de tela ou aparelhos físicos.
- Obter aceite da homologação e autorização final antes de atualizar a produção. Preservar o projeto e o endereço atuais para manter o QR Code.

O endereço público não pôde ser validado durante a Fase 0 por bloqueio do proxy. Sem acesso e autorização de um ambiente separado, não declarar este checklist como executado. As pendências serão resolvidas na etapa de homologação do plano aprovado.
