# Siglário — atualização do texto fornecido na v14

A v14 aplica o segundo envio de 13 entradas. O autor informou que conferiu esse texto com a instituição e pediu para manter o que não mudou. A aplicação registra essa confirmação como informação fornecida pelo autor. Não foram verificados diretamente autoria, responsável pela conferência, versão institucional ou aprovação oficial do material.

## Origem e alterações

O arquivo `src/data/glossario-hospital.txt` permanece como a transcrição original da v13. As 13 entradas reenviadas estão registradas separadamente em `src/data/siglario-confirmacao.json` e são aplicadas sobre essa base. Isso preserva o registro anterior e permite identificar a origem da atualização.

| Entrada | Tratamento na v14 |
| --- | --- |
| NPT | A definição passa de “Nutrição parenteral potal” para **Nutrição parenteral total**. |
| PPlato / PPlat | O nome visível passa a **PPlat**; **Pressão de Plantô** é mantido conforme o novo envio. A busca aceita PPlato e o ID anterior permanece. |
| TG EXT | **Tangente externa** foi explicitamente associado à sigla no novo envio; a nota sobre a associação deslocada deixa de aparecer. |
| R-CHOP | A composição enviada é mantida e recebe o contexto adicional fornecido pelo autor. Não foram acrescentados componentes. |
| R-CVP | A composição enviada é mantida e recebe o contexto adicional e o link fornecidos pelo autor. Não foram acrescentados componentes. |
| AC + D, ECOG, FOLFIRI, KeV, MSSA, MV, SIRS e VEF1 | As definições repetidas no novo envio são mantidas como recebidas. **MV — Murmúrio vesicular** já coincidia com a base anterior. |

Os contextos de R-CHOP e R-CVP são apresentados como textos fornecidos, sem doses, duração, indicação individual ou instruções para ajustar tratamento. O usuário indicou o [link de R-CVP no Cancer Research UK](https://www.cancerresearchuk.org/about-cancer/treatment/drugs/r-cvp). Ele fica disponível como referência externa opcional e precisa de internet; a leitura do conteúdo copiado não exige sair do aplicativo.

As tentativas de consultar páginas públicas para conferência neste ambiente foram bloqueadas pelo proxy. O link fornecido não é identificado como referência diretamente verificada. Não há sincronização automática com esse site, com o relatório original do Google ou com documentos institucionais.

## Notas de conferência

As notas de **NPT** e da associação **TG EXT → Tangente externa** deixam de aparecer conforme o novo envio. Permanecem **11 notas específicas**, sem substituir as definições que o autor pediu para manter:

| Entrada | Ponto preservado para revisão |
| --- | --- |
| MSSA | O texto utiliza “resistant” em inglês e “sensível” em português. |
| SIRS | Correspondência entre a sigla e a expansão fornecida. |
| PPlat | Expressão “Pressão de Plantô”, mantida conforme o novo envio. |
| VEF1 | Expressão de tempo “minuto 1”, mantida no texto. |
| ECOG | Repetição “Cooperative Cooperative”. |
| KeV | Correspondência entre o símbolo e o nome de unidade fornecido. |
| MeV | Correspondência entre o símbolo e o nome de unidade da base anterior; essa entrada não foi reenviada. |
| AC + D | Grafia e composição mantidas conforme o texto fornecido. |
| FOLFIRI | Grafia e composição mantidas conforme o texto fornecido. |
| R-CHOP | O novo contexto afirma cinco medicamentos, mas a composição enviada enumera quatro. |
| R-CVP | Composição mantida conforme o texto fornecido. |

A confirmação relatada pelo autor é preservada na atribuição do material. As notas registram pontos presentes no texto mantido e não significam que a aplicação realizou uma revisão clínica independente. A atualização não completa medicamentos por inferência nem altera definições silenciosamente.

## Compatibilidade e recursos preservados

O total continua sendo **746 entradas**, com **745 formas textuais distintas**. As duas definições de HD permanecem separadas, assim como as variantes de caixa e pontuação. O nome visível continua **Siglário**; a rota técnica `#glossario` e os IDs antigos permanecem válidos. O antigo favorito `term.pplato` e o endereço `#glossario/pplato` abrem a entrada agora denominada PPlat.

A busca na tela inicial, a busca interna, os filtros por inicial, a paginação, os favoritos e a leitura offline após carregamento completo permanecem disponíveis. Nenhuma pesquisa é guardada ou enviada para terceiros. Marcações, visitas, favoritos e última página do livro ficam apenas no navegador, sem cadastro ou sincronização entre aparelhos.

Os sete PDFs originais, o livro de 96 páginas, as referências e os créditos, os oito módulos, as 32 questões e os cinco casos não são modificados por esta atualização. Os PDFs mantêm a abertura nativa da v12. As apostilas continuam em cache sob demanda; arquivos externos exigem conexão.

## Verificação

Verificação concluída em **21/10/2026**:

- `npm test`: **57 testes em 10 arquivos**, além dos testes do service worker para cache sob demanda, Range/If-Range, respostas offline e falhas de armazenamento.
- `npm run build`: TypeScript e compilação aprovados, com integridade das 96 páginas do livro e das cinco apostilas conferida.
- Chromium automatizado: **11 grupos aprovados**, sem erros ou avisos, no cache final `cti-f6aac852484a`. A conferência incluiu os 13 textos literais e sua atribuição, NPT, TG EXT, PPlat e os atalhos antigos, complementos de R-CHOP/R-CVP, 11 notas, paginação completa, filtros, pesquisa, favoritos, progresso anterior e consulta offline.
- Layouts de **320, 390 e 1440 pixels** sem rolagem horizontal indevida, com inspeção visual de capturas em celular e computador. Os sete links de PDFs originais, o livro de 96 páginas, os oito módulos, as 32 questões, os cinco casos e as oito medidas do tópico PAV foram preservados.
- O link R-CVP não gera requisição automática. O teste de clique verificou a URL fornecida e `noopener` com destino interceptado localmente; não recuperou nem validou o conteúdo externo.
- Cache inicial: **112 URLs e 10.819.642 bytes**; as cinco apostilas continuam sob demanda.
- `downloads/conhecendo-a-cti-v14.zip`: **118 arquivos, 70.156.101 bytes**, com CRC válido, `index.html` na raiz e conteúdo idêntico a `dist/`. Os **105 arquivos** de `caderno/` e `materiais/` são idênticos aos da v13.

SHA-256 do ZIP: `382c58f71cc4012880c804d59a5da5dfc4817a2a2ff60d0aa1cc1163e05dc5dc`.

SHA-256 do registro de atualização: `02ce24f65085304a1e8b8c179576825caa354cc58a0b5fd5031f7edbe85e8a9c`.

A transcrição original da v13 permanece com o mesmo SHA-256: `b4d467453c57ee43fce01d3087965587254677f96c104ccc0d2451630b8bbfa3`.

Os resultados automatizados não substituem testes em iPhone e Android físicos nem uma revisão clínica independente. A publicação na Cloudflare não é atualizada automaticamente; siga [Atualizar versão 14](ATUALIZAR-V14.md) para enviar o ZIP ao mesmo projeto e preservar o endereço e o QR Code.
