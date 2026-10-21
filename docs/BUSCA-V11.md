# Busca na tela inicial e retorno dos PDFs — v11

A versão 11 destaca **Pesquisar no app** na tela inicial e reúne os conteúdos existentes em uma pesquisa por nome ou assunto. Mantém os oito módulos, o tópico de prevenção da PAV da v10, as escalas, o checklist, os favoritos, o glossário, os desenhos educativos, os casos PBL, as 32 questões de revisão e o livro virtual.

## Como usar

Digite um nome, sigla ou assunto, como **PAV**, **RASS**, **Curativos** ou **bomba de infusão**. A lista é atualizada enquanto você digita. Os três primeiros exemplos também aparecem como atalhos para toque.

**Buscar** ou a tecla de pesquisa do teclado direciona o foco para a lista, sem abrir uma resposta automaticamente. Toque em um resultado para acessar seu conteúdo. A lista apresenta até oito resultados inicialmente; **Mostrar mais resultados** acrescenta até oito por vez, com indicação de quantos estão visíveis e do total encontrado. **Limpar pesquisa** devolve o foco ao campo e restaura os oito módulos da tela inicial.

Pesquisas sem resultado exibem uma orientação para tentar outro nome ou limpar o campo. Uma pesquisa formada apenas por pontuação também não mostra resultados.

## O que é pesquisado

O catálogo local reúne nomes, descrições, siglas, nomes alternativos e textos internos já presentes no aplicativo. A comparação aceita diferenças de maiúsculas, acentos e pontuação; palavras de uma consulta podem aparecer em outra ordem, desde que estejam no mesmo conteúdo catalogado. Nomes e siglas correspondentes têm prioridade na lista. Palavras inteiras têm preferência sobre coincidências parciais: “dor” não prioriza “ventilador” apenas por conter as mesmas letras.

| Tipo de resultado | Ao tocar |
| --- | --- |
| Módulo | Abre o módulo correspondente. |
| Assunto | Abre o tópico ou o diálogo correspondente, incluindo o guia de PAV. |
| Escala | Abre a escala correspondente, como RASS, BPS ou PAINAD. |
| Glossário | Abre o termo correspondente. |
| Ferramenta | Abre o checklist, o glossário, os favoritos ou o leitor do caderno. |
| PDF | Abre o cartão do material na Biblioteca; o usuário escolhe ler, abrir ou baixar. |
| Caso simulado | Abre o caso PBL correspondente. |

Nos materiais em PDF, a busca considera o título, a descrição e os dados textuais do catálogo. **Não pesquisa o texto integral dos PDFs nem das páginas do livro**, não extrai documentos durante a consulta e não busca informações na internet. A existência de um resultado não implica que seu conteúdo tenha sido revisado clinicamente.

## Privacidade, acesso e preservação

A pesquisa é executada no próprio aplicativo, sem login, cadastro, analytics, envio das consultas ou histórico de pesquisas. Não lê as marcações do checklist nem os favoritos para montar os resultados. Esses recursos continuam usando apenas o armazenamento local já existente.

O catálogo integra o aplicativo e fica disponível offline após o carregamento completo da versão atual e a ativação de seu cache. Referências externas exigem internet; as apostilas em PDF mantêm o cache sob demanda e as opções de download já existentes. O navegador pode remover arquivos armazenados conforme suas políticas.

Esta versão não altera os textos clínicos, PDFs, imagens do livro, referências ou créditos. O endereço `https://proud-math-302f.conhecendoacti.workers.dev/` e o QR Code continuam os mesmos ao atualizar o mesmo projeto da Cloudflare. A revisão clínica e institucional permanece pendente.

## Retorno dos PDFs

Os botões **Abrir apostila**, **Abrir PDF** e **PDF original**, assim como as referências aos documentos locais, abrem o leitor interno. O topo mantém **Voltar à biblioteca** e **Início**, inclusive durante o carregamento ou uma falha. Há navegação por página, ampliação, texto e links extraídos e download. Os PDFs permanecem idênticos aos arquivos da v10. Consulte [o leitor de PDFs](LEITOR-PDF-V11.md).

## Verificação

- **Testes automatizados:** 49 testes passaram, incluindo busca por nomes e siglas, normalização, palavras em outra ordem, destinos internos, consultas vazias ou desconhecidas e integridade do catálogo.
- **Service worker:** as verificações automatizadas passaram.
- **Build de produção:** passou, incluindo as verificações dos materiais e a compilação TypeScript.
- **Navegador:** busca conferida no Chromium em larguras de 320, 390 e 1440 pixels, com sete grupos de verificações aprovados: destinos, teclado, paginação, layout, preservação e offline. O leitor de PDFs passou em oito grupos adicionais: páginas, ampliação, botões de retorno, fontes locais, falhas, preservação e leitura offline; primeira e última página dos sete arquivos conferidas.
- **Aparelhos físicos:** a conferência no Safari de iPhone e no Chrome de Android continua no roteiro manual, incluindo instalação, downloads e funcionamento offline.

Para revisar manualmente, teste os quatro exemplos de pesquisa, abra resultados de tipos diferentes, use **Mostrar mais resultados**, limpe o campo e confirme o retorno dos módulos. Confira também uma consulta inexistente, navegação por teclado e a pesquisa sem rede depois de preparar o cache. Verifique que um resultado de PDF mostra o cartão interno sem iniciar o download.

Consulte [como atualizar a versão 11](ATUALIZAR-V11.md) e o [roteiro para iPhone e Android](TESTAR-NO-CELULAR.md).

## Pacote conferido

`downloads/conhecendo-a-cti-v11.zip`: 319 arquivos, 72.799.992 bytes, `index.html` na raiz; CRCs válidos, conteúdo idêntico ao build testado e PDFs/imagens do livro idênticos à v10. Cache final: `cti-ee9b0021348a`. SHA-256: `4faf36446da27c2a2b0f791eccdf8f94e05cf06b67686081b48f12af76d63226`.
