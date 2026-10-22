# Fase 1 — verificação de navegador e regressões

Data: 22/10/2026. Build final local congelado: **cti-23dbb6d5f52f**. Base anterior: `e31d24b2e479f867b2c672831e16d2bedc09ec56`. Chromium headless em Linux com Playwright; servidor temporário na porta 4211, encerrado ao concluir. Nenhuma fonte, dependência, build, material, Git ou publicação foi alterada por esta verificação.

## Resultado

**12/12 grupos concluídos**, sem falhas do harness, exceções JavaScript ou avisos de console. Foram percorridos **74 destinos únicos**, **32 diálogos**, **15 desenhos** e **48 amostras de layout** nas larguras de 320, 390 e 1440 pixels. Não houve overflow horizontal indevido nas amostras.

A existência de verificações aprovadas não certifica acessibilidade integral, revisão clínica nem aprovação institucional.

## Correções da Fase 1 verificadas

| Alteração | Evidência executada |
| --- | --- |
| Foco ao responder quiz | A escolha mantém a pergunta atual e foca `.quiz .feedback`, `DIV` com `tabindex=-1`, nome/descrição e `role=status`. O próximo Tab vai diretamente a **Próxima questão** ou **Ver resultado**. O `fieldset.disabled` continua impedindo mudanças de resposta. |
| Foco ao avançar/finalizar | Todas as 32 questões foram percorridas; **Próxima questão**, **Ver resultado** e **Refazer quiz** focam o `H2` da pergunta/resultado correspondente. |
| Troca de assunto | Cada assunto reinicia no primeiro item e foca a pergunta. Selecionar o valor que já estava ativo mantém o select, sem simular uma troca inexistente. |
| Resposta sem depender de cor | **Sua escolha** e **Resposta esperada** são visíveis e distinguíveis nas alternativas. A resposta correta escolhida recebe os dois rótulos; explicações textuais e contagem permanecem. |
| Página/grupo atual | Há um único `aria-current` por menu representado: `page` para página-base e `location` para grupo. **Módulos** fica visualmente ativo em `#modulos` e nos módulos clínicos/quiz; Biblioteca representa livro/PDF. |
| Atalho de teclado | **Pular para o conteúdo** aparece com foco, aponta para `main#conteudo-principal`, foca o main e preserva a URL/hash. Fora de foco permanece acima da viewport; não invade a leitura do quiz. |
| Títulos do documento | Rotas conhecidas e URL direta de assunto atualizam `document.title`, preservando o nome Conhecendo a CTI. |
| Contraste | **35 amostras** de texto nos grupos auditados, todas pelo menos 4,5:1; mínimo calculado **4.92:1**. Descrições, breadcrumb, rodapé, fontes/revisão, quiz e livro foram incluídos. |
| Inputs de leitura | Select do quiz e input de página do livro mediram **16 px** no estilo computado. |

O smoke adicional de teclado confirmou contorno de foco **3 px sólido** na explicação, próximo Tab no botão continuar e skip link não focado com borda inferior fora da viewport (`bottom=-12`). Uma captura inicial feita do elemento completo foi substituída por captura de viewport para não misturar elementos fixos fora da área visível.

## Regressões preservadas

- Oito módulos; 32 diálogos de assunto e seus links diretos; 15 SVGs com descrição/legenda; Escape e retorno de foco dos diálogos.
- Busca por PAV/RASS/PPlato, envio/limpeza, resultados internos e paginação. Siglário com **746 entradas**, filtros e **11 notas** originais.
- Checklist de dez itens, persistência após recarga e reinício. Favorito antigo de PPlato abre **PPlat**; limpeza remove apenas as quatro chaves do app e conserva uma chave não relacionada de teste.
- Cinco casos fictícios nas duas etapas: alternativas, feedback, fontes, discussão, repetição e foco.
- Quatro guias de escala, teclado com setas/Home/End, referências e ausência de formulário de paciente/calculadora de conduta.
- Sete páginas de acesso aos PDFs, links ao arquivo original com `target=_blank` e `noopener noreferrer`, retorno à Biblioteca e ausência de iframe/preview reduzido.
- Livro de **96 páginas**, navegação por teclado, índice, transcrição e retomada da página salva.
- Falha de localStorage tratada sem exceção: checklist informa que não pôde salvar e navegação continua disponível.
- Após ativação/recarga do cache final, busca, Siglário, checklist, quiz/casos, escalas e livro continuaram operando offline.
- SHA-256 dos **sete PDFs**, tanto em `public/` quanto em `dist/`, correspondente aos cadernos conhecidos e ao inventário de apostilas. Manifesto do livro permanece com 96 páginas e o mesmo hash do PDF de origem.
- Nenhuma requisição externa automática foi registrada. Quiz/casos não acrescentaram armazenamento permanente de respostas.

## Artefatos finais

- [JSON principal](evidencias/navegador.json).
- Harness utilizado na sessão: `/tmp/cti-browser/phase1-browser-check.mjs`.
- [Smoke de foco](evidencias/feedback-teclado.json).
- Capturas inspecionadas: [quiz](evidencias/quiz.png), [atalho](evidencias/atalho-mobile.png), [início](evidencias/inicio-mobile.png) e [Sobre](evidencias/sobre-desktop.png).

## Limitações

Não foram usados iPhone/Android físicos, Safari/WebKit reais, VoiceOver, TalkBack, NVDA ou JAWS. Zoom nativo de navegador em 200%/400% não foi exercitado; as larguras responsivas foram verificadas. Os testes das sete páginas e links de PDF não certificam a acessibilidade interna dos documentos nem o comportamento de todos os visualizadores móveis.

A publicação Cloudflare e um deploy separado de homologação não foram acessados ou alterados. Não há afirmação de conformidade WCAG integral, aprovação clínica/institucional, anonimização integral de todo PDF/imagem ou validação de referências externas. Os recursos de fases posteriores não foram tratados como implementados.
