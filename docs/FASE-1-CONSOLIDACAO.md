# Fase 1 — correções e consolidação para revisão

Data: **22/10/2026**. Implementação após a aprovação do [diagnóstico da Fase 0](AUDITORIA-FASE-0.md) e do [plano incremental](PLANO-APRIMORAMENTO-INSTITUCIONAL.md). Base anterior: `e31d24b2e479f867b2c672831e16d2bedc09ec56`, que preservava o aplicativo v14.

## Entrega desta fase

A Fase 1 corrige os problemas confirmados de ferramentas, foco do quiz, identificação da seção atual e legibilidade. A identidade visual, as rotas, os conteúdos clínicos e os materiais foram preservados. **Não houve implantação na Cloudflare nem alteração do QR Code.**

O pacote compilado desta fase está disponível para revisão e futura homologação autorizada: [baixar conhecendo-a-cti-fase-1-revisao.zip](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/raw/refs/heads/avaliacao-institucional/fase-1/downloads/conhecendo-a-cti-fase-1-revisao.zip). Ele contém os arquivos estáticos prontos, com `index.html` na raiz. Não é necessário instalar Node para utilizar o pacote em uma hospedagem autorizada.

As alterações foram separadas na branch `avaliacao-institucional/fase-1`; **`main` e a publicação atual não foram atualizados por esta fase**. Não foi declarada aprovação clínica ou institucional. Os perfis, o checklist do colaborador e os demais módulos novos continuam nas fases seguintes do plano; não são apresentados como implementados nesta entrega.

## Ferramentas e instalação reproduzível

- Vitest e `@vitest/mocker` passaram de 3.2.7 para **4.1.12**. A cadeia atual remove `tinypool`, que estava sinalizado na auditoria. Não foi usado `npm audit fix --force`.
- React/React DOM 19.3.1, Vite 6.4.4, Tailwind 4.3.3 e TypeScript 5.7.3 foram preservados.
- `package.json` registra Node `^22.13.0 || >=24.0.0`. `.nvmrc` fixa a versão de referência **24.19.0**.
- A instalação pelo lockfile (`npm ci --ignore-scripts --no-audit`) foi concluída, seguida dos testes. As consultas `npm audit` e `npm audit --omit=dev` retornaram **zero alertas** nesta verificação. Isso descreve o banco consultado e não equivale a certificação integral de segurança.

## Quiz e navegação

O quiz foi extraído de `main.tsx` para `src/Quiz.tsx`, mantendo as 32 questões, alternativas, explicações, filtros, pontuação e limite educacional. As respostas continuam em memória durante a visita, sem cadastro, histórico remoto ou dados de pacientes.

- Ao avançar, concluir, refazer ou trocar de assunto, o foco vai para a nova pergunta ou para o título do resultado. Ao responder, a região da explicação recebe foco e o próximo Tab chega ao botão de continuar. Isso evita a perda de foco causada pela desativação nativa das alternativas, sem avançar automaticamente a questão.
- As alternativas identificam **Sua escolha** e **Resposta esperada** por texto, sem depender apenas da cor ou do ícone.
- A navegação principal e móvel expõe `aria-current`: `page` para a página-base e `location` para o único grupo representado nas subpáginas. **Módulos** fica selecionado também em `#modulos`; livro e PDF mantêm a seção Biblioteca.
- O atalho **Pular para o conteúdo** aparece ao receber foco e move o foco para `main`, sem modificar o fragmento da rota ou abrir uma página inexistente.
- O título da aba do navegador acompanha a página/assunto, preservando o nome do aplicativo.

## Contraste e leitura

Foram ajustados tons secundários dentro da paleta existente e ampliadas fontes de descrições, notas, contadores e rodapé. O CSS original foi preservado, com regras pontuais adicionais. Os rótulos do quiz e o atalho de teclado receberam estilos consistentes.

