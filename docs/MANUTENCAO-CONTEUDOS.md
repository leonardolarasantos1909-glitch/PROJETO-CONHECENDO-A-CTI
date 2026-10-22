# Manutenção dos conteúdos educativos

Atualizado em 22/10/2026. A aplicação preserva React/TypeScript/Vite, rotas por hash e os catálogos existentes. Não há CMS, área administrativa, banco ou integração hospitalar.

## Onde manter cada material

| Material | Fonte de manutenção |
| --- | --- |
| Módulos e assuntos | `src/content.ts`; IDs estáveis em `src/topic-identifiers.ts`. |
| Casos PBL e quiz | `src/cases.ts`, `src/content.ts`, `src/extra-questions.ts`; vínculo bibliográfico por questão em `src/question-references.ts`. |
| Siglário | Transcrição em `src/data/glossario-hospital.txt`; atualizações recebidas em `src/data/siglario-confirmacao.json`; parser/notas em `src/hospital-glossary.ts`. |
| Perfis e roteiros | `src/learning-profile.ts`, `src/starter-data.ts`, `src/integration-checklist.ts`. |
| Escalas | `src/scales.ts`; seletor por finalidade em `src/ScalePurposeGuide.tsx`. |
| Laboratório | `src/annotation-lab.ts`: fatos, lacunas, exemplo, comentários, rubrica e fontes. |
| Desenhos e box fictício | `src/equipment-diagrams.ts`, `src/EquipmentIllustration.tsx`, `src/virtual-cti.ts`. |
| PDFs e livro | `src/materials.ts`, `src/apostilas.ts`, `public/materiais/`, `public/caderno/`; scripts verificam integridade. |
| Avaliação e demonstração | `src/pbl-feedback.ts`, `src/guided-demo.ts`; instrumentos próprios de demonstração, sem validação formal. |
| Metadados comuns | `src/content-registry.ts`, adaptador dos catálogos acima, sem duplicar os textos clínicos. |

O catálogo usa `id`, `title`, `category`, `recommendedAudiences`, `description`, `href`, `references`, `referenceStatus`, `lastReviewedAt`, `reviewedBy`, `status`, `version`, `publicationScope`, `authorizationReference` e `notes`. Campos de revisão continuam `null` até haver registro real. As referências indicam origem; o status de vínculo bibliográfico distingue material fornecido de fonte específica ainda pendente.

`ContentReview` apresenta a situação nas telas e `#conteudos` permite pesquisar/filtrar o catálogo. O catálogo inclui os conteúdos originais, cada cenário do laboratório, os itens dos dois checklists, as estações do box e as ferramentas. As 32 questões preservam os textos existentes e recebem fontes na tela por seu mapa editorial; qualquer mudança de pergunta exige atualizar esse vínculo e executar os testes.

## Atualização com revisão

1. Defina o responsável e confirme que o material pode ser divulgado publicamente. Um PDF incluído no pacote é público mesmo se seu link for escondido.
2. Faça uma branch de revisão. Preserve IDs, rotas, textos e créditos; registre alterações clínicas propostas, versão e justificativa. Não troque uma definição do Siglário apenas por discordância automática com a transcrição confirmada pelo responsável.
3. Acrescente fontes verificáveis, edição/página e autorização quando aplicável. Uma lista geral de portais não valida cada afirmação. Não use data de commit/build como revisão clínica.
4. Mantenha `pending_review` enquanto a revisão não estiver concluída. `educational_reviewed` requer responsável, data e referências. `institutional_validated` exige também registro da autorização institucional; a aplicação não confirma a autenticidade de um documento só porque seu campo foi preenchido. A equipe deve conferir a evidência real.
5. Material `restricted` é rejeitado pelo validador público. Não inclua conteúdo protegido esperando que o seletor de perfil funcione como autorização.
6. Execute `npm test` e `npm run build`. O build executa o catálogo real, verifica classificação, metadados, vínculos locais e arquivos de referência; falha para material restrito ou rótulo de validação sem evidências mínimas. Isso não faz revisão clínica automatizada.
7. Confira a versão em homologação autorizada e obtenha aceite antes da atualização do projeto de produção. Preserve o endereço/QR e a versão anterior para retorno.

Para trocar o PDF-base do livro, regenere as páginas com `scripts/preparar-caderno.py` e confira o manifesto/SHA. Alterações nas apostilas exigem regenerar e conferir seu relatório de integridade. Não regenere documentos nesta entrega: os sete PDFs e as 96 páginas foram preservados.

## Armazenamento

Somente seis chaves de `localStorage` são utilizadas para preferências de aprendizagem:

| Chave | Conteúdo permitido |
| --- | --- |
| `cti-visited` | IDs de módulos visitados. |
| `cti-first-day-v1` | IDs marcados do primeiro dia. |
| `cti-favorites-v1` | IDs de conteúdos favoritados. |
| `cti-book-page-v1` | Número válido da página do caderno. |
| `cti-learning-profile-v1` | `estagiario` ou `colaborador`. |
| `cti-integration-v1` | IDs marcados do roteiro de integração. |

Leituras validam valores e ignoram dados desconhecidos. A limpeza remove somente essas chaves; não chama `localStorage.clear()`. O cache de arquivos do service worker é separado e não contém respostas dos exercícios. O laboratório e o questionário ficam em memória; a demonstração conserva a etapa somente durante a execução da SPA. Recarregar encerra esse estado. Sem nome, matrícula, e-mail, autenticação, trilha de treinamento ou sincronização.
