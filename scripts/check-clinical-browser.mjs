import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = resolve(process.env.CTI_REPO || fileURLToPath(new URL('..', import.meta.url)));
const playwright = await import(process.env.CTI_PLAYWRIGHT_PATH || 'playwright');
const { createServer } = await import(pathToFileURL(resolve(repo, 'node_modules/vite/dist/node/index.js')).href);
const port = process.env.CTI_BROWSER_PORT || '4243';
const origin = `http://127.0.0.1:${port}`;
const expectedCache = process.env.CTI_EXPECTED_CACHE;
assert.ok(expectedCache, 'Informe CTI_EXPECTED_CACHE para conferir o build congelado.');
const output = {
  phase: 'clinical-dictionary', cache: expectedCache,
  checks: [], failures: [], routes: [], layouts: [], errors: [], consoleErrors: [], externalRequests: [], screenshots: [],
  limits: [
    'Chromium automatizado em Linux. iPhone, Android e Safari físicos, VoiceOver, TalkBack e NVDA não foram executados.',
    'Servidor HTTP local com simulação de dist/_headers. Homologação e produção no Cloudflare não foram publicadas nem testadas.',
    'Os testes verificam comportamento de software, integridade dos conteúdos e sinalização de revisão; não conferem aprovação clínica nem conformidade integral com WCAG.',
  ],
};
let browser, context, page, server, vite;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const plain = value => value.replace(/\s+/g, ' ').trim();
const primary = () => page.locator('.clinical-dictionary');
const entry = () => page.locator('.clinical-entry');
const search = () => primary().getByRole('searchbox', { name: 'Pesquisar patologias e condições', exact: true });
const featuredSearch = () => page.getByRole('searchbox', { name: 'Busque diretamente no Dicionário Clínico', exact: true });
const listingCards = () => page.locator('.clinical-all-conditions .clinical-condition-card');

async function check(name, action) {
  console.log('CHECK', name);
  try {
    output.checks.push({ name, ...await action() });
    console.log('PASS', name);
  } catch (error) {
    output.failures.push({ name, message: error.message, stack: error.stack });
    console.error('FAIL', name, error.stack);
    await page?.screenshot({ path: `/tmp/cti-clinical-failure-${output.failures.length}.png` }).catch(() => {});
  }
}
async function go(route, targetPage = page) {
  if (await targetPage.locator('dialog[open]').count()) await targetPage.keyboard.press('Escape');
  await targetPage.evaluate(hash => { location.hash = hash; }, route);
  await targetPage.waitForFunction(hash => location.hash === `#${hash}`, route);
  await delay(100);
  output.routes.push(route);
}
async function expandAll(target = entry()) {
  await target.locator('details').evaluateAll(elements => elements.forEach(element => { element.open = true; }));
}
async function noOverflow(route, width) {
  const actual = await page.evaluate(() => ({ root: document.documentElement.scrollWidth, body: document.body.scrollWidth, viewport: innerWidth }));
  output.layouts.push({ route, width, ...actual });
  assert.ok(actual.root <= width + 1 && actual.body <= width + 1, `Rolagem horizontal ${route} em ${width}px: ${JSON.stringify(actual)}`);
}
async function screenshot(route, path, width = 390, fullPage = false) {
  await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
  await go(route);
  await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });
  await page.screenshot({ path, fullPage });
  output.screenshots.push({ path, route, width });
}

