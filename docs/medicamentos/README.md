# Guia de Medicamentos — evidências da entrega

Entrega de 31/10/2026, branch `modulos/guia-medicamentos`, sobre `b9215a69aecf636352c109a6a6806ab8da657e4e`. Nenhuma publicação em produção ou na nova conta Cloudflare foi realizada. O domínio e o QR Code de destino ainda dependem da conta e da URL efetiva.

O [relatório em português](../GUIA-MEDICAMENTOS.md) apresenta todos os 40 itens selecionados, as 11 categorias, as funcionalidades e as orientações de migração da hospedagem sem recriar o código. O aplicativo preserva os módulos, a calculadora, o Dicionário Clínico, os PDFs, o livro e o acesso sem login.

## Resultado técnico

- **136 testes automatizados em 24 arquivos passaram**, incluindo os 11 testes novos de dados, buscas, riscos, vínculos, casos e referências. O teste de nomes comerciais usa somente uma fixture fictícia em memória, removida ao final; nenhuma marca foi adicionada ao catálogo público.
- **59 grupos de navegador passaram:** 14 do guia, 14 do dicionário e 31 de regressões anteriores, todos no build/cache `cti-d8f7e0ea4627`.
- **440 combinações de rota/largura**: 192 do guia e casos, 128 do dicionário e 120 dos recursos anteriores. Larguras 320/390/768/1440 pixels, sem rolagem horizontal nos cenários conferidos.
- Abertura das 40 fichas completas, 11 filtros de categoria, MPP, nome/princípio ativo/alias/classe, busca geral, cópia de link e alternativa manual, favoritos persistentes e armazenamento bloqueado, links recíprocos, cinco casos e 15 respostas comentadas, teclado e foco passaram.
- Uso offline conferido em abas novas e recargas com o cache existente. Primeiro carregamento completo exige rede; referências externas exigem conexão.
- Nenhum erro de execução, violação de CSP ou requisição externa de consulta nos testes. Nenhuma nova dependência, chave de armazenamento ou serviço remoto.
- Amostras do guia: 19 pares de contraste, razão mínima 5,60:1, controles principais com alvos mínimos 44 pixels. Não é certificação WCAG nem auditoria completa de todos os componentes.
- Build com TypeScript, validadores editoriais e de referências locais, service worker, cinco apostilas, livro e folheto passaram. Não existe comando de lint separado no projeto.
- O catálogo de governança passou a conter 949 registros. Todas as fichas novas permanecem com revisão clínica pendente e sem data/responsável de aprovação inventados.

## Conteúdo clínico e referências

**Zero bulas específicas e zero nomes comerciais foram conferidos por leitura independente.** O acesso aos dois endereços propostos de Anvisa/ISMP resultou HTTP 403 tanto na tentativa padrão quanto na nova tentativa escalada. O portal do Bulário não é uma bula aprovada específica e não fundamenta automaticamente as afirmações das 40 fichas. O documento ISMP indicado é uma edição de 2019, com leitura, vigência, substituições e aplicabilidade pendentes.

As 40 fichas usam essas fontes como pontos de partida explícitos para revisão, totalizando 80 referências cadastradas e dois endereços distintos; isso não significa 80 bulários ou documentos conferidos. Cada ficha apresenta a pendência. Os nomes comerciais estão vazios e a busca por marcas depende do futuro cadastro de nomes com bula específica conferida. O validador impede publicar um nome de marca como verificado usando apenas um portal ou fonte pendente.

Há 23 sinalizações propostas de MPP, todas com escopo e justificativa e conferência pendente. Não é uma lista oficial da instituição. Formulação, via e contexto importam; ausência de sinalização não significa ausência de risco. As relações com patologias são educativas e não indicam automaticamente tratamento. A adenosina não foi vinculada à FA; não há TSV no dicionário atual. Uma associação inadequada entre metoclopramida e HDA foi removida na revisão editorial. Essa revisão não equivale a validação profissional.

Antes de uso institucional, localizar as bulas aprovadas da apresentação, conferir nomes e registros, revisar informações e classificação de risco com os profissionais habilitados e registrar autorização aplicável. Não há doses, taxas, diluições, tabelas de compatibilidade, diagnóstico ou ajuste automático no módulo.

- [Inventário das 40 fichas e seus metadados](inventario-revisao.json).
- [Tentativas de acesso e limites das fontes](fontes-acesso.json).
- [Resultados estruturados](resultados.json).

## Integridade do pacote

`downloads/conhecendo-a-cti-guia-medicamentos.zip`: 131 arquivos, 70.404.200 bytes, SHA-256 `2dcab6cb66acdd7901f6cbfc05ff265698442ce552c249e7d018591f8d87b773`. CRC válido, caminhos seguros, arquivos iguais ao `dist`, `index.html` na raiz. Todos os 108 arquivos de materiais/caderno foram comparados byte a byte com o pacote do Dicionário Clínico; nove PDFs e 96 páginas do livro foram preservados. Não foram acrescentados ou removidos materiais antigos.

O conteúdo do ZIP é estático e pronto para avaliação/publicação autorizada; não inclui dependências de desenvolvimento, segredos ou exigência de instalar Node no computador de quem publica. O script de empacotamento usa Python apenas no ambiente de desenvolvimento.

## Evidências e reprodução

- [Testes automatizados](evidencias/testes.txt) e [build](evidencias/build.txt).
- [Navegador: guia e casos](evidencias/navegador-medicamentos.json), [dicionário](evidencias/navegador-dicionario.json) e [recursos anteriores](evidencias/navegador-regressoes.json).
- [Comparação de todos os materiais e ZIP](evidencias/pacote.json).
- Capturas: [início no computador](evidencias/inicio-computador.png), [início no celular](evidencias/inicio-celular.png), [ficha no celular](evidencias/ficha-celular.png), [índice no computador](evidencias/indice-computador.png), [ficha no computador](evidencias/ficha-computador.png).

Reproduzir com `npm test`, `npm run build` e `python3 scripts/package-medication-review.py`. O harness `scripts/check-medication-browser.mjs` usa `CTI_EXPECTED_CACHE`, `CTI_CHROMIUM_PATH` e, quando instalado fora do projeto, `CTI_PLAYWRIGHT_PATH`. O ambiente desta entrega usou Chromium Linux e Playwright isolado em `/tmp`, sem alterar dependências do projeto. O runner de regressão anterior foi reutilizado; seu identificador de fase `calculator` é histórico e o cache registrado corresponde a esta entrega.

Testes físicos em iPhone/Android, Safari e leitores de tela não foram executados. O servidor local simula `dist/_headers`; não confirma deploy, políticas ou funcionamento da nova conta Cloudflare. A perda de acesso à conta anterior não apaga o código do GitHub, mas uma URL nova exige novo QR Code e não transfere automaticamente favoritos/checklists da origem antiga. Não há nova URL publicada ou QR Code de substituição nesta entrega.
