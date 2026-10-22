# Aceitação final — Conhecendo a CTI

Em 22/10/2026, o build de cache `cti-24151e273c6b` passou nos **20 grupos de testes de navegador**, com **82 destinos internos únicos**. A execução usou Chromium headless em Linux e um servidor local que aplica as regras reais de `dist/_headers`. Não foi feito deploy no Cloudflare.

| Critério do pedido | Resultado | Evidência e limite |
| --- | --- | --- |
| 1. Abertura em navegadores móveis e desktop | PARCIAL | Chromium em larguras de 320, 390 e 1440 px; 69 verificações de layout sem transbordamento. iPhone, Android, Safari e instalação nos aparelhos precisam de teste manual. |
| 2. Navegação entre todos os módulos | PASS | Oito módulos preservados, 32 conteúdos em diálogos, 15 ilustrações, sete acessos a PDF e sete novas ferramentas. Foram percorridos 82 destinos únicos. |
| 3. Troca de perfil sem login | PASS | Estagiário, novo colaborador e exploração sem escolher; troca pelo cabeçalho e pela tela de perfil, persistência, quatro valores inválidos rejeitados e oito módulos gerais disponíveis em ambos os perfis. |
| 4. Pesquisa e filtros | PASS | Busca por nomes e aliases, categorias, paginação e destinos internos; Siglário com 746 entradas e 11 notas preservadas; catálogo com 847 registros e filtros de situação/categoria. |
| 5. Persistência local dos checklists | PASS | Dez itens para estagiários e nove para integração; recarga, independência, reinício e limpeza das seis chaves de aprendizado sem apagar uma chave alheia. Armazenamento bloqueado mantém funcionamento na sessão e exibe aviso. |
| 6. Casos clínicos | PASS | Cinco casos fictícios, dez decisões, explicações, fontes, reinício e foco; 32 questões do quiz com feedback textual, referências e navegação por teclado preservados. |
| 7. Exercícios de anotação | PASS | Três cenários fictícios, cinco critérios de autorrevisão manual, exemplos e fontes. Troca de cenário, limpeza e saída apagam o texto. Marcador de teste ausente do armazenamento e das requisições; não há correção clínica automática. |
| 8. Seletor educativo de escalas | PASS | Dor, sedação/agitação e consciência; quatro guias anteriores e introdução de Glasgow. Os quatro endereços canônicos e os dois endereços longos anteriores de EVA e BPS selecionam a escala e a finalidade corretas. Sem campos de paciente ou cálculo. Comparação entre finalidades e reabertura de Glasgow funcionam mesmo sem mudança do hash. |
| 9. Acessibilidade do CTI virtual | PARCIAL | Oito itens na cena e oito equivalentes na lista, 16 aberturas por teclado, diálogo nativo, título/descrição dos desenhos, Escape e retorno ao acionador testados. Leitor de tela real e auditoria WCAG completa não executados. |
| 10. Ausência de dados identificáveis de pacientes | PARCIAL | Novos fluxos usam cenários fictícios; questionário fechado sem nome, e-mail, matrícula ou texto livre. Laboratório e respostas ficam na memória. Nenhuma requisição externa ou envio de formulário observado. Isso não substitui revisão institucional integral de todos os PDFs e materiais herdados. |
| 11. Apresentação de referências | PARCIAL | Fontes, origem, versão e pendências apresentadas; revisão clínica explicitamente não realizada e nenhum registro com validação institucional exibido no catálogo. A adequação clínica e a validade de cada referência ainda dependem de revisão profissional; os sites externos não foram clinicamente auditados por este teste. |
| 12. Integridade das funcionalidades anteriores | PASS | Favoritos, leitura retomada, 96 páginas do caderno, sete PDFs byte a byte com SHA-256 preservado, Siglário, quiz, casos, navegação, busca, instalação informativa e uso offline mantidos. |
| 13. Ausência de erros críticos de build, execução e navegação | PASS | Build congelado fornecido pela integração e suíte local concluída: zero falhas finais, exceções de execução, avisos, erros de console, violações CSP ou requisições externas. Todos os métodos observados foram GET. A simulação de cabeçalhos foi local. |
| 14. Deploy de homologação | NÃO EXECUTADO | Não foi publicado ambiente separado nem alterada a produção. A entrega local não comprova o comportamento do serviço Cloudflare; faltam a configuração e a validação de homologação autorizadas. |

## Evidências

- Resultado detalhado: [navegador.json](evidencias/navegador.json).
- Exportação fictícia conferida: [avaliacao-simulada.json](evidencias/avaliacao-simulada.json), somente `instrumentVersion` e `answers`, contendo apenas `item` e `answer` em cada resposta; sem identificador ou horário.
- Captura completa da cena: [box-virtual.png](evidencias/box-virtual.png).
- Outras capturas: [início](evidencias/inicio-mobile.png), [perfil](evidencias/perfil-inicio.png), [laboratório](evidencias/laboratorio.png) e [Sobre](evidencias/sobre-desktop.png).

Foram conferidas 151 amostras de contraste de texto, com razão mínima de 4,92:1; controles de formulário auditados têm pelo menos 16 px. Trata-se de verificação pontual, sem alegação de conformidade WCAG integral. Zoom nativo de 200% e 400%, VoiceOver, TalkBack, NVDA e dispositivos físicos não foram exercitados.

A avaliação do PBL exige concordância e sete respostas fechadas para gerar o resumo; a exportação ocorre somente por ação do participante. O roteiro de demonstração tem nove etapas e acompanhamento em memória. Nenhum banco de dados, coleta remota, e-mail automático, login ou integração hospitalar foi criado.

Uma execução anterior encontrou uma espera insuficiente no próprio teste após clicar no menu móvel, corrigida esperando o novo título. Na revisão final, a integração identificou e corrigiu a seleção dos endereços longos anteriores de escalas. A suíte final foi repetida no novo build e passou, incluindo os endereços canônicos e os aliases de EVA e BPS.
