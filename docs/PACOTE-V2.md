# Registro do pacote v2

## Estado da investigação

O usuário relatou a mensagem do navegador “Vírus detectado” ao baixar o pacote anterior. A captura não informa o motor antivírus ou o nome da detecção. A causa continua desconhecida.

Pacote anterior: `conhecendo-a-cti-publicar.zip`, SHA-256 `f3ccc4248d282fbf4f8a6167ce16b7affa71c6d39800dc77f69ce8d77c550fce`.

Novo pacote de compatibilidade: `conhecendo-a-cti-v2.zip`, 2055084 bytes, SHA-256 `ce05422d4c4336e9d732419a2bf8851ec1071b30a2ffae15753295a1437041c4`.

**A versão v2 não tem certificação ou resultado de varredura antivírus. Antes de abrir ou usar em computador corporativo, solicite análise à TI. Não desative proteções, crie exclusões ou ignore alertas para baixar ou abrir o pacote.**

## O que mudou

- Dependências reinstaladas do cache com `npm ci --offline`, preservando a verificação de integridade do lockfile. Não foram desabilitadas verificações TLS, de artefatos ou de assinaturas.
- Aplicativo recompilado a partir do código do projeto; não houve ocultação de scripts, reofuscação ou renomeação de extensões para evitar detecção.
- PDFs regravados como cópias de compatibilidade, sem os anexos auxiliares Content Credentials/C2PA e suas referências. Isso retira o manifesto de proveniência e suas assinaturas das cópias; não demonstra que fossem maliciosos ou a causa do alerta. Os originais permanecem preservados separadamente.
- Todas as 120 páginas conferidas: texto, posições, dimensões, links, metadados de autoria e renderização a 72 dpi iguais. Leitura estrita e inspeção de objetos concluídas. [Resultados dos PDFs](compatibilidade-pdfs-v2.json).
- O ZIP anterior foi retirado da lista de downloads da versão atual. O histórico do Git conserva as versões anteriores.

## Verificações e limites

O novo ZIP foi comparado byte a byte com o build, verificado quanto a CRC, caminhos e presença dos arquivos. O build TypeScript/Vite e os testes automatizados passaram. O comportamento de abertura, download, pesquisa e cache offline é verificado no navegador local.

Não havia scanner antivírus instalado neste ambiente. A tentativa de acessar as assinaturas oficiais do ClamAV foi bloqueada pelo proxy de rede (HTTP 403). Nenhuma varredura antivírus foi executada e os arquivos não foram enviados a serviços de análise de terceiros. Não é possível afirmar falso positivo, ausência de malware ou resolução do alerta com estas verificações.

A TI pode usar os hashes deste relatório para identificar a amostra correta e realizar a análise com a solução de proteção da empresa. O nome completo da detecção e o motor responsável continuam necessários para o diagnóstico.
