# Navegação, responsividade e acessibilidade — Fase 0

Consolidado em 22/10/2026. Build local do commit `02c5dddbc0c62ff781e27277373b15959e61e231`, cache `cti-f6aac852484a`. Chromium headless em Linux, com Playwright. Nenhuma fonte, conteúdo, dependência ou publicação foi alterada.

## Resultado executado

Foram concluídos **dez grupos de verificação**, sem falha do harness final, sem exceções JavaScript e sem avisos de console nos percursos registrados. A auditoria confirmou problemas específicos de acessibilidade; os grupos concluídos não representam certificação de conformidade ou ausência de defeitos.

| Grupo | Resultado observado |
| --- | --- |
| Rotas, assuntos e PDFs | 73 destinos únicos percorridos, incluindo as rotas-base aplicáveis, links diretos, 32 diálogos de assuntos e sete páginas de acesso aos PDFs. Os 15 desenhos foram encontrados. Destinos desconhecidos apresentaram a página de erro prevista. |
| Pesquisa e Siglário | Pesquisa por PAV, RASS, PPlato, destinos internos, envio/limpeza, paginação, filtro por inicial e lista completa de 746 entradas/11 notas. |
| Primeiro dia | Dez itens; marcação preservada após recarregar; reinício e estado do botão conferidos. Checklist de colaborador não existe. |
| Favoritos e livro | Favorito antigo de PPlato preservado como PPlat; página retomada do livro de 96 páginas; controles e limpeza apenas das chaves de aprendizado. Uma chave não relacionada de teste não foi apagada. |
| Casos PBL | Os cinco casos percorridos em suas duas etapas, com feedback, alternativas desabilitadas após escolha, discussão final, fontes e repetição. |
| Quiz | 32 questões percorridas, assuntos, explicação e reinício. O teste também confirmou perda de foco ao avançar e reiniciar. O histórico de respostas não é salvo permanentemente. |
| Escalas | Quatro abas, seleção por teclado, setas/Home/End, referências e links diretos. Nenhum input de dados de paciente ou calculadora de pontuação/conduta foi encontrado nos guias. |
| Layout e navegação | 45 amostras de layout nas larguras 320, 390 e 1440 px, sem overflow horizontal indevido. Contraste amostrado, semântica de navegação e capturas foram inspecionados. |
| Armazenamento bloqueado | Checklist informou que não pôde salvar; navegação/favoritos continuaram disponíveis sem exceção JavaScript. |
| Offline | Após ativação e recarga do cache final, pesquisa, Siglário, checklist, caso, RASS e livro continuaram disponíveis sem rede. Referências externas e PDFs não baixados não receberam uma promessa de disponibilidade. |

Não foram registradas requisições externas automáticas no percurso final. Os links de referência não foram utilizados para conferir vigência de fontes clínicas ou simular acesso autorizado a documentos restritos.

## Problemas confirmados e reprodução

### Foco do quiz ao avançar e refazer

Em `#quiz`, responder uma questão, levar o foco a **Próxima questão** e pressionar Enter. Após a atualização, `document.activeElement` é `BODY`, em vez da nova pergunta. O mesmo ocorre ao usar **Refazer quiz** na conclusão. Evidência: `src/main.tsx:48`, cujo estado muda sem reposicionar foco; o botão anterior deixa de existir.

Impacto: pessoas que navegam por teclado podem perder sua posição no exercício. Proposta da Fase 1: focar a nova pergunta/resultado e identificar textualmente a escolha e a resposta esperada, aproveitando o padrão já usado nos casos.

### Contraste de texto secundário

Estilos computados confirmaram **3,68:1** nas descrições dos cards de módulos (`#7d887f` sobre branco, 10 px na amostra desktop) e **3,11:1** na legenda lateral (`#8b9492` sobre branco, 9 px). São inferiores ao parâmetro AA de 4,5:1 para texto normal. Outras amostras do CSS, incluindo rodapé, estão detalhadas no [anexo de acessibilidade](acessibilidade.md).

Impacto: leitura e localização rápida podem ser prejudicadas. Proposta: ajustes localizados nos tons e na tipografia, com teste dos estados reais, sem refazer a identidade visual.

### Estado atual da navegação

Na rota de escalas, tanto a navegação principal quanto a móvel tinham zero links com `aria-current`; há indicação visual por classe, mas não a semântica equivalente. A navegação das ferramentas já utiliza esse atributo. A inspeção do código também confirma que `#modulos` não recebe a classe ativa no menu lateral (`src/main.tsx:32,36,45`).

Proposta: uma regra consistente de página/grupo atual, mantidos os destinos e a composição dos menus.

## Melhorias que não foram classificadas como falhas formais isoladas

Não há link explícito de “Pular para o conteúdo”, mas existem landmark `main` e foco inicial na pesquisa/título. Adicionar o atalho é uma melhoria recomendada; sua ausência sozinha não foi tratada como prova de violação WCAG. Hierarquia de títulos, títulos de abas do navegador, legibilidade de fontes pequenas e anúncio do estado das respostas merecem revisão complementar.

## Ajustes do instrumento de auditoria

A primeira rodada teve duas asserções inadequadas: links externos da biblioteca foram tratados como botões de diálogo, e o estado de um `fieldset` foi consultado por uma API que não representava sua propriedade nativa. O harness final selecionou apenas botões de assunto, verificou `fieldset.disabled` e aguardou o efeito de foco dos casos. A rodada completa foi repetida e os dez grupos foram concluídos. Não houve correção de código do app para obter esse resultado.

## Evidências e limitações

- [Resultado bruto da rodada final](evidencias/navegador-final.json).
- [Tela inicial em viewport móvel](evidencias/inicio-mobile.png).
- [Sobre o Projeto em viewport desktop](evidencias/sobre-desktop.png).

Não foram utilizados aparelhos iPhone/Android, Safari/WebKit reais, VoiceOver, TalkBack, NVDA ou JAWS. Não se concluiu avaliação completa WCAG, testes de tags/ordem de leitura dos PDFs ou conformidade em todos os níveis de ampliação. O CTI virtual, perfis, laboratório e feedback ainda não existem, portanto não receberam testes funcionais como se estivessem implementados.

A publicação Cloudflare e a homologação não foram exercitadas pelo navegador local. Não foi realizado deploy nem alterado o endereço/QR Code.
