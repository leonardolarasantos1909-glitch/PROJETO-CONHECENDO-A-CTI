# Siglário dentro do aplicativo — v13

A v13 substitui o glossário anterior pelo **Siglário**, formado pela transcrição enviada para o projeto: **746 entradas**, com **745 formas textuais distintas**. A sigla **HD** aparece em duas entradas, com definições diferentes, e ambas foram mantidas. A leitura, a pesquisa e os favoritos funcionam dentro do aplicativo; não é necessário abrir outro site para consultar os termos.

## Origem e fidelidade

A fonte incorporada é o texto completo fornecido pelo usuário na conversa, preservado em UTF-8 em `src/data/glossario-hospital.txt`. O primeiro envio parcial continha 22 entradas que reapareceram no envio completo; esse trecho inicial não foi acrescentado novamente à lista.

O usuário indicou como origem o [relatório no Google Looker Studio](https://datastudio.google.com/u/0/reporting/43feb19a-9a1e-41e5-b86a-2dd1914020ea/page/p_tx8e7de5fd). A tentativa de leitura do relatório neste ambiente foi bloqueada pelo proxy, com resposta HTTP 403; não foi possível comparar a transcrição ao conteúdo publicado. Esse resultado não determina se o relatório exige conta ou autorização. Não foram verificadas autoria, versão ou aprovação institucional do relatório. O aplicativo identifica o material como **transcrição fornecida para este projeto**, sem apresentar aprovação clínica ou institucional.

As siglas e definições mantêm grafia, maiúsculas, acentos, pontuação, asteriscos e símbolos do material fornecido. Entradas como **C**, **C.**, **CA**, **Ca**, **D+** e **D-** têm identificadores distintos. As duas entradas de **HD** também têm IDs próprios. A busca aceita diferenças de maiúsculas e minúsculas e pode encontrar mais de uma entrada; isso não funde seus textos ou favoritos.

O parser em `src/hospital-glossary.ts` contém uma associação explícita que precisa de conferência: **TG EXT → Tangente externa**. Na mensagem, `TG EXT` apareceu sem definição imediatamente ao lado, e `Tangente externa` veio deslocado após a definição de `VCM`. O arquivo de transcrição preserva o trecho recebido; a entrada exibe uma nota de revisão sobre essa associação. Não foram criadas expansões para preencher outras lacunas.

## Consulta no aplicativo

1. Abra **Siglário** na tela inicial ou no menu de ferramentas.
2. Digite uma sigla ou uma palavra da definição, como **AAS**, **SpO2** ou **balanço hídrico**.
3. Use **Filtrar por inicial** para escolher **0–9**, uma letra de **A a Z** ou **Todas as iniciais**. Ao digitar uma nova pesquisa, o filtro de inicial volta a todas.
4. A lista mostra até **40 termos por vez**. **Mostrar mais termos** acrescenta até 40 e coloca o foco no primeiro item recém-exibido. O contador informa os resultados e quantos estão visíveis.
5. **Limpar pesquisa do siglário** e **Mostrar todos os termos** restauram a consulta geral. **Favoritar** guarda um atalho para a entrada correspondente neste navegador.

Os resultados da busca na tela inicial também abrem a entrada exata do siglário. Um link para uma das definições de **HD** mantém a seleção dessa entrada. Os textos são exibidos como dados, sem executar conteúdo da transcrição.

## Pendências de conferência

Treze entradas recebem a indicação **Conferir com a fonte**, preservando a redação recebida. As notas destacam pontos para revisão e não substituem o texto por uma correção presumida.

| Entrada | Ponto para conferência |
| --- | --- |
| MSSA | Coerência entre a expressão em inglês e a descrição de sensibilidade. |
| SIRS | Expansão da sigla fornecida. |
| NPT | Grafia da definição fornecida. |
| PPlato | Grafia da definição fornecida. |
| VEF1 | Redação e unidade de tempo da definição. |
| ECOG | Repetição de palavra na expansão em inglês. |
| KeV | Nome da unidade associado à sigla. |
| MeV | Nome da unidade associado à sigla. |
| FOLFIRI | Grafia de componente na definição recebida. |
| AC + D | Grafia de componente na definição recebida. |
| R-CHOP | Composição descrita na transcrição. |
| R-CVP | Composição descrita na transcrição. |
| TG EXT | Associação à definição que apareceu deslocada no texto. |

A revisão clínica e institucional do siglário completo permanece pendente. Preservar a transcrição não equivale a validar suas definições. Não foram acrescentados cálculos, doses, dados de pacientes ou instruções de ajuste de tratamento.

## Favoritos e compatibilidade

Favoritos antigos continuam ligados à entrada correspondente quando existe equivalência no novo material. **Glasgow** passa à entrada **GCS**. Quando não há equivalente, o favorito antigo passa a abrir o siglário geral, sem inventar uma definição ou apontar para outra sigla parecida. Em particular, o antigo **PAI** não deve ser convertido em **PAI + CD**. Os demais favoritos, marcações, visitas e última página do livro são preservados.

O nome exibido no aplicativo passa a ser **Siglário**. O endereço técnico `#glossario`, os identificadores e os nomes de arquivos foram mantidos para preservar os atalhos antigos conforme essa compatibilidade. Nenhuma consulta exige cadastro nem é enviada para o Google. As pesquisas não são guardadas. O conteúdo copiado não se sincroniza automaticamente com mudanças futuras do relatório; uma nova transcrição revisada requer outra atualização do aplicativo.

## Offline e recursos preservados

O siglário integra o aplicativo e seu cache de produção. O primeiro carregamento completo exige internet; depois, os termos e a pesquisa ficam disponíveis offline enquanto o navegador mantiver os arquivos. O navegador pode limitar ou remover seu armazenamento.

Os oito módulos, as 32 questões, os cinco casos, o checklist, os desenhos e o livro de 96 páginas continuam disponíveis. Os sete PDFs mantêm a abertura nativa adotada na v12, sem voltar ao leitor reduzido: **Abrir PDF** usa o arquivo original no navegador ou visualizador do aparelho. A consulta ao siglário não baixa as apostilas; elas continuam sob demanda. Referências externas exigem conexão.

## Verificação

Verificação concluída em 21/10/2026:

- `npm test`: **55 testes em 10 arquivos**, além dos testes do service worker para Range/If-Range, cache completo sob demanda, leitura offline e falhas de armazenamento.
- `npm run build`: TypeScript e compilação aprovados; integridade das 96 páginas do livro e das cinco apostilas conferida.
- Chromium automatizado: **11 grupos aprovados**, sem erros ou avisos, na versão final `cti-c11c8387fa1d`. Foram conferidos os 746 registros, pesquisa e foco de teclado, filtros, símbolos e variantes de caixa, HD com duas definições, seleção exata por link, notas de revisão, paginação de 40 até 746, busca inicial, migração de favoritos e leitura offline. As larguras de 320, 390 e 1440 pixels foram verificadas, com inspeção visual das capturas.
- Regressões: os sete links para PDFs originais, o livro de 96 páginas, as 32 questões, os cinco casos e as oito medidas do tópico PAV permanecem disponíveis. A consulta ao siglário não faz requisições ao Google.
- Cache inicial: **112 URLs e 10.817.485 bytes**, incluindo os dois PDFs do caderno e as imagens do livro. As cinco apostilas permanecem sob demanda.
- `downloads/conhecendo-a-cti-v13.zip`: **118 arquivos, 70.155.432 bytes**, com `index.html` na raiz, CRC válido e conteúdo idêntico a `dist/`. Todos os arquivos em `caderno/` e `materiais/` são idênticos aos da v12.

SHA-256 do ZIP: `42e2c62386b6cf61545b236dbcb9cb6cbca60974467a0cd78abbe0e799f648c7`.

SHA-256 da transcrição UTF-8: `b4d467453c57ee43fce01d3087965587254677f96c104ccc0d2451630b8bbfa3`.

Essas verificações foram feitas no build local. A publicação no endereço da Cloudflare depende do envio do ZIP pelo responsável; ela não foi atualizada automaticamente.

Safari em iPhone e Chrome/visualizador em Android físicos continuam no [roteiro manual](TESTAR-NO-CELULAR.md). Testes automatizados de navegador não substituem essa conferência nem a revisão clínica e institucional.

Para publicar no mesmo endereço e manter o QR Code, siga [Atualizar versão 13](ATUALIZAR-V13.md).