try {
  assert.ok((await readFile(resolve(repo, 'dist/sw.js'), 'utf8')).includes(expectedCache));
  vite = await createServer({ root: repo, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  const { clinicalConditions: conditions, clinicalCategories: categories, clinicalResourceLinks, assertClinicalConditions } = await vite.ssrLoadModule('/src/clinical-dictionary.ts');
  assertClinicalConditions();
  assert.equal(conditions.length, 30);
  await vite.close(); vite = null;
  server = spawn(process.env.CTI_PYTHON || 'python3', [resolve(repo, 'scripts/serve-review.py'), '--port', port, '--directory', resolve(repo, 'dist')], { stdio: 'ignore' });
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    try { if ((await fetch(origin)).ok) { ready = true; break; } } catch {}
    await delay(100);
  }
  assert.ok(ready, `Servidor local indisponível em ${port}`);
  browser = await playwright.chromium.launch({ headless: true, args: ['--no-sandbox'], ...(process.env.CTI_CHROMIUM_PATH ? { executablePath: process.env.CTI_CHROMIUM_PATH } : {}) });
  context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  context.setDefaultTimeout(10000);
  await context.addInitScript(() => {
    window.__clinicalCsp = [];
    document.addEventListener('securitypolicyviolation', event => window.__clinicalCsp.push({ directive: event.effectiveDirective, blocked: event.blockedURI }));
  });
  context.on('request', request => { if (!request.url().startsWith(origin) && !request.url().startsWith('data:') && !request.url().startsWith('blob:')) output.externalRequests.push(request.url()); });
  page = await context.newPage();
  page.on('pageerror', error => output.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') output.consoleErrors.push(message.text()); });
  await page.goto(origin);
  await page.locator('.clinical-featured').waitFor();

  await check('Destaque no topo, acesso direto pelo menu e pesquisa própria sem substituir a busca geral', async () => {
    await go('inicio');
    const card = page.locator('.clinical-featured');
    assert.equal(await card.count(), 1);
    assert.match(await card.textContent(), /30.*patologias|30.*fichas/s);
    assert.equal(await card.locator('h2').evaluate(element => element === document.activeElement), true);
    await page.keyboard.press('Tab');
    assert.equal(await card.locator('h2 a').evaluate(element => element === document.activeElement), true);
    await page.keyboard.press('Tab');
    assert.equal(await featuredSearch().evaluate(element => element === document.activeElement), true);
    const positions = await page.evaluate(() => ({ featured: document.querySelector('.clinical-featured').getBoundingClientRect().top, common: document.querySelector('.module-card').getBoundingClientRect().top }));
    assert.ok(positions.featured < positions.common);
    assert.equal(await page.getByRole('searchbox', { name: 'Pesquisar pelo nome ou assunto', exact: true }).count(), 1);
    const mobile = page.getByRole('navigation', { name: 'Navegação móvel', exact: true }).locator('a[href="#dicionario-clinico"]');
    assert.equal(await mobile.count(), 1);
    assert.equal(await mobile.isVisible(), true);
    await mobile.click(); await primary().waitFor();
    assert.equal(await listingCards().count(), 30);
    await page.setViewportSize({ width: 1440, height: 1000 });
    const desktop = page.getByRole('navigation', { name: 'Navegação principal', exact: true }).locator('a[href="#dicionario-clinico"]');
    assert.equal(await desktop.isVisible(), true);
    assert.equal(await desktop.getAttribute('aria-current'), 'page');
    await page.setViewportSize({ width: 390, height: 844 });
    return { featuredBeforeCommonCards: true, homeSearchPreserved: true, homeFocusAndTabOrder: true, mobileAndDesktopOneTouch: true };
  });

  await check('Pesquisa na página inicial aceita siglas, nomes, acentos e ausência de resultados', async () => {
    const queries = [['IAM', 'iam'], ['sepse', 'sepse'], ['IRpA', 'insuficiencia-respiratoria-aguda'], ['lesao renal', 'lesao-renal-aguda']];
    for (const [query, id] of queries) {
      await go('inicio'); await featuredSearch().fill(query);
      assert.ok(await page.locator(`.clinical-featured-results a[href="#dicionario-clinico/${id}"]`).count() === 1);
      assert.match(await page.locator('.clinical-featured-status').textContent(), /ficha/);
    }
    await featuredSearch().fill('nenhuma-condicao-123456');
    assert.match(await page.locator('.clinical-featured-results').textContent(), /Nenhuma ficha encontrada/);
    await page.getByRole('button', { name: 'Limpar pesquisa rápida do dicionário', exact: true }).click();
    assert.equal(await featuredSearch().inputValue(), '');
    assert.equal(await featuredSearch().evaluate(element => element === document.activeElement), true);
    await featuredSearch().fill('insuficiência cardíaca'); await featuredSearch().press('Enter');
    await primary().waitFor();
    assert.equal(await search().inputValue(), 'insuficiência cardíaca');
    assert.equal(await page.locator('.clinical-all-conditions a[href="#dicionario-clinico/insuficiencia-cardiaca"]').count(), 1);
    assert.equal(new URL(page.url()).hash, '#dicionario-clinico?q=insufici%C3%AAncia%20card%C3%ADaca');
    return { queries: queries.map(([query]) => query), queryCarriedToDictionary: true, noResultsAndClear: true };
  });

  await check('Pesquisa completa por nomes, siglas e sinônimos, sete filtros e lista alfabética', async () => {
    await go('dicionario-clinico');
    assert.deepEqual(await listingCards().locator('h3').allTextContents(), conditions.map(item => item.name));
    for (const condition of conditions) {
      await search().fill(condition.acronym || condition.name);
      assert.equal(await page.locator(`.clinical-all-conditions a[href="#dicionario-clinico/${condition.id}"]`).count(), 1);
      if (condition.synonyms.length) {
        await search().fill(condition.synonyms[0]);
        assert.equal(await page.locator(`.clinical-all-conditions a[href="#dicionario-clinico/${condition.id}"]`).count(), 1);
      }
    }
    await search().fill('');
    const select = primary().getByRole('combobox', { name: 'Categoria', exact: true });
    for (const category of categories) {
      await select.selectOption({ label: category });
      assert.equal(await listingCards().count(), conditions.filter(item => item.category === category).length);
    }
    await select.selectOption(''); await search().fill('condicao-impossivel-123');
    assert.equal(await listingCards().count(), 0);
    assert.match(await primary().textContent(), /Nenhuma ficha/);
    await primary().getByRole('button', { name: 'Limpar pesquisa do dicionário', exact: true }).click();
    assert.equal(await listingCards().count(), 30);
    return { conditions: 30, nameAcronymAndSynonyms: true, categories: categories.length, alphabetical: true };
  });

  await check('Todas as 30 fichas preservam resumo, cuidados prioritários, alertas, seções completas e referências', async () => {
    const requiredFolds = ['Identificação e termos de pesquisa', 'O que é?', 'O que acontece no organismo?', 'Causas e fatores associados', 'Sinais e sintomas', 'Como é diagnosticada?', 'Tratamento — visão geral', 'Exemplo clínico educativo'];
    let sources = 0, linkedResources = 0, related = 0;
    for (const condition of conditions) {
      await go(`dicionario-clinico/${condition.id}`); await entry().waitFor();
      assert.equal(await entry().getByRole('heading', { name: condition.name, exact: true }).count(), 1);
      assert.equal(await entry().getByRole('heading', { name: condition.name, exact: true }).evaluate(element => element === document.activeElement), true, `Foco da ficha ${condition.id}`);
      assert.equal(plain(await entry().locator('.clinical-summary p').textContent()), plain(condition.quickSummary));
      assert.match(await entry().locator('.clinical-validation').textContent(), /Pendente de validação clínica/);
      assert.match(await entry().locator('.clinical-validation').textContent(), /Última revisão clínica: não realizada/);
      assert.equal(await entry().locator('textarea,input[type="email"],input[type="password"],iframe,object,embed').count(), 0);
      for (const label of requiredFolds) assert.equal(await entry().locator('.clinical-full-entry summary').filter({ hasText: new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }).count(), 1, `${condition.id}: ${label}`);
      await expandAll();
      const contents = plain(await entry().innerText());
      const complete = [condition.definition, condition.pathophysiology, ...condition.causes, ...condition.manifestations, ...condition.diagnosis, ...condition.treatmentOverview, ...condition.nursingTechnicianCare, ...condition.warningSigns, ...Object.values(condition.clinicalCase)];
      for (const expected of complete) assert.ok(contents.includes(plain(expected)), `Conteúdo ausente em ${condition.id}: ${expected}`);
      assert.equal(await entry().locator('.clinical-references > ul > li').count(), condition.references.length);
      for (const reference of condition.references) {
        const link = entry().locator('.clinical-references a').filter({ hasText: reference.title });
        assert.equal(await link.getAttribute('href'), reference.url);
        assert.equal(await link.getAttribute('target'), '_blank');
        assert.match(await link.getAttribute('rel'), /noopener/);
      }
      const resources = clinicalResourceLinks(condition);
      assert.deepEqual(await entry().locator('.clinical-resource-list a').evaluateAll(elements => elements.map(element => element.getAttribute('href'))), resources.map(resource => resource.href));
      assert.deepEqual(await entry().locator('.clinical-related-list a').evaluateAll(elements => elements.map(element => element.getAttribute('href'))), condition.relatedConditionIds.map(id => `#dicionario-clinico/${id}`));
      sources += condition.references.length; linkedResources += resources.length; related += condition.relatedConditionIds.length;
    }
    return { completeConditions: conditions.length, expandableSectionsEach: requiredFolds.length, sourceLinks: sources, internalResourceLinks: linkedResources, relatedConditionLinks: related, patientInputs: 0, allPending: true };
  });

  await check('Vínculos bidirecionais com equipamentos, rotinas, escalas, registros, siglário e casos', async () => {
    const representative = ['#equipamentos/canula-nasal-de-alto-fluxo', '#equipamentos/ventilador-mecanico', '#rotinas/balanco-hidrico-e-dispositivos', '#escalas/rass', '#registros', '#glossario', '#quiz'];
    for (const href of representative) {
      const matching = conditions.filter(item => clinicalResourceLinks(item).some(resource => resource.href === href));
      assert.ok(matching.length, `Sem vínculo de exemplo para ${href}`);
      await go(href.slice(1));
      const dialog = page.locator('dialog[open]');
      const scope = await dialog.count() ? dialog : page.locator('main');
      const relatedLinks = scope.locator('.clinical-context-links');
      assert.ok(await relatedLinks.count() > 0, `Retorno ao dicionário ausente: ${href}`);
      const expectedHref = `#dicionario-clinico/${matching[0].id}`;
      const hidden = relatedLinks.locator(`a[href="${expectedHref}"]`);
      if (!await hidden.count()) {
        const more = relatedLinks.getByRole('button');
        if (await more.count()) await more.first().click();
      }
      await relatedLinks.locator(`a[href="${expectedHref}"]`).first().click();
      await entry().waitFor();
      assert.equal(new URL(page.url()).hash, expectedHref);
    }
    return { destinationFamilies: representative.length, routes: representative };
  });

  await check('Favoritos persistem sem cadastro e convivem com favoritos anteriores', async () => {
    await go('dicionario-clinico/iam');
    const favorite = entry().getByRole('button', { name: /^Adicionar aos favoritos:/ });
    await favorite.click();
    assert.equal(await entry().getByRole('button', { name: /^Remover dos favoritos:/ }).getAttribute('aria-pressed'), 'true');
    await page.reload(); await entry().waitFor();
    assert.equal(await entry().getByRole('button', { name: /^Remover dos favoritos:/ }).getAttribute('aria-pressed'), 'true');
    await go('favoritos');
    assert.equal(await page.locator('.favorites-list a[href="#dicionario-clinico/iam"]').count(), 1);
    const stored = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
    assert.ok(JSON.parse(stored.local['cti-favorites-v1']).includes('clinical.iam'));
    assert.deepEqual(Object.keys(stored.session), []);
    assert.ok(Object.keys(stored.local).every(key => ['cti-visited', 'cti-first-day-v1', 'cti-favorites-v1', 'cti-book-page-v1', 'cti-learning-profile-v1', 'cti-integration-v1'].includes(key)));
    return { persistentFavorite: 'clinical.iam', noNewStorageKeys: true, noLogin: true };
  });

  await check('Compartilhamento copia o link público e oferece alternativa quando a área de transferência falha', async () => {
    await go('dicionario-clinico/sepse');
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.__clinicalCopied = value; } } }));
    await entry().getByRole('button', { name: 'Copiar link da ficha', exact: true }).click();
    assert.equal(await page.evaluate(() => window.__clinicalCopied), `${origin}/#dicionario-clinico/sepse`);
    assert.match(await entry().locator('.clinical-copy-status').textContent(), /copiado/);
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Clipboard bloqueado para teste'); } } }));
    await entry().getByRole('button', { name: 'Copiar link da ficha', exact: true }).click();
    const field = entry().getByRole('textbox', { name: 'Link para copiar', exact: true });
    assert.equal(await field.inputValue(), `${origin}/#dicionario-clinico/sepse`);
    assert.equal(await field.evaluate(element => element === document.activeElement), true);
    assert.equal(await field.getAttribute('readonly'), '');
    return { clipboardSuccessAndFallback: true, personalDataInUrl: false };
  });

  await check('Teclado abre seções nativas e navega links com identificação acessível', async () => {
    await go('dicionario-clinico/iam');
    const summary = entry().locator('.clinical-full-entry details').filter({ has: page.locator('summary', { hasText: 'O que acontece no organismo?' }) }).locator('summary').first();
    await summary.focus(); await page.keyboard.press('Enter');
    assert.equal(await summary.evaluate(element => element.parentElement.open), true);
    await page.keyboard.press('Enter'); assert.equal(await summary.evaluate(element => element.parentElement.open), false);
    const quick = entry().locator('.clinical-quick-review > summary');
    await quick.focus(); await page.keyboard.press('Space');
    assert.equal(await quick.evaluate(element => element.parentElement.open), true);
    const link = entry().locator('.clinical-related-list a').first();
    const expected = await link.getAttribute('href');
    await link.focus(); await page.keyboard.press('Enter'); await entry().waitFor();
    assert.equal(new URL(page.url()).hash, expected);
    return { nativeDetailsKeyboard: true, relatedLinkEnter: true };
  });

  await check('Amostras de contraste e controles principais mantêm leitura e alvos de toque acessíveis', async () => {
    await go('dicionario-clinico/iam'); await expandAll();
    const samples = await entry().locator('.clinical-category-label,.clinical-summary p,.clinical-care li,.clinical-alerts li,.clinical-validation strong,.clinical-references a,.clinical-secondary').evaluateAll(elements => elements.filter(element => element.checkVisibility()).map(element => {
      let ancestor = element;
      let background = 'rgb(255, 255, 255)';
      while (ancestor) {
        const style = getComputedStyle(ancestor);
        if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') { background = style.backgroundColor; break; }
        ancestor = ancestor.parentElement;
      }
      return { text: element.textContent.trim().slice(0, 100), color: getComputedStyle(element).color, background };
    }));
    const luminance = value => value.slice(0, 3).map(component => { component /= 255; return component <= .04045 ? component / 12.92 : ((component + .055) / 1.055) ** 2.4; }).reduce((sum, component, index) => sum + component * [.2126, .7152, .0722][index], 0);
    for (const sample of samples) {
      const colors = [sample.color, sample.background].map(value => luminance(value.match(/[\d.]+/g).map(Number))).sort((a, b) => b - a);
      sample.ratio = (colors[0] + .05) / (colors[1] + .05);
      assert.ok(sample.ratio >= 4.5, `Contraste insuficiente: ${JSON.stringify(sample)}`);
    }
    assert.ok(samples.length >= 10);
    const controls = await entry().locator('.clinical-entry-actions button,.clinical-fold > summary').evaluateAll(elements => elements.filter(element => element.checkVisibility()).map(element => ({ label: element.textContent.trim().slice(0, 80), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height })));
    for (const control of controls) assert.ok(control.width >= 44 && control.height >= 44, `Alvo menor que44px: ${JSON.stringify(control)}`);
    output.contrastSamples = samples;
    output.touchTargets = controls;
    return { textSamples: samples.length, minimumContrast: Math.min(...samples.map(sample => sample.ratio)), minimumTargetPixels: 44, measuredControls: controls.length };
  });

  await check('Ficha desconhecida oferece recuperação sem exceção e sem dados clínicos inventados', async () => {
    await go('dicionario-clinico/ficha-nao-cadastrada');
    assert.equal(await primary().getByRole('heading', { name: 'Ficha não encontrada', exact: true }).count(), 1);
    await primary().getByRole('link', { name: 'Voltar à pesquisa', exact: true }).click();
    await search().waitFor(); assert.equal(await listingCards().count(), 30);
    return { unknownRouteRecovery: true };
  });

  await check('Listas, pesquisa e todas as fichas se adaptam a 320,390,768 e1440pixels sem rolagem horizontal', async () => {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
      for (const route of ['inicio', 'dicionario-clinico', ...conditions.map(item => `dicionario-clinico/${item.id}`)]) {
        await go(route); await noOverflow(route, width);
      }
    }
    return { widths: [320, 390, 768, 1440], checkedLayouts: output.layouts.length };
  });

  await check('Sem armazenamento disponível, favoritos continuam na sessão com aviso compreensível', async () => {
    const blocked = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await blocked.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Bloqueado para teste', 'SecurityError'); } });
    });
    const blockedPage = await blocked.newPage();
    const errors = []; blockedPage.on('pageerror', error => errors.push(error.message));
    await blockedPage.goto(`${origin}/#dicionario-clinico/iam`);
    const blockedEntry = blockedPage.locator('.clinical-entry'); await blockedEntry.waitFor();
    await blockedEntry.getByRole('button', { name: /^Adicionar aos favoritos:/ }).click();
    assert.equal(await blockedEntry.getByRole('button', { name: /^Remover dos favoritos:/ }).getAttribute('aria-pressed'), 'true');
    assert.match(await blockedEntry.locator('.learning-storage-note').textContent(), /sessão/);
    assert.deepEqual(errors, []);
    await blocked.close();
    return { storageBlockedHandled: true, inSessionFavorite: true };
  });

  await screenshot('inicio', '/tmp/cti-clinical-home-mobile.png');
  await screenshot('dicionario-clinico/insuficiencia-respiratoria-aguda', '/tmp/cti-clinical-entry-mobile.png');
  await screenshot('dicionario-clinico', '/tmp/cti-clinical-index-desktop.png', 1440);
  await screenshot('dicionario-clinico/sepse', '/tmp/cti-clinical-entry-desktop.png', 1440);

  await check('Textos e fichas funcionam offline após primeiro carregamento completo com o cache existente', async () => {
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), { timeout: 30000 });
    const cacheKeys = await page.evaluate(() => caches.keys());
    assert.ok(cacheKeys.includes(expectedCache));
    await context.setOffline(true);
    const offlinePage = await context.newPage();
    offlinePage.on('pageerror', error => output.errors.push(error.message));
    await offlinePage.goto(`${origin}/#dicionario-clinico/meningite`);
    await offlinePage.locator('.clinical-entry').waitFor();
    assert.match(await offlinePage.locator('.clinical-entry').textContent(), /Meningite/i);
    await go('dicionario-clinico', offlinePage);
    const offlineSearch = offlinePage.getByRole('searchbox', { name: 'Pesquisar patologias e condições', exact: true });
    await offlineSearch.fill('IAM');
    assert.equal(await offlinePage.locator('.clinical-all-conditions a[href="#dicionario-clinico/iam"]').count(), 1);
    await offlinePage.reload(); await offlineSearch.waitFor();
    assert.equal(await offlinePage.locator('.clinical-all-conditions .clinical-condition-card').count(), 30);
    await offlinePage.close(); await context.setOffline(false);
    return { existingCache: expectedCache, freshTabOffline: true, localSearchOffline: true, offlineReload: true };
  });

  await check('Nenhum erro de execução,CSP ou serviço externo durante a consulta educativa', async () => {
    output.cspViolations = await page.evaluate(() => window.__clinicalCsp);
    assert.deepEqual(output.errors, []);
    assert.deepEqual(output.consoleErrors, []);
    assert.deepEqual(output.externalRequests, []);
    assert.deepEqual(output.cspViolations, []);
    return { runtimeErrors: 0, consoleErrors: 0, externalRequests: 0, cspViolations: 0 };
  });
} catch (error) {
  output.failures.push({ name: 'Inicialização', message: error.message, stack: error.stack });
  console.error(error.stack);
} finally {
  if (vite) await vite.close();
  if (context) await context.close();
  if (browser) await browser.close();
  server?.kill('SIGTERM');
  await writeFile(process.env.CTI_BROWSER_OUTPUT || '/tmp/cti-clinical-browser.json', JSON.stringify(output, null, 2) + '\n');
  console.log(JSON.stringify({ passed: output.checks.length, failed: output.failures.length, layouts: output.layouts.length, routes: output.routes.length, errors: output.errors.length }));
  if (output.failures.length) process.exitCode = 1;
}
