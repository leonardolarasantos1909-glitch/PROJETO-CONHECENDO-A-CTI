# Acolher também é cuidar — verificação de aceitação

Em **27/10/2026**, o cache `cti-d12796ff1838` passou em **27/27 grupos de navegador**, com **102 destinos**, **112 verificações de layout** em 320, 390, 768 e 1440 px e **167 amostras de contraste** (mínimo 4,92:1). Não houve falha final, exceção JavaScript, aviso, violação CSP ou requisição externa automática. A execução foi Chromium headless em Linux, com `_headers` simulados localmente; não é homologação Cloudflare.

| Critério do pedido | Resultado | Evidência e limite |
| --- | --- | --- |
| Card na página inicial | PASS local | Nono módulo, título e descrição exigidos, ícone e acesso interno; oito módulos anteriores preservados. |
| Cinco seções funcionando | PASS local | Abas, setas/Home/End, associação tab/painel, acesso por URL e recuperação de seção/caso desconhecido. |
| Cards e exemplos acessíveis no celular | PARCIAL | Consulta por teclado e sem transbordamento em quatro larguras; iPhone/Safari, Android/Chrome e leitores de tela reais não testados. |
| Oito simulações com feedback | PASS local | 24 escolhas verificadas (8×3), resposta recomendada/explicação, foco no feedback, próximo Tab no avanço, nova tentativa e reinício; estado só em memória. |
| Quatro páginas A5 em A4 dobrado | PASS local | PDF de leitura com 4 A5 148×210 mm; PDF de impressão com 2 A4 297×210 mm, ordem 4|1 na frente e 2|3 no verso. Textos integrais presentes em cada painel. |
| Visualização, download e impressão | PARCIAL | Prévia HTML 1–4, PDF real baixado com SHA correspondente e botão de impressão acionado. PDF gerado pelo Chromium tem 2 faces A4, mesmos textos e sem menus. Impressora física, orientação real de duplex e diálogo nativo móvel não testados. |
| Layout anterior preservado | PASS local | Regressões e capturas conferidas; paleta vinho/verde, componentes existentes e responsividade mantidos. |
| Demais módulos funcionando | PASS local | 32 diálogos, 15 desenhos, 32 questões, cinco casos anteriores, perfis, checklists, laboratório, box, favoritos, Siglário e offline passaram; sete PDFs e caderno de 96 páginas preservados. |
| Sem login | PASS local | Navegação pública por fragmentos; nenhum formulário de autenticação. |
| Sem coleta de dados de pacientes | PASS local | Casos fictícios, sem campos de identificação ou texto livre no módulo; respostas não persistem nem são enviadas. A integridade dos PDFs herdados não substitui revisão clínica integral desses documentos. |
| Validação institucional sinalizada | PASS local | Aviso educativo e revisão pendente no módulo/folheto/catálogo. Regra de um visitante aparece só como relato da CTI Cardio sujeito a confirmação; não aparece no folheto geral. |

Também foram verificados busca por família/visitante/comunicação, favoritos, duas versões do folheto e cinco seções offline após o primeiro carregamento. As fontes externas continuam exigindo internet.

Evidências da execução:

- `evidencias/navegador.json`: 27 grupos, formulários, foco, URLs, layouts e contraste.
- `evidencias/impressao-navegador.json`: dimensões, paginação, textos completos e imposição dos PDFs e da impressão HTML.
- `evidencias/impressao-navegador.pdf`: saída de impressão do Chromium para inspeção; não substitui o PDF de distribuição.
- `evidencias/modulo.png`: módulo em viewport real de 390×844.
- `evidencias/previa-mobile.png` e `evidencias/seguranca-mobile.png`: recortes limpos das páginas do folheto, com barras fixas ocultadas só durante a captura.
- `evidencias/impressao-frente.png` e `evidencias/impressao-verso.png`: renderizações em cinza da saída de impressão.

A enfermeira responsável e a instituição ainda precisam revisar textos, atribuições, fontes, regra local e autorização de entrega do folheto. Não houve publicação, certificação clínica, teste em aparelhos físicos ou aceite institucional nesta execução.
