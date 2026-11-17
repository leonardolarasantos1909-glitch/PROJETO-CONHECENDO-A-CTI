# CTI Conecta

Conectando conhecimento ao cuidado intensivo. Aprender, acolher e cuidar.

## Origem e limites

Implementação no repositório `leonardolarasantos1909-glitch/PROJETO-CONHECENDO-A-CTI`, confirmado como destino pelo usuário. A base disponível foi `b910fae`. O repositório `santoslaraleonardo79-cmyk/Conhecendo-a-CTI` retornou “Repository not found”; o commit `d7a60e6` não foi recuperado. Não se trata de cópia completa dessa versão inacessível.

Foram preservados o conteúdo educativo, as fontes e seus estados de revisão, os 746 termos do siglário, os casos, as questões, as quatro escalas desenvolvidas, a introdução a Glasgow, o livro de 96 páginas e os sete PDFs da base disponível. Os PDFs permanecem byte a byte originais. Sua apresentação interna pode manter títulos anteriores; não foi atribuída nova validação clínica. Referências a hospitais mantêm a ressalva de ausência de vínculo/validação oficial.

## Desenvolvimento

Node 24 e npm. Instale com `npm ci`. Use:

```sh
npm run dev
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run deploy:check
```

Os assets auxiliares de PDF.js são copiados de `node_modules` para a pasta ignorada `public/pdfjs` antes de desenvolvimento/build. Fontes Inter/Poppins e worker PDF são hospedados localmente. As licenças das bibliotecas e fontes ficam nos respectivos pacotes; créditos e fontes dos materiais foram preservados.

Para os testes de navegador, instale `npx playwright install chromium`. No ambiente atual o download foi bloqueado pela política de rede; use o Chromium já instalado:

```sh
PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

O Playwright inicia a versão de produção na porta 4175. Execute o build antes dos testes. O perfil móvel em Chromium é emulação de viewport/toque, não um teste em Safari nem um aparelho físico.

## Funcionalidades

- Entrada direta, sem seleção de perfil; somente a chave legada `cti-profile` é removida automaticamente.
- React Router com URLs por fragmento e preservação dos atalhos antigos. Caminhos como `/clinica` são convertidos para `/#clinica`; Workers oferece fallback estático SPA.
- Navegação inferior com cinco destinos; demais recursos pelo menu superior, índice e atalhos.
- Identidade vermelha #b63346/#98253b, ECG conectado, fontes locais e recursos carregados sob demanda.
- Índice de enciclopédia pesquisável derivado dos temas reais disponíveis. Introduções e fontes de consulta continuam identificadas como pendentes de revisão, sem fichas inventadas.
- Calculadora em diálogo, com validação, vírgula decimal, operações, porcentagem, PAM estimada, balanço, diurese, conversões e gotejamento; valores são descartados ao fechar.
- RCP: deslocamento, chegada, compressões/pausas, registros manuais de ciclos, choques e medicamentos, contagem por rótulo, aviso sonoro configurável, relatório TXT e histórico local de até 30 sessões encerradas. Nova sessão não remove histórico. A sessão em andamento é mantida em memória ao trocar de página; recarregar/fechar a aba descarta a sessão não encerrada. Nenhum nome de paciente é solicitado.
- Leitor PDF.js interno com navegação, gesto lateral a 100%, zoom, busca por páginas e download. A navegação geral é ocultada. O texto renderizado em canvas tem como alternativa o download para leitores de PDF acessíveis; não há camada de texto selecionável no canvas.
- Checklist de primeiro dia existente e checklist organizacional de integração, favoritos e visitas mantidos nas chaves existentes, tolerando armazenamento bloqueado.
- QR Code calculado localmente para a origem real da publicação, sem usar o QR da conta antiga. Orientações de instalação uma vez por navegador, com acesso permanente no rodapé.

O CTI virtual é um índice navegável dos módulos reais, não uma simulação tridimensional. O RCP registra eventos, não prescreve doses nem condutas. Não há atalho por ampola sem apresentações institucionais confirmadas. O temporizador depende da execução do navegador e pode ser suspenso em segundo plano.

## Pendências de conteúdo

- Tabela institucional de diluição: fornecer arquivo original com apresentações, unidades, observações, fonte e responsável pela revisão. A página existe sem dados inferidos.
- Conteúdos adicionais da versão inacessível, fichas clínicas desenvolvidas, sinônimos específicos e eventual formulário completo de Glasgow precisam ser fornecidos. As quatro escalas já desenvolvidas foram preservadas sem resumi-las.
- Revisão clínica e institucional do acervo continua pendente. Não há guia separado de medicamentos, gravação de passagem de plantão ou IA.
- Preferências e históricos não são transferidos entre domínios: o armazenamento pertence ao navegador e à origem. Não registrar dados identificáveis em rótulos de eventos.

## Publicação

Consulte [Deploy no Cloudflare](DEPLOY-CLOUDFLARE.md). Envio ao GitHub e dry-run não comprovam publicação. A entrega só pode declarar publicação validada após sucesso no Cloudflare e conferência do novo endereço.

## Licenças de terceiros

O prebuild inclui em `dist/licenses/` os avisos das fontes, React/Router, Lucide, PDF.js e gerador de QR Code. Essa pasta é gerada a partir dos pacotes instalados; não contém licenças novas atribuídas aos materiais clínicos ou ao código preexistente.