O select do quiz e a entrada de página do livro usam **16 px**. Os controles do livro se reorganizam em telas estreitas, preservando a navegação horizontal de uma página por vez. As amostras calculadas de texto/fundo atingem pelo menos **5,03:1**; a conferência no navegador e seus limites são registrados abaixo. Não foi atribuída conformidade WCAG integral ao aplicativo.

## Preservação

Permanecem os oito módulos, 36 assuntos, cinco casos, 746 entradas do Siglário com a atualização fornecida pelo responsável, primeiro dia com dez itens, favoritos e leitura offline. As chaves locais e os identificadores de conteúdo não foram substituídos. Não foram acrescentadas fontes clínicas, doses, protocolos ou dados reais.

Os sete PDFs, as 96 imagens do livro, o manifesto e demais arquivos de materiais devem corresponder byte a byte à v14; o pacote é verificado contra a entrega anterior. A abertura nativa dos PDFs foi mantida, com a aba do aplicativo disponível para retorno. Referências, créditos e notas de revisão clínica permanecem preservados.

## Testes e pacote

Verificação final concluída:

- Instalação limpa pelo lockfile, **57 testes em dez arquivos**, verificações do service worker e build aprovados.
- **12 grupos de navegador aprovados**, com 74 destinos únicos, 32 diálogos, 15 desenhos e regressões dos recursos existentes. Não houve falha do harness final, exceção JavaScript, aviso de console ou requisição externa automática nos percursos registrados.
- Ao responder, o foco foi confirmado na explicação; o próximo Tab chegou ao botão de continuar. Pergunta, resultado, reinício e troca de assunto receberam o foco previsto. Estados textuais, menus, skip link e títulos também foram conferidos.
- **35 pares de texto/fundo** amostrados no navegador, com contraste mínimo de **4,92:1**. Select do quiz e entrada de página do livro confirmados em 16 px.
- **48 amostras de layout** nas larguras 320, 390 e 1440 px, com inspeção visual das capturas. Zoom nativo em 200%/400% e aparelhos reais não foram testados.
- Progresso local, armazenamento bloqueado, busca, casos, escalas, livro e consulta offline aprovados. Os sete PDFs e os **105 arquivos** em `materiais/` e `caderno/` permanecem idênticos ao pacote v14.

O cache final é **`cti-23dbb6d5f52f`**, com 112 URLs e 10.825.699 bytes no conjunto inicial; apostilas continuam sob demanda.

O ZIP contém **118 arquivos e 70.157.156 bytes**, com CRC válido, caminhos seguros e conteúdo idêntico a `dist/`. SHA-256: `485c503f8b97f37da521adb4ca1eb81bb8329073ebd7bc9525abbaf31cda1156`.

Evidências: [resultados consolidados](fase-1/resultados.json), [navegador](fase-1/navegador.md), [auditoria npm completa](fase-1/evidencias/npm-audit.json), [auditoria npm de produção](fase-1/evidencias/npm-audit-production.json), [cálculo de contraste](fase-1/evidencias/contraste.json) e [integridade do pacote](fase-1/evidencias/pacote.json).

Capturas da versão testada: [início em viewport móvel](fase-1/evidencias/inicio-mobile.png), [respostas do quiz](fase-1/evidencias/quiz.png), [atalho de teclado](fase-1/evidencias/atalho-mobile.png) e [Sobre em desktop](fase-1/evidencias/sobre-desktop.png).

## Revisão e homologação

O [checklist técnico de homologação](HOMOLOGACAO-TECNICA.md) cobre cabeçalhos/MIME, navegação, PDFs, instalação, cache e atualização. Não foram criados Wrangler, projeto Cloudflare separado ou alterações de cabeçalhos em produção. As configurações efetivas da hospedagem precisam ser conferidas em ambiente autorizado.

Os testes locais não substituem ensaios em iPhone/Safari, Android/Chrome e leitores de tela reais, nem a revisão clínica ou a autorização para distribuição dos materiais. Para publicação futura, apresentar o pacote e o destino de homologação, obter autorização e preservar a produção atual. A Fase 2 prevista no plano trata dos dois perfis e dos checklists separados.
