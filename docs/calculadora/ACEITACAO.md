# Calculadora comum — verificação local

Cache testado: `cti-938cecb18315`. Suíte definitiva: **31/31 grupos aprovados**, **103 destinos**, **120 verificações de layout** em 320/390/768/1440 px. Sem falhas, exceções JavaScript, avisos, violações CSP ou requisições externas automáticas. Foram verificadas 192 amostras de contraste, mínimo 4,92:1.

| Critério | Resultado e evidência |
| --- | --- |
| Acesso | PASS: card inicial, menu, busca, favorito e rota `#calculadora`; sem login ou campos de paciente. |
| Quatro operações | PASS: soma, subtração, multiplicação e divisão por toque. |
| Decimais e precedência | PASS: `0,1 + 0,2 = 0,3`, `2 + 3 × 4 = 14`, sinais e operações de mesma prioridade em ordem. |
| Correção e erros | PASS: apagar último dígito, limpar, trocar sinal, substituir operador, encadear após resultado, repetir igual e recuperar de divisão por zero sem NaN/Infinity. |
| Teclado | PASS: ponto/vírgula, Enter no painel, ativação nativa de botão por Enter, Backspace, Escape; atalhos Ctrl/Cmd não capturados. A busca continua digitável. |
| Privacidade | PASS: contas em memória, sem salvamento/transmissão; sair e voltar inicia em zero. |
| Celular e acessibilidade pontual | PASS local: quatro larguras, nomes acessíveis, foco por teclado e alvos de pelo menos 44 px. Leitores de tela e aparelhos físicos permanecem pendentes. |
| Offline | PASS: carregamento inicial com rede seguido de recarga sem conexão; `9 × 9 = 81` offline. Também funciona com localStorage bloqueado. |
| Regressões | PASS: recursos anteriores do app, incluindo módulo familiar,9 PDFs e caderno. Os 108 arquivos de materiais/livro correspondem byte a byte ao pacote anterior em public e dist. |

Evidências: `evidencias/navegador.json`, `evidencias/resumo-navegador.json`, `evidencias/preservacao.json`. Capturas: `evidencias/calculadora-mobile.png` e `evidencias/calculadora-desktop.png`. A anotação de captura registra que skip-link/barra fixa foram ocultados somente no momento de capturar o painel completo; fontes do produto não foram alteradas.

A primeira execução encontrou um seletor de teste que tentava consultar por role a sidebar oculta no celular. O harness foi corrigido para verificar DOM e menu acessível, com o nome correto do favorito, e a execução definitiva passou no mesmo build. Nenhuma correção do produto foi necessária. Não houve teste de Cloudflare, iPhone/Safari, Android físico, VoiceOver/TalkBack/NVDA ou homologação institucional.
