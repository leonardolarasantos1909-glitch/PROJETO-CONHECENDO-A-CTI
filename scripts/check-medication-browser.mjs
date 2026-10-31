import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = resolve(process.env.CTI_REPO || fileURLToPath(new URL('..', import.meta.url)));
const playwright = await import(process.env.CTI_PLAYWRIGHT_PATH || 'playwright');
const { createServer } = await import(pathToFileURL(resolve(repo, 'node_modules/vite/dist/node/index.js')).href);
const port = process.env.CTI_BROWSER_PORT || '4245';
const origin = `http://127.0.0.1:${port}`;
const expectedCache = process.env.CTI_EXPECTED_CACHE;
assert.ok(expectedCache, 'Informe CTI_EXPECTED_CACHE para conferir o build congelado.');
const output = {
  phase: 'medication-guide', cache: expectedCache,
  checks: [], failures: [], routes: [], layouts: [], errors: [], consoleErrors: [], externalRequests: [], screenshots: [],
  limits: [
    'Chromium automatizado em Linux. Dispositivos físicos, Safari, VoiceOver, TalkBack e NVDA não foram executados.',
    'Servidor HTTP local com simulação de dist/_headers. Cloudflare de homologação e produção não foram publicados nem testados.',
    'Verificação de software e integridade editorial; não representa validação farmacológica, aprovação clínica ou conformidade integral com WCAG.',
    'Fontes clínicas externas permanecem sem conferência neste ambiente; o bloqueio de acesso HTTP 403 não é prova de validação das fichas.',
  ],
};
let browser, context, page, server, vite;
const delay = ms => new Promise(resolveDelay => setTimeout(resolveDelay, ms));
const plain = value => value.replace(/\s+/g, ' ').trim();
const primary = () => page.locator('.medication-guide');
const entry = () => page.locator('.medication-entry');
const search = () => primary().getByRole('searchbox', { name: 'Pesquisar medicamentos', exact: true });
const featuredSearch = () => page.getByRole('searchbox', { name: 'Busque diretamente no Guia de Medicamentos', exact: true });
const listingCards = () => page.locator('.medication-card-grid .medication-card');
const allowedStorageKeys = ['cti-visited', 'cti-first-day-v1', 'cti-favorites-v1', 'cti-book-page-v1', 'cti-learning-profile-v1', 'cti-integration-v1'];

