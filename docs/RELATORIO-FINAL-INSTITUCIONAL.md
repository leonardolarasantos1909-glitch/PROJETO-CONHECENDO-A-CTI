# Conhecendo a CTI — entrega final para avaliação institucional

Data: **22/10/2026**. Base: Fase 1, commit `29512441a52cddb9a9e7682da685db33118a1954`. Desenvolvimento autorizado após o diagnóstico/plano e a solicitação de concluir todas as etapas. Branch de revisão: `avaliacao-institucional/final`.

**A implementação prevista está consolidada e testada localmente. A homologação externa, o aceite clínico/institucional e a publicação permanecem pendentes.** O aplicativo não foi recriado; a produção e `main` não foram atualizadas. Não houve deploy, alteração de domínio ou troca de QR Code. O endereço que deve ser preservado numa publicação autorizada é `https://proud-math-302f.conhecendoacti.workers.dev/`.

O [ZIP final](https://github.com/leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI/raw/refs/heads/avaliacao-institucional/final/downloads/conhecendo-a-cti-final-revisao.zip) contém o aplicativo compilado, com `index.html` na raiz. O [passo a passo em português](GUIA-ENTREGA-FINAL.md) orienta a revisão e a homologação separada antes de atualizar o mesmo projeto.

## Situação de cada fase

| Fase | Resultado entregue | Situação e dependências |
| --- | --- | --- |
| 0 — Auditoria | Inventário, lacunas confirmadas e plano incremental em documentos próprios. | Concluída anteriormente; não confundir o diagnóstico histórico com o estado final. |
| 1 — Consolidação | Ferramentas corrigidas, foco/teclado do quiz, contraste, menus, skip link, títulos e ambiente Node documentado. | Concluída; preservada na versão final. |
| 2 — Perfis/checklists | Estagiário e novo colaborador opcionais, troca no topo, prioridades na inicial e checklists independentes de 10 e 9 itens. | Implementada e testada. Roteiro do colaborador é genérico e exige contextualização institucional. |
| 3 — Busca e conteúdo | Filtro por categoria, aliases, IDs explícitos compatíveis, favoritos novos e catálogo de 847 registros com origem/revisão. | Implementada e testada. Todos continuam pendentes de revisão profissional; nenhum selo institucional foi inventado. |
| 4 — Casos, anotações e escalas | Cinco casos/32 questões preservados, fontes por questão, três exercícios de anotação e cinco critérios de autorrevisão; finalidades dor, sedação/agitação e consciência. | Implementada e testada. Revisão dos exemplos, fontes e versões dos instrumentos segue pendente. |
| 5 — CTI virtual | Box fictício 2D, oito estações selecionáveis e lista equivalente, desenhos reaproveitados e retorno de foco. | Implementada e testada por teclado/Chromium; leitores de tela e toque em aparelhos físicos pendentes. |
| 6 — PBL/institucional | Sobre o Projeto ampliado, demonstração de nove etapas, avaliação voluntária local de sete itens e proposta de privacidade. | Implementada e testada. Nomes/créditos a confirmar. Nenhuma coleta remota criada. |
| 7 — Testes e homologação | Testes automatizados, regressões no navegador, verificações de segurança/integridade e pacote final. | Validação local concluída e pacote preparado. Deploy de homologação, ensaios reais, aceite e produção não executados. |

## Módulos A–H e experiência final

**Busca e Siglário:** pesquisa por sigla, nome, aliases e temas; categorias, paginação e destinos internos. As 746 entradas, as 13 atualizações recebidas e as 11 notas de conferência foram preservadas. HD mantém duas definições; PPlat e o atalho antigo de PPlato continuam funcionais. Não houve correção silenciosa de terminologia confirmada pelo responsável.

**Primeiro dia e integração:** o primeiro checklist conserva os dez itens e a chave anterior. O novo tem nove convites genéricos para conhecer pessoas de referência, comunicação, organização e recursos com acompanhamento. Não revela planta, ramais, localizações reais ou fluxos restritos. Preferência e marcações ficam no aparelho; os reinícios são independentes. Nenhum resultado equivale a capacitação, certificação ou liberação de procedimentos.

**Casos PBL e quiz:** reaproveitados cinco casos com duas decisões cada e 32 perguntas com explicações. Cada questão exibe sua base local ou módulo relacionado. Os vínculos documentam a origem educativa; quando não há fonte específica independente, isso continua sendo uma lacuna de revisão. Pontuação e respostas não vão a um serviço remoto.

**Laboratório de anotações:** três cenários fixos — higiene supervisionada, eliminação sem volume medido e dieta não iniciada. O exemplo usa exclusivamente os fatos fornecidos e explicita informações ausentes. A rubrica é manual: fidelidade, clareza, sequência quando informada, cuidado/comunicação e ausência de inferências. O aplicativo não analisa automaticamente o texto nem o transforma em prontuário. O rascunho fica em memória e é limpo ao sair/trocar de cenário.

**Escalas:** EVA/BPS/PAINAD em dor, RASS em sedação/agitação e o tópico introdutório existente de Glasgow em consciência. Os quatro guias detalhados, domínios/critérios, comparação, referências e favoritos foram preservados. O seletor não recebe dados de pacientes nem calcula condutas. Não foi inventada uma versão completa de Glasgow a partir da introdução.

**CTI virtual:** oito itens do conjunto existente de desenhos, com botões identificados, explicações, partes, fontes e alternativa textual. A cena não representa a planta do hospital nem uma montagem assistencial. As 15 ilustrações originais continuam nos módulos de equipamentos/dispositivos.

**Feedback/PBL:** sete perguntas fechadas, consentimento voluntário, resumo em memória e exportação manual de JSON mínimo, sem identificadores. Não há envio à equipe, banco de respostas, análise de usuários ou coleta automática. A [proposta de privacidade](PRIVACIDADE-AVALIACAO-PBL.md) registra as definições exigidas antes de qualquer coleta remota futura.

**Apresentação:** Sobre o Projeto informa origem acadêmica na Faculdade Moinhos de Vento, problema, objetivo, públicos, funcionalidades e limites. Nomes dos participantes, orientadores e revisores permanecem a confirmar. O roteiro de nove etapas usa situações fictícias. Não afirma adoção pelo Hospital Moinhos de Vento nem utiliza logotipo institucional.

## Preservação e manutenção

Permanecem os oito módulos e 36 assuntos, navegação por hash, favoritos antigos, progresso, caderno horizontal de 96 páginas, PDFs originais em visualizador nativo, downloads, instruções iOS/Android, referências e funcionamento offline. A seleção de perfil somente prioriza atalhos; nenhum módulo geral é ocultado.

Os sete PDFs, as 96 imagens e os demais arquivos em `materiais/` e `caderno/` são conferidos contra a v14. A integridade dos arquivos não equivale a revisão clínica ou autorização de redistribuição. As cinco apostilas incorporadas mantêm 147 páginas. Três anexos anteriores — Rotina, Segurança e Ventilação Mecânica — continuam não recuperados por limite de transferência, conforme [inventário das apostilas](APOSTILAS.md); não foram apresentados como incluídos.

A [estrutura de manutenção](MANUTENCAO-CONTEUDOS.md) permite atualizar dados sem reprogramar a interface. O catálogo adapta os materiais existentes e registra ID, categoria, público, descrição, referências, versão, data/responsável e situação. `npm run build` executa um validador real antes de compilar: rejeita material classificado como restrito, referências locais ausentes e rótulo de validação sem evidências mínimas. Isso não autentica documentos nem substitui avaliação humana; não há área administrativa.

Seis chaves locais guardam somente preferência e IDs permitidos. A limpeza remove essas seis chaves e preserva dados não relacionados. Não foram acrescentados login, nome, matrícula, e-mail, banco, integração hospitalar, protocolos internos ou analytics. Os novos exercícios não introduzem doses ou ajustes de tratamento. Os PDFs existentes preservam seus quadros e textos, sujeitos à revisão técnica integral, sem afirmar que todos os seus valores/recomendações foram clinicamente aprovados.

## Qualidade técnica e testes

- **91 testes em 19 arquivos**, testes do service worker e build aprovados. A instalação pelo lockfile já havia sido validada na Fase 1; não foram acrescentadas dependências nesta implementação.
- **20 grupos de navegador aprovados**, 82 destinos únicos, 32 conteúdos em diálogo, 15 desenhos e 16 aberturas do box pela cena/lista. Sem falhas, exceções JavaScript, avisos, violações CSP ou requisições externas automáticas nos percursos registrados. As requisições observadas foram GET de recursos.
- **69 verificações de layout** em 320, 390 e 1440 px; inspeção das capturas. **151 amostras** de contraste com mínimo **4,92:1**; controles novos e do quiz/livro amostrados em 16 px. Isso não declara conformidade WCAG integral.
- Troca/restauração de perfil, acesso comum aos módulos, dois checklists, favoritos, reinício/limpeza, armazenamento corrompido/bloqueado, exercício e avaliação sem persistência de texto, exportação mínima, escalas por finalidade, foco/teclado e busca offline conferidos.
- As consultas `npm audit` completa e de produção retornaram **zero alertas** no banco consultado. Sem certificação integral de segurança ou varredura antivírus completa.
- Cabeçalhos em `_headers` incluem `nosniff`, política de referência/permissões e CSP compatível nas entradas HTML. Foram aplicados por **simulação local**, com PDFs servidos como `application/pdf`. A configuração efetiva do Workers ainda precisa ser verificada.
- O framework foi separado em arquivo de cache próprio, preservando React/Vite e evitando um único bundle acima do limite de aviso. O cache de produção continua gerado a partir dos arquivos reais, com apostilas sob demanda.

Evidências, matriz dos 14 critérios, logs, capturas e integridade estão em [entrega-final](entrega-final/README.md). Cache/tamanho/SHA do ZIP e preservação dos 105 arquivos de materiais/livro estão em [pacote.json](entrega-final/evidencias/pacote.json).

O pacote final contém **119 arquivos**, **70.183.448 bytes**, CRC válido e conteúdo idêntico a `dist/`. Cache: **`cti-24151e273c6b`**; SHA-256: `ce5f1833e8c2282979b96bfeb3f0b4e09e549f1e06b0f16fa060ecf4476a9c6a`. O script `python3 scripts/package-review.py` reproduz o empacotamento e a comparação dos 105 arquivos preservados.

## Pendências externas e limites

1. Designar responsáveis, concluir revisão profissional do conteúdo/referências/instrumentos, avaliar as divergências documentadas e contextualizar o checklist de integração. Datas clínicas permanecem vazias enquanto isso não ocorrer.
2. Confirmar participantes/orientadores, créditos e direitos de divulgação pública dos documentos. Não foi feita nova auditoria manual integral de todas as páginas dos PDFs para assegurar ausência de qualquer dado identificável; os novos cenários e campos usam somente dados fictícios.
3. Autorizar e disponibilizar ambiente separado de homologação na Cloudflare. Não há credenciais ou implantação de homologação demonstrada neste ambiente. Verificar HTTPS, MIME, cabeçalhos e cache reais com a TI.
4. Testar iPhone/Safari, Android/Chrome, instalação/WhatsApp, PDFs, toque, VoiceOver/TalkBack/NVDA e zoom real em aparelhos/navegadores apropriados. A automação foi Chromium em Linux; não substitui esses ensaios.
5. Registrar aceite da homologação e autorização de publicação. Somente então atualizar o mesmo projeto, com cópia anterior para retorno e sem alterar seu endereço/QR Code.

Nenhuma dessas pendências foi preenchida com nomes, autorizações, protocolos ou resultados inventados. A entrega está pronta para demonstração técnica e revisão; implantação institucional aprovada é uma decisão posterior dos responsáveis.