async function check(name, action) {
  console.log('CHECK', name);
  try { output.checks.push({ name, ...await action() }); console.log('PASS', name); }
  catch (error) {
    output.failures.push({ name, message: error.message, stack: error.stack });
    console.error('FAIL', name, error.stack);
    await page?.screenshot({ path: `/tmp/cti-medication-failure-${output.failures.length}.png` }).catch(() => {});
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

function observeContext(target) {
  target.on('request', request => {
    if (!request.url().startsWith(origin) && !request.url().startsWith('data:') && !request.url().startsWith('blob:')) output.externalRequests.push(request.url());
  });
  target.on('page', targetPage => {
    targetPage.on('pageerror', error => output.errors.push(error.message));
    targetPage.on('console', message => { if (message.type() === 'error') output.consoleErrors.push(message.text()); });
  });
}
async function captureCsp(targetPage) {
  const violations = await targetPage.evaluate(() => window.__medicationCsp || []);
  output.cspViolations = [...(output.cspViolations || []), ...violations];
}

try {
  assert.ok((await readFile(resolve(repo, 'dist/sw.js'), 'utf8')).includes(expectedCache));
  vite = await createServer({ root: repo, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  const { medications, medicationCategories: categories, searchMedications, assertMedications, medicationCases, medicationCaseHref, getMedicationCases } = await vite.ssrLoadModule('/src/medication-guide.ts');
  const { clinicalConditions: conditions } = await vite.ssrLoadModule('/src/clinical-dictionary.ts');
  assertMedications();
  assert.equal(medications.length, 40);
  assert.equal(categories.length, 11);
  assert.equal(medicationCases.length, 5);
  await vite.close(); vite = null;
  server = spawn(process.env.CTI_PYTHON || 'python3', [resolve(repo, 'scripts/serve-review.py'), '--port', port, '--directory', resolve(repo, 'dist')], { stdio: 'ignore' });
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    try { if ((await fetch(origin)).ok) { ready = true; break; } } catch {}
    await delay(100);
  }
  assert.ok(ready, `Servidor local indisponível em ${port}`);
  browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.CTI_CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  context.setDefaultTimeout(10000);
  await context.addInitScript(() => {
    window.__medicationCsp = [];
    document.addEventListener('securitypolicyviolation', event => window.__medicationCsp.push({ directive: event.effectiveDirective, blocked: event.blockedURI }));
  });
  observeContext(context);
  page = await context.newPage();
  await page.goto(origin);
  await page.locator('.medication-featured').waitFor();

  await check('Destaque equivalente ao dicionário, busca geral preservada e acesso direto pelos menus', async () => {
    await go('inicio');
    const featured = page.locator('.medication-featured');
    assert.equal(await featured.count(), 1);
    assert.match(await featured.textContent(), /40.*medicamentos|40.*fichas/s);
    assert.equal(await page.getByRole('searchbox', { name: 'Pesquisar pelo nome ou assunto', exact: true }).count(), 1);
    await featured.locator('h2 a').focus(); await page.keyboard.press('Tab');
    assert.equal(await featuredSearch().evaluate(element => element === document.activeElement), true);
    const mobile = page.getByRole('navigation', { name: 'Navegação móvel', exact: true });
    assert.equal(await mobile.locator('a').count(), 7);
    const mobileGuide = mobile.getByRole('link', { name: 'Guia de Medicamentos', exact: true });
    assert.equal(await mobileGuide.getAttribute('href'), '#medicamentos');
    assert.equal(await mobileGuide.isVisible(), true);
    await mobileGuide.click(); await search().waitFor();
    assert.equal(await listingCards().count(), 40);
    assert.equal(await mobileGuide.getAttribute('aria-current'), 'page');
    await page.setViewportSize({ width: 1440, height: 1000 });
    const desktop = page.getByRole('navigation', { name: 'Navegação principal', exact: true }).getByRole('link', { name: 'Guia de Medicamentos', exact: true });
    assert.equal(await desktop.isVisible(), true);
    assert.equal(await desktop.getAttribute('aria-current'), 'page');
    await go('inicio');
    const prominence = await page.evaluate(() => {
      const medication = document.querySelector('.medication-featured');
      const clinical = document.querySelector('.clinical-featured');
      const common = document.querySelector('.module-card');
      const rect = element => { const { top, width, height } = element.getBoundingClientRect(); return { top, width, height }; };
      return { medication: rect(medication), clinical: rect(clinical), common: rect(common), headings: [medication, clinical].map(element => getComputedStyle(element.querySelector('h2')).fontSize) };
    });
    assert.ok(Math.abs(prominence.medication.width - prominence.clinical.width) <= 1);
    assert.ok(Math.abs(prominence.medication.height - prominence.clinical.height) <= 1);
    assert.ok(Math.abs(prominence.medication.top - prominence.clinical.top) <= 1);
    assert.deepEqual(prominence.headings, [prominence.headings[0], prominence.headings[0]]);
    assert.ok(prominence.medication.top < prominence.common.top && prominence.clinical.top < prominence.common.top);
    await page.setViewportSize({ width: 390, height: 844 });
    return { equalDesktopProminence: prominence, homeSearchPreserved: true, mobileNavigationLinks: 7, oneTouchMenus: true, quickSearchKeyboard: true };
  });

  await check('Pesquisa rápida local aceita nome, classe, alias, acentos e ausência de resultado', async () => {
    const aliasItem = medications.find(item => item.aliases.length);
    assert.ok(aliasItem);
    const samples = [
      ['noradrenalina', 'noradrenalina'],
      ['antiemetico', 'ondansetrona'],
      [aliasItem.aliases[0], aliasItem.id],
      ['vancomicina', 'vancomicina'],
    ];
    for (const [query, id] of samples) {
      await go('inicio'); await featuredSearch().fill(query);
      const expected = searchMedications(query).slice(0, 4).map(item => `#medicamentos/${item.id}`);
      assert.deepEqual(await page.locator('.medication-featured-results li a').evaluateAll(elements => elements.map(element => element.getAttribute('href'))), expected);
      assert.ok(expected.includes(`#medicamentos/${id}`), `Amostra de busca não representativa: ${query}`);
      assert.match(await page.locator('.medication-featured-status').textContent(), /ficha/);
    }
    await featuredSearch().fill('medicamento-inexistente-12345');
    assert.match(await page.locator('.medication-featured-results').textContent(), /Nenhuma ficha encontrada/);
    await page.getByRole('button', { name: 'Limpar pesquisa rápida de medicamentos', exact: true }).click();
    assert.equal(await featuredSearch().inputValue(), '');
    assert.equal(await featuredSearch().evaluate(element => element === document.activeElement), true);
    await featuredSearch().fill('sulfato de magnésio'); await featuredSearch().press('Enter');
    await search().waitFor();
    assert.equal(await search().inputValue(), 'sulfato de magnésio');
    assert.equal(new URL(page.url()).hash, '#medicamentos?q=sulfato%20de%20magn%C3%A9sio');
    assert.ok(await listingCards().count() > 0);
    return { sampleQueries: samples.map(([query]) => query), localResults: true, clearAndNoResults: true, queryCarriedToGuide: true };
  });

  await check('Quarenta nomes, classes e aliases, onze categorias, filtro MPP e ordem alfabética', async () => {
    await go('medicamentos');
    assert.deepEqual(await listingCards().locator('h3').allTextContents(), medications.map(item => item.genericName));
    let aliases = 0, classes = 0;
    for (const medication of medications) {
      const queries = [medication.genericName, medication.genericName.normalize('NFD').replace(/[\u0300-\u036f]/g, ''), medication.pharmacologicalClass, ...medication.aliases];
      for (const query of [...new Set(queries)]) {
        await search().fill(query);
        assert.equal(await page.locator(`.medication-card-grid a[href="#medicamentos/${medication.id}"]`).count(), 1, `Busca ausente: ${query}`);
        assert.deepEqual(await listingCards().locator('h3').allTextContents(), searchMedications(query).map(item => item.genericName));
      }
      aliases += medication.aliases.length; classes++;
    }
    await search().fill('');
    const select = primary().getByRole('combobox', { name: 'Categoria', exact: true });
    const mpp = primary().getByRole('checkbox', { name: 'Mostrar apenas medicamentos sinalizados como potencialmente perigosos (MPP)', exact: true });
    for (const category of categories) {
      await select.selectOption({ label: category });
      assert.deepEqual(await listingCards().locator('h3').allTextContents(), medications.filter(item => item.category === category).map(item => item.genericName));
      await mpp.check();
      assert.equal(await listingCards().count(), medications.filter(item => item.category === category && item.highAlert.flagged).length);
      await mpp.uncheck();
    }
    await select.selectOption(''); await mpp.check();
    const highAlertCount = medications.filter(item => item.highAlert.flagged).length;
    assert.ok(highAlertCount > 0 && highAlertCount < 40);
    assert.equal(await listingCards().count(), highAlertCount);
    assert.match(await primary().textContent(), /ausência de sinalização não significa ausência de risco/);
    await mpp.uncheck(); await search().fill('nenhuma-ficha-12345');
    assert.equal(await listingCards().count(), 0);
    assert.match(await primary().textContent(), /Nenhuma ficha encontrada/);
    await primary().getByRole('button', { name: 'Limpar pesquisa e filtros', exact: true }).click();
    assert.equal(await listingCards().count(), 40);
    assert.equal(await search().evaluate(element => element === document.activeElement), true);
    return { medications: 40, classes, aliases, categories: categories.length, highAlertCount, combinedCategoryAndMppFilters: true, alphabetical: true };
  });

  await check('Todas as fichas mostram conteúdo completo, vias contextualizadas, MPP e fontes pendentes sem marcas inventadas', async () => {
    const folds = ['Identificação, princípio ativo e nomes comerciais', 'Finalidade e mecanismo de ação', 'Usos no contexto da terapia intensiva', 'Apresentações e vias — contexto educativo', 'Efeitos adversos', 'Contraindicações, precauções e interações', 'Monitorização e registros'];
    let sources = 0, conditionLinks = 0, routes = 0;
    for (const medication of medications) {
      assert.equal(medication.clinicalReviewStatus, 'pending'); assert.equal(medication.reviewedAt, null);
      assert.deepEqual(medication.commercialNames, []);
      await go(`medicamentos/${medication.id}`); await entry().waitFor();
      const heading = entry().getByRole('heading', { name: medication.genericName, exact: true });
      assert.equal(await heading.count(), 1);
      assert.equal(await heading.evaluate(element => element === document.activeElement), true, `Foco: ${medication.id}`);
      assert.equal(plain(await entry().locator('.medication-summary p').textContent()), plain(medication.summary));
      assert.match(await entry().locator('.medication-validation').textContent(), /Pendente de validação clínica/);
      assert.match(await entry().locator('.medication-validation').textContent(), /Última revisão clínica: não realizada/);
      assert.equal(await entry().locator('textarea,input[type="email"],input[type="password"],iframe,object,embed').count(), 0);
      assert.deepEqual(await entry().locator('.medication-full-entry summary').allTextContents(), folds);
      await expandAll();
      const contents = plain(await entry().innerText());
      const complete = [medication.activeIngredient, medication.pharmacologicalClass, medication.purpose, medication.mechanism, medication.formulationsNote, medication.commercialNamesNote, medication.highAlert.scope, medication.highAlert.rationale, ...medication.intensiveCareUses, ...medication.adverseEffects, ...medication.contraindicationsPrecautions, ...medication.nursingCare, ...medication.monitoring, ...medication.warningSigns, ...medication.routes.flatMap(route => [route.name, route.context])];
      for (const expected of complete) assert.ok(contents.includes(plain(expected)), `Conteúdo ausente em ${medication.id}: ${expected}`);
      assert.ok(contents.includes('Nenhum nome comercial verificado disponível.'));
      assert.ok(contents.includes('Via estudada não equivale à via prescrita.'));
      assert.match(await entry().locator('.medication-risk-notice').textContent(), /Conferência da classificação: pendente/);
      assert.equal(await entry().locator('.medication-risk-notice.is-flagged').count(), medication.highAlert.flagged ? 1 : 0);
      assert.equal(await entry().locator('.medication-references > ol > li').count(), medication.references.length);
      assert.equal(await entry().locator('.medication-reference-pending').count(), medication.references.length);
      assert.equal(await entry().locator('.medication-reference-verified').count(), 0);
      for (const reference of medication.references) {
        assert.equal(reference.verification, 'pending'); assert.equal(reference.accessedAt, undefined);
        const link = entry().locator('.medication-references a').filter({ hasText: reference.title });
        assert.equal(await link.getAttribute('href'), reference.url);
        assert.equal(await link.getAttribute('target'), '_blank');
        assert.match(await link.getAttribute('rel'), /noopener/);
        assert.ok(contents.includes(plain(reference.note)));
      }
      assert.equal(await entry().locator('.medication-reference-portal').count(), medication.references.filter(reference => reference.scope === 'lookup_portal').length);
      assert.deepEqual(await entry().locator('.medication-related-list a[href^="#dicionario-clinico/"]').evaluateAll(elements => elements.map(element => element.getAttribute('href'))), medication.relatedConditionIds.map(id => `#dicionario-clinico/${id}`));
      assert.deepEqual(await entry().locator('.medication-related-list a[href^="#medicamentos/casos?"]').evaluateAll(elements => elements.map(element => element.getAttribute('href'))), getMedicationCases(medication.id).map(item => medicationCaseHref(item.id)));
      sources += medication.references.length; conditionLinks += medication.relatedConditionIds.length; routes += medication.routes.length;
    }
    return { completeProfiles: 40, sectionsEach: folds.length, sourceLinks: sources, conditionLinks, contextualizedRoutes: routes, allReviewAndSourcesPending: true, verifiedBrands: 0, patientInputs: 0 };
  });

  await check('Vínculos entre medicamentos e condições permitem ida e volta e expansão acessível', async () => {
    let reciprocal = 0, expanded = 0;
    for (const condition of conditions) {
      const matching = medications.filter(item => item.relatedConditionIds.includes(condition.id));
      if (!matching.length) continue;
      await go(`dicionario-clinico/${condition.id}`);
      const links = page.locator('.medication-context-links'); await links.waitFor();
      assert.match(await links.textContent(), /não indica automaticamente um medicamento/);
      if (matching.length > 6) {
        const more = links.getByRole('button', { name: /^Mostrar todos os/ });
        assert.equal(await more.getAttribute('aria-expanded'), 'false'); await more.click();
        assert.equal(await links.getByRole('button', { name: 'Mostrar menos medicamentos', exact: true }).getAttribute('aria-expanded'), 'true'); expanded++;
      }
      assert.deepEqual(await links.locator('li a').evaluateAll(elements => elements.map(element => element.getAttribute('href'))), matching.map(item => `#medicamentos/${item.id}`));
      const medication = matching[0];
      await links.locator(`a[href="#medicamentos/${medication.id}"]`).click(); await entry().waitFor();
      await entry().locator(`a[href="#dicionario-clinico/${condition.id}"]`).click();
      await page.locator('.clinical-entry').waitFor();
      assert.equal(new URL(page.url()).hash, `#dicionario-clinico/${condition.id}`);
      reciprocal += matching.length;
    }
    return { reciprocalLinks: reciprocal, expandableConditionGroups: expanded };
  });

  await check('Favoritos de fichas e módulo persistem e convivem com o dicionário sem novas chaves', async () => {
    await go('dicionario-clinico/iam');
    await page.locator('.clinical-entry').getByRole('button', { name: /^Adicionar aos favoritos:/ }).click();
    await go('medicamentos/noradrenalina');
    await entry().getByRole('button', { name: /^Adicionar aos favoritos:/ }).click();
    assert.equal(await entry().getByRole('button', { name: /^Remover dos favoritos:/ }).getAttribute('aria-pressed'), 'true');
    await go('medicamentos');
    await page.locator('.medication-module-favorite').getByRole('button', { name: /^Adicionar aos favoritos:/ }).click();
    await page.reload(); await search().waitFor();
    assert.equal(await page.locator('.medication-module-favorite').getByRole('button', { name: /^Remover dos favoritos:/ }).getAttribute('aria-pressed'), 'true');
    await go('medicamentos/noradrenalina');
    assert.equal(await entry().getByRole('button', { name: /^Remover dos favoritos:/ }).getAttribute('aria-pressed'), 'true');
    await go('favoritos');
    for (const href of ['#medicamentos/noradrenalina', '#medicamentos', '#dicionario-clinico/iam']) assert.equal(await page.locator(`.favorites-list a[href="${href}"]`).count(), 1);
    const stored = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
    const ids = JSON.parse(stored.local['cti-favorites-v1']);
    for (const id of ['clinical.iam', 'medication.noradrenalina', 'module.medicamentos']) assert.ok(ids.includes(id));
    assert.deepEqual(Object.keys(stored.session), []);
    assert.ok(Object.keys(stored.local).every(key => allowedStorageKeys.includes(key)));
    return { persistentMedicationAndModule: true, clinicalFavoritesPreserved: true, noNewStorageKeys: true, noLogin: true };
  });

  await check('Compartilhamento copia URL pública e mantém alternativa acessível quando clipboard falha', async () => {
    await go('medicamentos/vancomicina');
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.__medicationCopied = value; } } }));
    await entry().getByRole('button', { name: 'Copiar link da ficha', exact: true }).click();
    assert.equal(await page.evaluate(() => window.__medicationCopied), `${origin}/#medicamentos/vancomicina`);
    assert.match(await entry().locator('.medication-copy-status').textContent(), /copiado/);
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Clipboard bloqueado para teste'); } } }));
    await entry().getByRole('button', { name: 'Copiar link da ficha', exact: true }).click();
    const field = entry().getByRole('textbox', { name: 'Link para copiar', exact: true });
    assert.equal(await field.inputValue(), `${origin}/#medicamentos/vancomicina`);
    assert.equal(await field.getAttribute('readonly'), '');
    assert.equal(await field.evaluate(element => element === document.activeElement), true);
    return { clipboardSuccessAndFallback: true, personalDataInUrl: false };
  });

  await check('Teclado, amostras de contraste e alvos principais permitem consulta acessível', async () => {
    await go('medicamentos/noradrenalina');
    const fold = entry().locator('.medication-fold').filter({ has: page.locator('summary', { hasText: 'Finalidade e mecanismo de ação' }) }).locator('summary');
    await fold.focus(); await page.keyboard.press('Enter');
    assert.equal(await fold.evaluate(element => element.parentElement.open), true);
    await page.keyboard.press('Space');
    assert.equal(await fold.evaluate(element => element.parentElement.open), false);
    await expandAll();
    const samples = await entry().locator('.medication-category-label,.medication-summary p,.medication-care li,.medication-alerts li,.medication-validation strong,.medication-references a,.medication-risk-notice p,.medication-secondary').evaluateAll(elements => elements.filter(element => element.checkVisibility()).map(element => {
      let ancestor = element, background = 'rgb(255, 255, 255)';
      while (ancestor) { const style = getComputedStyle(ancestor); if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') { background = style.backgroundColor; break; } ancestor = ancestor.parentElement; }
      return { text: element.textContent.trim().slice(0, 100), color: getComputedStyle(element).color, background };
    }));
    const luminance = value => value.slice(0, 3).map(component => { component /= 255; return component <= .04045 ? component / 12.92 : ((component + .055) / 1.055) ** 2.4; }).reduce((sum, component, index) => sum + component * [.2126, .7152, .0722][index], 0);
    for (const sample of samples) {
      const colors = [sample.color, sample.background].map(value => luminance(value.match(/[\d.]+/g).map(Number))).sort((a, b) => b - a);
      sample.ratio = (colors[0] + .05) / (colors[1] + .05);
      assert.ok(sample.ratio >= 4.5, `Contraste insuficiente: ${JSON.stringify(sample)}`);
    }
    assert.ok(samples.length >= 10);
    const targets = await entry().locator('.medication-entry-actions button,.medication-fold>summary,.medication-back,.medication-related-list a').evaluateAll(elements => elements.filter(element => element.checkVisibility()).map(element => ({ label: element.textContent.trim().slice(0, 80), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height })));
    for (const target of targets) assert.ok(target.width >= 44 && target.height >= 44, `Alvo menor que 44px: ${JSON.stringify(target)}`);
    const link = entry().locator('.medication-related-list a[href^="#dicionario-clinico/"]').first();
    const href = await link.getAttribute('href'); await link.focus(); await page.keyboard.press('Enter');
    await page.locator('.clinical-entry').waitFor(); assert.equal(new URL(page.url()).hash, href);
    output.contrastSamples = samples; output.touchTargets = targets;
    return { nativeDetailsKeyboard: true, relatedLinkEnter: true, contrastSamples: samples.length, minimumContrast: Math.min(...samples.map(sample => sample.ratio)), minimumTargetPixels: 44 };
  });

  await check('Rotas desconhecidas permitem recuperação sem criar conteúdo clínico', async () => {
    await go('medicamentos/ficha-nao-cadastrada');
    assert.equal(await primary().getByRole('heading', { name: 'Ficha não encontrada', exact: true }).count(), 1);
    await primary().getByRole('link', { name: 'Voltar à pesquisa', exact: true }).click();
    await search().waitFor(); assert.equal(await listingCards().count(), 40);
    return { unknownProfileRecovery: true };
  });

  await check('Cinco casos fictícios aceitam escolhas, explicam cada resposta e permitem repetir sem dados de pacientes', async () => {
    let choices = 0, profileLinks = 0;
    for (const studyCase of medicationCases) {
      await go(medicationCaseHref(studyCase.id).slice(1));
      const cases = page.locator('.medication-cases'); await cases.waitFor();
      const panel = cases.locator('.medication-case-panel');
      const heading = panel.getByRole('heading', { name: studyCase.title, exact: true });
      assert.equal(await heading.count(), 1);
      assert.equal(await heading.evaluate(element => element === document.activeElement), true);
      assert.equal(await cases.getByRole('combobox', { name: 'Escolha um caso sobre medicamentos', exact: true }).inputValue(), studyCase.id);
      assert.ok(plain(await panel.innerText()).includes(plain(studyCase.scenario)));
      assert.match(await cases.locator('.medication-validation').textContent(), /Revisão clínica e institucional pendente/);
      assert.match(await cases.textContent(), /não recebem dados de pacientes/);
      assert.equal(await cases.locator('textarea,input,iframe,object,embed').count(), 0);
      assert.equal(await panel.locator('.medication-case-options legend').textContent(), studyCase.question);
      assert.equal(await panel.locator('.medication-case-options > button').count(), studyCase.options.length);
      for (const [index, option] of studyCase.options.entries()) {
        const optionButton = panel.locator('.medication-case-options > button').nth(index);
        await optionButton.focus(); await page.keyboard.press('Enter');
        const feedback = panel.locator('.medication-case-feedback'); await feedback.waitFor();
        assert.ok(plain(await feedback.innerText()).includes(plain(option.feedback)));
        assert.match(await feedback.textContent(), index === studyCase.answer ? /Essa atitude favorece a segurança/ : /Vamos refletir sobre essa escolha/);
        if (index !== studyCase.answer) assert.ok(plain(await feedback.innerText()).includes(plain(studyCase.options[studyCase.answer].text)));
        assert.equal(await panel.locator('.medication-case-options').getAttribute('disabled'), '');
        await feedback.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
        assert.equal(await feedback.count(), 0);
        assert.equal(await heading.evaluate(element => element === document.activeElement), true);
        assert.equal(await panel.locator('.medication-case-options').getAttribute('disabled'), null);
        choices++;
      }
      assert.deepEqual(await panel.locator('.medication-related-list a').evaluateAll(elements => elements.map(element => element.getAttribute('href'))), studyCase.medicationIds.map(id => `#medicamentos/${id}`));
      profileLinks += studyCase.medicationIds.length;
    }
    const cases = page.locator('.medication-cases');
    await cases.getByRole('combobox', { name: 'Escolha um caso sobre medicamentos', exact: true }).selectOption(medicationCases[0].id);
    assert.equal(await cases.locator('.medication-case-panel h3').first().textContent(), medicationCases[0].title);
    assert.equal(await cases.locator('.medication-case-feedback').count(), 0);
    await cases.getByRole('link', { name: 'Voltar ao Guia de Medicamentos', exact: true }).click(); await search().waitFor();
    await go(medicationCaseHref(medicationCases[0].id).slice(1));
    await page.locator('.medication-case-panel').getByRole('button', { name: /^Adicionar aos favoritos:/ }).click();
    await page.reload(); await page.locator('.medication-case-panel').waitFor();
    assert.equal(await page.locator('.medication-case-panel').getByRole('button', { name: /^Remover dos favoritos:/ }).getAttribute('aria-pressed'), 'true');
    await go('favoritos');
    assert.equal(await page.locator(`.favorites-list a[href="${medicationCaseHref(medicationCases[0].id)}"]`).count(), 1);
    return { fictionalCases: 5, allChoicesAndFeedback: choices, linkedProfiles: profileLinks, keyboardAnswersAndRetry: true, selectorAndBackNavigation: true, persistentCaseFavorite: true, patientInputs: 0 };
  });

  await check('Página inicial, lista, quarenta fichas e cinco casos cabem em 320,390,768 e1440pixels', async () => {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
      for (const route of ['inicio', 'medicamentos', ...medications.map(item => `medicamentos/${item.id}`), 'medicamentos/casos', ...medicationCases.map(item => medicationCaseHref(item.id).slice(1))]) {
        await go(route);
        if (route.startsWith('medicamentos/') && !route.startsWith('medicamentos/casos')) { await entry().waitFor(); await expandAll(); }
        if (route.startsWith('medicamentos/casos')) await page.locator('.medication-case-panel').waitFor();
        await noOverflow(route, width);
      }
    }
    return { widths: [320, 390, 768, 1440], checkedLayouts: output.layouts.length, profilesEachWidth: 40, fictionalCasesEachWidth: 5 };
  });

  await check('Favoritos continuam em sessão e mostram aviso quando armazenamento está bloqueado', async () => {
    const blocked = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    observeContext(blocked);
    await blocked.addInitScript(() => {
      window.__medicationCsp = [];
      document.addEventListener('securitypolicyviolation', event => window.__medicationCsp.push({ directive: event.effectiveDirective, blocked: event.blockedURI }));
      Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Bloqueado para teste', 'SecurityError'); } });
    });
    const blockedPage = await blocked.newPage();
    await blockedPage.goto(`${origin}/#medicamentos/cefepima`);
    const blockedEntry = blockedPage.locator('.medication-entry'); await blockedEntry.waitFor();
    await blockedEntry.getByRole('button', { name: /^Adicionar aos favoritos:/ }).click();
    assert.equal(await blockedEntry.getByRole('button', { name: /^Remover dos favoritos:/ }).getAttribute('aria-pressed'), 'true');
    assert.match(await blockedEntry.locator('.learning-storage-note').textContent(), /sessão/);
    await go('favoritos', blockedPage);
    assert.equal(await blockedPage.locator('.favorites-list a[href="#medicamentos/cefepima"]').count(), 1);
    await captureCsp(blockedPage); await blocked.close();
    return { blockedStorageHandled: true, inSessionFavorite: true };
  });

  await screenshot('inicio', '/tmp/cti-medication-home-mobile.png');
  await screenshot('medicamentos/vancomicina', '/tmp/cti-medication-entry-mobile.png');
  await screenshot('inicio', '/tmp/cti-medication-home-desktop.png', 1440);
  await screenshot('medicamentos', '/tmp/cti-medication-index-desktop.png', 1440);
  await screenshot('medicamentos/noradrenalina', '/tmp/cti-medication-entry-desktop.png', 1440);

  await check('Cache existente abre ficha e casos em abas novas offline, com pesquisa e recarga locais', async () => {
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), { timeout: 30000 });
    const cacheKeys = await page.evaluate(() => caches.keys()); assert.ok(cacheKeys.includes(expectedCache));
    await context.setOffline(true);
    const offlinePage = await context.newPage();
    await offlinePage.goto(`${origin}/#medicamentos/aciclovir`);
    await offlinePage.locator('.medication-entry').waitFor();
    assert.match(await offlinePage.locator('.medication-entry h2').textContent(), /Aciclovir/);
    await go('medicamentos', offlinePage);
    const offlineSearch = offlinePage.getByRole('searchbox', { name: 'Pesquisar medicamentos', exact: true });
    await offlineSearch.fill('norepinefrina');
    assert.equal(await offlinePage.locator('.medication-card-grid a[href="#medicamentos/noradrenalina"]').count(), 1);
    await offlinePage.reload(); await offlineSearch.waitFor();
    assert.equal(await offlinePage.locator('.medication-card').count(), 40);
    await captureCsp(offlinePage); await offlinePage.close();
    const offlineCases = await context.newPage();
    await offlineCases.goto(`${origin}/${medicationCaseHref(medicationCases[0].id)}`);
    await offlineCases.getByRole('heading', { name: medicationCases[0].title, exact: true }).waitFor();
    assert.ok(plain(await offlineCases.locator('main').innerText()).includes(plain(medicationCases[0].scenario)));
    await offlineCases.reload();
    await offlineCases.getByRole('heading', { name: medicationCases[0].title, exact: true }).waitFor();
    await captureCsp(offlineCases); await offlineCases.close(); await context.setOffline(false);
    return { existingCache: expectedCache, freshProfileTabOffline: true, freshCaseTabOffline: true, localSearchOffline: true, offlineReload: true };
  });

  await check('Consulta educativa não gera exceções,CSP,novas chaves ou chamadas externas', async () => {
    await captureCsp(page);
    const stored = await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }));
    assert.ok(stored.local.every(key => allowedStorageKeys.includes(key)), `Novas chaves: ${stored.local.join(', ')}`);
    assert.deepEqual(stored.session, []);
    assert.deepEqual(output.errors, []); assert.deepEqual(output.consoleErrors, []);
    assert.deepEqual(output.externalRequests, []); assert.deepEqual(output.cspViolations, []);
    return { runtimeErrors: 0, consoleErrors: 0, cspViolations: 0, externalRequests: 0, newStorageKeys: 0, medicalValidationClaim: false };
  });
} catch (error) {
  output.failures.push({ name: 'Inicialização', message: error.message, stack: error.stack });
  console.error(error.stack);
} finally {
  if (vite) await vite.close();
  if (context) await context.close();
  if (browser) await browser.close();
  server?.kill('SIGTERM');
  await writeFile(process.env.CTI_BROWSER_OUTPUT || '/tmp/cti-medication-browser.json', JSON.stringify(output, null, 2) + '\n');
  console.log(JSON.stringify({ passed: output.checks.length, failed: output.failures.length, layouts: output.layouts.length, routes: output.routes.length, errors: output.errors.length }));
  if (output.failures.length) process.exitCode = 1;
}
