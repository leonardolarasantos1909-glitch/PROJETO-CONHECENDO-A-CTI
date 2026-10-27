import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const repo = resolve(process.env.CTI_REPO || fileURLToPath(new URL('..', import.meta.url)));
const reviewServer = fileURLToPath(new URL('./serve-review.py', import.meta.url));
const browserPort = process.env.CTI_BROWSER_PORT || '4231';
const origin = `http://127.0.0.1:${browserPort}`;
const expectedCache = process.env.CTI_EXPECTED_CACHE;
assert.ok(expectedCache, 'Pass CTI_EXPECTED_CACHE for the frozen production build.');
const output = {
  phase: 'family-welcome', baseline: '1fed72be139fc7c2d77cb6b5e2fb15805bcecece', cache: expectedCache,
  checks: [], failures: [], findings: [], errors: [], warnings: [], routes: [], modules: [], topicCount: 0,
  illustrationCount: 0, forms: [], layouts: [], screenshots: [], externalRequests: [],
  limits: [
    'Chromium headless on Linux only; no physical iPhone/Android, Safari, VoiceOver, TalkBack or NVDA.',
    'Production Cloudflare and a separate homologation deploy are not exercised by this local test.',
    'No claim of full WCAG conformance or independent clinical/institutional validation.',
    'Native browser zoom at200%/400% was not exercised; responsive viewport widths were checked.',
    'Printer hardware, physical duplex orientation, folded paper and native mobile print dialogs were not exercised; CSS print rendering and supplied PDF imposition were checked.'
  ]
};
let browser, context, page, server;
let moduleIds = [], pdfIds = [], caseIds = [];
const allRequests = [];
const requestTrace = [];
const newRoutes = ['perfil','integracao','laboratorio','cti-virtual','avaliacao-pbl','demonstracao','conteudos'];
const learningKeys = ['cti-learning-profile-v1','cti-integration-v1','cti-first-day-v1','cti-favorites-v1','cti-book-page-v1','cti-visited'];
async function assertMemoryOnly(sentinel) {
  const stored = await page.evaluate(() => JSON.stringify({local: {...localStorage}, session: {...sessionStorage}}));
  assert.ok(!stored.includes(sentinel), 'Exercise/feedback content must not be stored.');
  assert.ok(!requestTrace.some(request => request.url.includes(sentinel) || request.body?.includes(sentinel)), 'Exercise/feedback content must not be transmitted.');
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const slug = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const active = () => page.evaluate(() => ({tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim().slice(0, 130), id: document.activeElement?.id, className: document.activeElement?.className}));
const focusIs = locator => locator.evaluate(element => element === document.activeElement);
async function waitFocus(selector) { await page.waitForFunction(selector => document.querySelector(selector) === document.activeElement, selector); }
async function check(name, fn) {
  console.log('CHECK', name);
  try { const details = await fn(); output.checks.push({name, ...details}); console.log('PASS', name); }
  catch (error) {
    output.failures.push({name, message: error.message, stack: error.stack});
    console.error('FAIL', name, error.stack);
    const path = `/tmp/cti-family-failure-${output.failures.length}.png`;
    await page?.screenshot({path}).catch(() => {});
  }
}
async function go(route) {
  if (await page.locator('dialog[open]').count()) await page.keyboard.press('Escape');
  await page.evaluate(hash => location.hash = hash, route);
  await page.waitForFunction(hash => location.hash === '#' + hash, route);
  await sleep(80);
  output.routes.push(route);
}
async function noOverflow(route, width) {
  const measured = await page.evaluate(() => ({root: document.documentElement.scrollWidth, body: document.body.scrollWidth, viewport: innerWidth}));
  output.layouts.push({route, width, ...measured});
  assert.ok(measured.root <= width + 1 && measured.body <= width + 1, `Overflow ${route} width ${width}: ${JSON.stringify(measured)}`);
}
const glossaryField = () => page.getByRole('searchbox', {name: 'Pesquisar siglas e termos do siglário', exact: true});
function contrast(a, b) {
  const linear = value => { value /= 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; };
  const luminance = color => color.slice(0, 3).reduce((sum, value, index) => sum + linear(value) * [.2126, .7152, .0722][index], 0);
  const values = [luminance(a), luminance(b)].sort((a, b) => b - a);
  return (values[0] + .05) / (values[1] + .05);
}
async function computedSamples(selector, label) {
  const samples = await page.locator(selector).evaluateAll(elements => elements.filter(element => element.checkVisibility()).map(element => {
    let ancestor = element;
    let background;
    while (ancestor) {
      background = getComputedStyle(ancestor).backgroundColor;
      if (background !== 'rgba(0, 0, 0, 0)' && background !== 'transparent') break;
      ancestor = ancestor.parentElement;
    }
    const style = getComputedStyle(element);
    return {text: element.textContent.trim().slice(0, 90), selector: element.className || element.tagName, color: style.color, background, font: style.fontSize, weight: style.fontWeight};
  }));
  return samples.map(sample => ({group: label, ...sample, ratio: contrast(sample.color.match(/[\d.]+/g).map(Number), sample.background.match(/[\d.]+/g).map(Number))}));
}

try {
  assert.ok((await readFile(repo + '/dist/sw.js', 'utf8')).includes(expectedCache));
  server = spawn(process.env.CTI_PYTHON || 'python3', [reviewServer, '--port', browserPort, '--directory', repo + '/dist'], {stdio: 'ignore'});
  let started = false;
  for (let index = 0; index < 40; index++) { try { if ((await fetch(origin)).ok) { started = true; break; } } catch {} await sleep(100); }
  assert.ok(started, `Local server on${browserPort}`);
  const rootHeaders = (await fetch(origin, {method:'HEAD'})).headers;
  const pdfHeaders = (await fetch(origin+'/materiais/caderno-cti-adulto-digital.pdf', {method:'HEAD'})).headers;
  assert.match(rootHeaders.get('content-security-policy') ?? '', /default-src 'self'/); assert.equal(rootHeaders.get('x-content-type-options'),'nosniff'); assert.equal(pdfHeaders.get('content-type'),'application/pdf');
  output.headerSimulation = {source:'dist/_headers',rootCsp:rootHeaders.get('content-security-policy'),nosniff:rootHeaders.get('x-content-type-options'),pdfContentType:pdfHeaders.get('content-type'),environment:'local HTTP server; not Cloudflare verification'};
  browser = await chromium.launch({headless: true, args: ['--no-sandbox'], ...(process.env.CTI_CHROMIUM_PATH ? {executablePath: process.env.CTI_CHROMIUM_PATH} : {})});
  context = await browser.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true, reducedMotion: 'reduce'});
  context.setDefaultTimeout(10000);
  await context.addInitScript(() => {window.__ctiCspViolations=[]; document.addEventListener('securitypolicyviolation', event => window.__ctiCspViolations.push({directive:event.effectiveDirective,blocked:event.blockedURI}));});
  page = await context.newPage();
  page.on('pageerror', error => output.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning') output.warnings.push(message.text()); if(message.type()==='error') (output.consoleErrors??=[]).push(message.text()); });
  context.on('request', request => { allRequests.push(request.url()); requestTrace.push({url: request.url(), method: request.method(), body: request.postData()}); });
  await page.goto(origin);
  await page.getByRole('searchbox', {name: 'Pesquisar pelo nome ou assunto'}).waitFor();

  await check('All existing routes,32 topic dialogs,15 illustrations and nine PDF access pages preserve seven originals', async () => {
    moduleIds = await page.locator('.module-card').evaluateAll(elements => elements.map(element => element.hash.slice(1)));
    assert.equal(moduleIds.length, 9);
    output.modules = moduleIds;
    for (const route of ['inicio', 'modulos', ...moduleIds, 'primeiro-dia', 'glossario', 'favoritos', 'caderno', 'projeto', ...newRoutes]) {
      await go(route);
      if (route === 'caderno') await page.locator('.book-counter strong').waitFor();
      assert.equal(await page.getByText('Página não encontrada', {exact: true}).count(), 0);
      output.forms.push({route, inputs: await page.locator('input,textarea,select').evaluateAll(elements => elements.map(element => ({tag: element.tagName, type: element.type, label: element.getAttribute('aria-label') || document.querySelector(`label[for="${element.id}"]`)?.textContent?.trim() || element.closest('label')?.textContent?.trim()})))});
      const count = await page.locator('.topic-grid button.topic-card').count();
      for (let index = 0; index < count; index++) {
        const opener = page.locator('.topic-grid button.topic-card').nth(index);
        const title = await opener.locator('h2').textContent();
        await opener.focus(); await page.keyboard.press('Enter');
        const dialog = page.locator('dialog[open]');
        await dialog.waitFor();
        assert.equal(await dialog.getAttribute('aria-labelledby'), 'detail-title');
        assert.equal(await dialog.locator('#detail-title').textContent(), title);
        assert.match(await dialog.textContent(), /[Rr]evisão|pendente/);
        output.topicCount++;
        output.illustrationCount += await dialog.locator('.equipment-diagram[role="img"]').count();
        assert.equal(await page.evaluate(() => document.querySelector('dialog[open]').contains(document.activeElement)), true);
        await page.keyboard.press('Shift+Tab');
        assert.equal(await page.evaluate(() => document.querySelector('dialog[open]').contains(document.activeElement)), true);
        await page.keyboard.press('Escape'); await dialog.waitFor({state: 'detached'});
        assert.equal(await focusIs(opener), true);
        await go(route + '/' + slug(title)); await page.locator('dialog[open]').waitFor(); await page.keyboard.press('Escape');
      }
      if (route==='escalas' && count===0) {
        const opener=page.locator('.glasgow-introduction .institutional-link'); await opener.focus(); await page.keyboard.press('Enter'); const dialog=page.locator('dialog[open]'); await dialog.waitFor();
        assert.equal(await dialog.locator('#detail-title').textContent(),'Escala de Coma de Glasgow'); assert.match(await dialog.textContent(), /[Rr]evisão|pendente/); output.topicCount++;
        await page.keyboard.press('Escape'); await dialog.waitFor({state:'detached'}); assert.equal(await focusIs(opener),true);
      }
    }
    assert.equal(output.topicCount, 32); assert.equal(output.illustrationCount, 15);
    await go('biblioteca');
    pdfIds = await page.locator('.pdf-card').evaluateAll(elements => elements.map(element => element.id.replace('material-', '')));
    assert.equal(pdfIds.length, 9);
    for (const id of pdfIds) {
      await go('biblioteca/' + id);
      assert.equal(await page.locator('#material-' + id).evaluate(element => element === document.activeElement), true);
      await go('pdf/' + id + '?page=2'); await page.locator('.pdf-reader h1').waitFor();
      assert.equal(await page.locator('.pdf-reader-open').getAttribute('target'), '_blank');
      assert.equal(await page.locator('.pdf-reader-open').getAttribute('rel'), 'noopener noreferrer');
      assert.equal(await page.locator('iframe,object,embed').count(), 0);
      assert.match(await page.locator('.pdf-reader-open').getAttribute('href'), /\.pdf#page=2$/);
      await page.locator('.pdf-reader-back').click(); await page.locator('#material-' + id).waitFor();
    }
    for (const route of ['pagina-inexistente', 'pdf/inexistente']) { await go(route); assert.equal(await page.getByRole('heading', {name: 'Página não encontrada', exact: true}).count(), 1); }
    return {modules: 9, dialogs: output.topicCount, illustrations: output.illustrationCount, pdfs: pdfIds.length};
  });

  await check('Search, aliases, internal destinations,746 glossary terms and preserved11 review notes', async () => {
    for (const [value, destination] of [['PAV', '#rotinas/bundle-de-prevencao-da-pav'], ['RASS', '#escalas/rass'], ['PPlato', '#glossario/pplato']]) {
      await go('inicio'); const box = page.getByRole('searchbox', {name: 'Pesquisar pelo nome ou assunto'});
      await box.fill(value); await box.press('Enter');
      assert.equal(await focusIs(page.getByRole('heading', {name: 'Resultados da pesquisa', exact: true})), true);
      await page.locator(`.home-search-list a[href="${destination}"]`).click(); await sleep(100);
      assert.equal(page.url().split('/#')[1], destination.slice(1));
    }
    await go('inicio'); await page.getByRole('searchbox', {name: 'Pesquisar pelo nome ou assunto'}).fill('pressão');
    assert.equal(await page.locator('.home-search-list li').count(), 8);
    await page.getByRole('button', {name: 'Mostrar mais resultados', exact: true}).click(); assert.equal(await page.locator('.home-search-list li').count(), 16);
    await page.getByRole('button', {name: 'Limpar pesquisa', exact: true}).click(); assert.equal(await page.locator('.module-tile').count(), 9);
    await go('glossario'); assert.equal(await page.locator('.starter-term').count(), 40);
    await glossaryField().fill('SpO₂'); assert.equal(await page.locator('.starter-term').count(), 1);
    await glossaryField().press('Enter'); assert.equal(await focusIs(page.getByRole('heading', {name: 'Resultados do siglário', exact: true})), true);
    await page.getByRole('button', {name: 'Limpar pesquisa do siglário'}).click();
    await page.getByRole('combobox', {name: 'Filtrar por inicial'}).selectOption('0–9'); assert.equal(await page.locator('.starter-term').count(), 4);
    await page.getByRole('combobox', {name: 'Filtrar por inicial'}).selectOption('');
    const more = page.getByRole('button', {name: 'Mostrar mais termos', exact: true});
    while (await more.count()) await more.click();
    assert.equal(await page.locator('.starter-term').count(), 746);
    assert.equal(await page.locator('.glossary-review-note').count(), 11);
  });

  await check('Checklist and existing favorites/book progress persist and remain local,reset preserves unrelated origin data', async () => {
    await go('primeiro-dia'); assert.equal(await page.getByRole('checkbox').count(), 10);
    await page.getByRole('checkbox').first().check(); await page.reload(); await page.locator('.starter-checklist').waitFor();
    assert.equal(await page.getByRole('checkbox', {checked: true}).count(), 1);
    await page.getByRole('button', {name: 'Desmarcar todos os itens', exact: true}).click(); assert.equal(await page.getByRole('checkbox', {checked: true}).count(), 0);
    await go('glossario/pplato'); await page.locator('#glossary-pplato .favorite-button').click(); await page.reload();
    await go('favoritos'); const favorite = page.locator('.favorites-list a[href="#glossario/pplato"]');
    assert.equal(await favorite.textContent(), 'PPlat — Pressão de Plantô'); await favorite.click(); await page.locator('#glossary-pplato').waitFor();
    await go('caderno'); await page.locator('.book-counter strong').waitFor(); assert.equal(await page.locator('.book-slide').count(), 96);
    await page.getByRole('spinbutton', {name: 'Ir para página', exact: true}).fill('42'); await page.locator('.book-jump button').click();
    await page.waitForFunction(() => document.querySelector('.book-counter strong')?.textContent === '42'); await page.reload();
    await page.waitForFunction(() => document.querySelector('.book-counter strong')?.textContent === '42');
    await page.locator('.book-viewport').focus(); await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => document.querySelector('.book-counter strong')?.textContent === '43');
    await page.getByRole('button', {name: 'Índice', exact: true}).click(); await page.waitForFunction(() => document.querySelector('.book-counter strong')?.textContent === '2');
    await page.locator('.book-text summary').click(); assert.ok((await page.locator('.book-transcript').textContent()).length > 20);
    await page.evaluate(() => localStorage.setItem('cti-phase1-unrelated', 'retain'));
    await go('projeto'); await page.getByRole('button', {name: 'Apagar meus dados de aprendizado', exact: true}).click();
    assert.equal(await page.evaluate(() => localStorage.getItem('cti-phase1-unrelated')), 'retain');
    for (const key of ['cti-favorites-v1', 'cti-first-day-v1', 'cti-book-page-v1', 'cti-visited']) assert.equal(await page.evaluate(key => localStorage.getItem(key), key), null);
  });

  await check('Five existing two-step fictional PBL cases,feedback,references and focus remain intact', async () => {
    await go('quiz'); caseIds = await page.locator('.case-selector option').evaluateAll(elements => elements.map(element => element.value)); assert.equal(caseIds.length, 5);
    for (const id of caseIds) {
      await go('quiz/' + id); assert.equal(await page.getByRole('combobox', {name: 'Escolha um caso', exact: true}).inputValue(), id);
      assert.ok(await page.locator('.case-sources a').count() >= 2);
      for (let step = 0; step < 2; step++) {
        await page.locator('.case-option').first().click(); assert.equal(await page.locator('.case-feedback[role="status"]').count(), 1);
        assert.equal(await page.locator('.case-options').evaluate(element => element.disabled), true);
        await page.getByRole('button', {name: step === 0 ? 'Continuar o caso' : 'Ver discussão final', exact: true}).click();
        await waitFocus('.case-panel h3');
      }
      assert.equal(await page.getByRole('heading', {name: 'Leve essa discussão ao preceptor'}).count(), 1);
      await page.getByRole('button', {name: 'Repetir este caso', exact: true}).click(); assert.equal(await page.locator('.case-options').evaluate(element => element.disabled), false);
    }
    return {cases: 5, decisions: 10};
  });


  await check('Quiz focus advances to new question,result,restart and subject reset; textual states preserve answer feedback', async () => {
    await go('quiz');
    const quiz = page.locator('.quiz');
    const first = quiz.locator('.answer').first();
    const initialHeading = await quiz.locator('h2').textContent();
    await first.focus(); await page.keyboard.press('Enter');
    assert.equal(await quiz.locator('.feedback[role="status"]').count(), 1);
    assert.equal(await quiz.locator('fieldset').evaluate(element => element.disabled), true);
    assert.equal(await quiz.getByText('Sua escolha', {exact: true}).count(), 1);
    assert.equal(await quiz.getByText('Resposta esperada', {exact: true}).count(), 1);
    assert.match(await quiz.locator('.answer').nth(1).textContent(), /Resposta esperada/);
    await waitFocus('.quiz .feedback');
    const afterAnswer = await active();
    await waitFocus('.quiz .feedback');
    assert.equal(await quiz.locator('.feedback').getAttribute('tabindex'), '-1');
    assert.equal(await focusIs(quiz.locator('h2')), false, 'Answer selection must retain the current question.');
    await page.keyboard.press('Tab');
    assert.equal(await focusIs(page.getByRole('button', {name: 'Próxima questão', exact: true})), true, 'Tab from feedback must reach the next action directly.');
    assert.equal(await quiz.locator('h2').textContent(), initialHeading);
    let secondQuestionFocus;
    for (let index = 0; index < 32; index++) {
      assert.match(await quiz.locator('.quiz-meta span').first().textContent(), new RegExp('QUESTÃO ' + (index + 1) + ' DE 32'));
      if (index !== 0) {
        await quiz.locator('.answer').first().focus(); await page.keyboard.press('Enter');
        assert.equal(await quiz.locator('.feedback[role="status"]').count(), 1);
        assert.equal(await quiz.getByText('Sua escolha', {exact: true}).count(), 1);
        assert.equal(await quiz.getByText('Resposta esperada', {exact: true}).count(), 1);
        await waitFocus('.quiz .feedback');
        await page.keyboard.press('Tab');
        assert.equal(await focusIs(page.getByRole('button', {name: index === 31 ? 'Ver resultado' : 'Próxima questão', exact: true})), true);
      }
      const next = page.getByRole('button', {name: index === 31 ? 'Ver resultado' : 'Próxima questão', exact: true});
      await next.focus(); await page.keyboard.press('Enter');
      await waitFocus('.quiz h2');
      if (index === 0) secondQuestionFocus = await active();
      if (index !== 31) assert.equal(await quiz.locator('.feedback').count(), 0);
    }
    assert.equal(await quiz.locator('.quiz-result').count(), 1);
    const resultFocus = await active(); assert.equal(resultFocus.tag, 'H2');
    await page.getByRole('button', {name: 'Refazer quiz', exact: true}).focus(); await page.keyboard.press('Enter');
    await waitFocus('.quiz h2');
    const restartFocus = await active();
    assert.match(await quiz.locator('.quiz-meta span').first().textContent(), /QUESTÃO 1 DE 32/);
    assert.equal(await quiz.getByText('Sua escolha', {exact: true}).count(), 0);
    const select = quiz.locator('select'); const subjects = await select.locator('option').allTextContents();
    const perSubject = [];
    for (const subject of subjects) {
      const unchanged = await select.inputValue() === subject;
      await select.focus(); await select.selectOption({label: subject});
      if (unchanged) { assert.equal(await focusIs(select), true); perSubject.push({subject, unchanged: true, focus: await active()}); continue; }
      await waitFocus('.quiz h2');
      assert.ok(await quiz.locator('.answer').count() > 0);
      assert.match(await quiz.locator('.quiz-meta span').first().textContent(), /QUESTÃO 1 DE /);
      assert.equal(await quiz.locator('.feedback').count(), 0);
      const focus = await active(); assert.equal(focus.tag, 'H2');
      perSubject.push({subject, focus});
    }
    await select.selectOption({label: 'Todos'}); await waitFocus('.quiz h2');
    // First question's correct answer is the second option; both text states must coexist on it.
    await quiz.locator('.answer').nth(1).click();
    assert.match(await quiz.locator('.answer').nth(1).textContent(), /Sua escolha/);
    assert.match(await quiz.locator('.answer').nth(1).textContent(), /Resposta esperada/);
    await waitFocus('.quiz .feedback');
    await quiz.locator('.answer').nth(1).evaluate(element => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 20));
    const path = '/tmp/cti-family-quiz-states.png'; await page.screenshot({path}); output.screenshots.push(path);
    return {questions: 32, afterAnswer, secondQuestionFocus, resultFocus, restartFocus, perSubject, quizProgressStored: await page.evaluate(() => Object.keys(localStorage).some(key => /quiz|case/i.test(key)))};
  });

  await check('Profiles are optional, persistent, switchable and keep all nine shared modules available', async () => {
    await page.evaluate(() => localStorage.removeItem('cti-learning-profile-v1')); await page.reload(); await go('inicio');
    assert.equal(await page.locator('.profile-chooser').count(), 1);
    assert.equal(await page.locator('.profile-chooser input').count(), 0);
    await page.locator('.profile-options button').nth(1).click();
    await waitFocus('.profile-welcome h2');
    assert.equal(await page.getByRole('combobox', {name: 'Perfil de aprendizagem', exact: true}).inputValue(), 'colaborador');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('cti-learning-profile-v1'))), 'colaborador');
    assert.equal(await page.locator('.module-card').count(), 9);
    const profileScreenshot = '/tmp/cti-family-profile-home.png'; await page.screenshot({path: profileScreenshot}); output.screenshots.push(profileScreenshot);
    await page.reload(); await page.locator('.profile-welcome').waitFor();
    assert.match(await page.locator('.profile-welcome h2').textContent(), /novo colaborador/i);
    await page.getByRole('combobox', {name: 'Perfil de aprendizagem', exact: true}).selectOption('estagiario');
    await waitFocus('.profile-welcome h2');
    assert.equal(await page.locator('.module-card').count(), 9);
    await page.getByRole('link', {name: /Trocar perfil/}).click(); await page.locator('.profile-chooser').waitFor();
    assert.equal(page.url().split('/#')[1], 'perfil');
    await page.getByRole('button', {name: 'Explorar sem escolher perfil', exact: true}).click();
    assert.equal(await page.getByRole('combobox', {name: 'Perfil de aprendizagem', exact: true}).inputValue(), '');
    for (const invalid of ['{broken', '"not-authorized"', '{}', '[]']) {
      await page.evaluate(value => localStorage.setItem('cti-learning-profile-v1', value), invalid); await page.reload();
      assert.equal(await page.getByRole('combobox', {name: 'Perfil de aprendizagem', exact: true}).inputValue(), '');
      assert.equal(await page.locator('.profile-chooser').count(), 1);
    }
    return {optional: true, identifiersRequested: false, sharedModules: 9, corruptStatesRejected: 4};
  });

  await check('Student and collaborator checklists persist separately; local reset clears six learning keys only', async () => {
    await page.getByRole('combobox', {name: 'Perfil de aprendizagem', exact: true}).selectOption('colaborador');
    await go('primeiro-dia'); const firstDay = page.locator('.starter-checklist');
    assert.equal(await firstDay.getByRole('checkbox').count(), 10); await firstDay.getByRole('checkbox').nth(0).check();
    await go('integracao'); const integration = page.locator('.integration-checklist');
    assert.equal(await integration.getByRole('checkbox').count(), 9);
    assert.match(await integration.locator('.integration-review').textContent(), /não representa treinamento obrigatório, certificação ou autorização/);
    await integration.getByRole('checkbox').nth(0).check(); await integration.getByRole('checkbox').nth(1).check(); await page.reload(); await integration.waitFor();
    assert.equal(await integration.getByRole('checkbox', {checked: true}).count(), 2);
    assert.equal(await integration.getByRole('progressbar', {name: 'Itens marcados no roteiro de integração'}).getAttribute('value'), '2');
    await go('primeiro-dia'); assert.equal(await firstDay.getByRole('checkbox', {checked: true}).count(), 1);
    await go('integracao'); await page.getByRole('button', {name: 'Reiniciar checklist de integração', exact: true}).click();
    assert.equal(await integration.getByRole('checkbox', {checked: true}).count(), 0); assert.equal(await focusIs(integration.getByRole('checkbox').first()), true);
    await go('primeiro-dia'); assert.equal(await firstDay.getByRole('checkbox', {checked: true}).count(), 1);
    assert.equal(await page.getByRole('combobox', {name: 'Perfil de aprendizagem', exact: true}).inputValue(), 'colaborador');
    await page.evaluate(() => localStorage.setItem('cti-final-unrelated', 'retain'));
    await go('projeto'); await page.getByRole('button', {name: 'Apagar meus dados de aprendizado', exact: true}).click();
    for (const key of learningKeys) assert.equal(await page.evaluate(key => localStorage.getItem(key), key), null, key);
    assert.equal(await page.getByRole('combobox', {name: 'Perfil de aprendizagem', exact: true}).inputValue(), '');
    assert.equal(await page.evaluate(() => localStorage.getItem('cti-final-unrelated')), 'retain');
    await go('integracao'); assert.equal(await integration.getByRole('checkbox', {checked: true}).count(), 0);
    await go('primeiro-dia'); assert.equal(await firstDay.getByRole('checkbox', {checked: true}).count(), 0);
    return {studentItems: 10, collaboratorItems: 9, independent: true, resetKeys: learningKeys};
  });

  await check('Search categories and aliases connect new tools; content catalog exposes real review gaps', async () => {
    await go('inicio'); const search = page.getByRole('searchbox', {name: 'Pesquisar pelo nome ou assunto', exact: true});
    const category = page.getByRole('combobox', {name: 'Categoria da pesquisa', exact: true});
    for (const [query, href] of [['laboratório','#laboratorio'],['box','#cti-virtual'],['feedback','#avaliacao-pbl'],['demonstração','#demonstracao'],['integração','#integracao']]) {
      await search.fill(query); await category.selectOption('Ferramenta');
      assert.ok(await page.locator(`.home-search-list a[href="${href}"]`).count() > 0, `${query} -> ${href}`);
      assert.deepEqual([...new Set(await page.locator('.home-search-kind').allTextContents())], ['Ferramenta']);
      await page.getByRole('button', {name: 'Limpar pesquisa', exact: true}).click(); assert.equal(await category.inputValue(), '');
    }
    await search.fill('pressão'); await category.selectOption('Siglário');
    assert.ok(await page.locator('.home-search-list li').count() > 0); assert.deepEqual([...new Set(await page.locator('.home-search-kind').allTextContents())], ['Siglário']);
    await page.getByRole('button', {name: 'Pesquisar RASS', exact: true}).click(); assert.equal(await category.inputValue(), '');
    await go('conteudos'); const catalog = page.locator('.content-catalog'); await catalog.waitFor();
    const countText = await catalog.getByRole('status').textContent(); const total = Number(countText.match(/^(\d+)/)?.[1]); assert.ok(total >= 805, `Registry count ${total}`);
    assert.equal(await catalog.locator('.content-catalog-list>li').count(), 30);
    await catalog.getByRole('button', {name: 'Mostrar mais conteúdos', exact: true}).click(); assert.equal(await catalog.locator('.content-catalog-list>li').count(), 60);
    await catalog.getByRole('searchbox', {name: 'Pesquisar conteúdo', exact: true}).fill('MSSA');
    assert.equal(await catalog.locator('.content-catalog-list>li').count(), 1);
    assert.match(await catalog.textContent(), /Última revisão clínica: não realizada/); assert.match(await catalog.textContent(), /Revisão profissional pendente/);
    await catalog.getByRole('searchbox', {name: 'Pesquisar conteúdo', exact: true}).fill('');
    await catalog.getByRole('combobox', {name: 'Situação', exact: true}).selectOption('institutional_validated');
    assert.equal(await catalog.locator('.content-catalog-list>li').count(), 0);
    await catalog.getByRole('combobox', {name: 'Situação', exact: true}).selectOption('pending_review');
    await catalog.getByRole('searchbox', {name: 'Pesquisar conteúdo', exact: true}).fill('');
    await catalog.getByRole('combobox', {name: 'Categoria', exact: true}).selectOption('Escala');
    assert.ok(await catalog.locator('.content-catalog-list>li').count() >= 4);
    assert.ok((await catalog.locator('.content-catalog-list>li>div>span').allTextContents()).every(text => text.startsWith('Escala ·')));
    return {catalogContents: total, falseInstitutionalValidation: false, newSearchDestinations: 5};
  });

  await check('Three annotation scenarios use manual rubrics and memory-only drafts without patient data collection', async () => {
    await go('laboratorio'); const select = page.getByRole('combobox', {name: 'Escolha um cenário fictício', exact: true});
    const scenarios = await select.locator('option').evaluateAll(options => options.map(option => ({id: option.value, title: option.textContent})));
    assert.equal(scenarios.length, 3); const sentinel = 'MARCADOR_FICTICIO_TESTE_LOCAL';
    const editor = page.getByRole('textbox', {name: 'Sua anotação do cenário fictício', exact: true});
    for (const scenario of scenarios) {
      await select.selectOption(scenario.id); assert.equal(await editor.inputValue(), '');
      await editor.fill(`${sentinel}. Exercício fictício para autorrevisão; usar somente os fatos do cenário.`);
      await page.getByRole('button', {name: 'Conferir meu texto', exact: true}).click(); await page.locator('.lab-review').waitFor();
      assert.equal(await page.locator('.lab-rubric input[type=checkbox]').count(), 5);
      assert.ok((await page.locator('.lab-review').textContent()).length > 300);
      for (const checkbox of await page.locator('.lab-rubric input[type=checkbox]').all()) await checkbox.check();
      await assertMemoryOnly(sentinel);
      await page.getByRole('button', {name: 'Limpar exercício', exact: true}).click(); assert.equal(await editor.inputValue(), '');
      assert.equal(await page.locator('.lab-review').count(), 0);
    }
    await editor.fill(sentinel); await select.selectOption(scenarios[1].id); assert.equal(await editor.inputValue(), '');
    await editor.fill(sentinel); await go('inicio'); await go('laboratorio'); assert.equal(await editor.inputValue(), '');
    assert.equal(await page.locator('.lab-review').count(), 0); await assertMemoryOnly(sentinel);
    await editor.fill('Prática fictícia. Nenhuma informação identificável.'); await page.getByRole('button', {name: 'Conferir meu texto', exact: true}).click();
    const path = '/tmp/cti-family-annotation-lab.png'; await page.screenshot({path}); output.screenshots.push(path);
    return {scenarios, manualCriteria: 5, draftPersistence: 'memory only'};
  });

  await check('Eight virtual stations have equivalent list access, keyboard dialogs, sources and exact focus return', async () => {
    await go('cti-virtual'); const stationButtons = page.locator('.virtual-box-station'); const listButtons = page.locator('.virtual-station-list button');
    assert.equal(await stationButtons.count(), 8); assert.equal(await listButtons.count(), 8);
    assert.deepEqual(await stationButtons.evaluateAll(items => items.map(item => item.dataset.stationId)), await listButtons.evaluateAll(items => items.map(item => item.dataset.stationId)));
    assert.equal(await page.locator('.virtual-box-drawing').getAttribute('aria-hidden'), 'true');
    for (const collection of [stationButtons, listButtons]) for (let i=0;i<8;i++) {
      const opener = collection.nth(i); assert.equal(await opener.getAttribute('aria-haspopup'), 'dialog');
      await opener.focus(); await page.keyboard.press('Enter'); const dialog = page.locator('.virtual-cti-dialog[open]'); await dialog.waitFor();
      await waitFocus('.virtual-cti-dialog h2'); assert.ok((await dialog.locator('h2').textContent()).length > 3);
      assert.equal(await dialog.locator('.equipment-diagram[role=img]').count(), 1); assert.ok(await dialog.locator('svg title').count() >= 1);
      assert.ok(await dialog.locator('svg desc').count() >= 1);
      if (i===0) { await page.keyboard.press('Tab'); assert.equal(await page.evaluate(() => document.querySelector('.virtual-cti-dialog').contains(document.activeElement)), true); }
      if (i===1) await dialog.getByRole('button',{name:'Voltar ao box',exact:true}).click(); else await page.keyboard.press('Escape');
      await dialog.waitFor({state:'detached'}); assert.equal(await focusIs(opener), true);
    }
    await page.locator('.virtual-box-stage').evaluate(element=>window.scrollTo(0,element.getBoundingClientRect().top+window.scrollY-16));
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
    const path='/tmp/cti-family-virtual-scene.png'; await page.locator('.virtual-box-stage').screenshot({path}); output.screenshots.push(path);
    return {sceneStations: 8, equivalentListStations: 8, keyboardDialogs: 16, exactFocusReturn: true};
  });

  await check('PBL feedback is voluntary, closed-answer, local-memory only with explicit minimal JSON export', async () => {
    await go('avaliacao-pbl'); const form = page.locator('.pbl-feedback'); await form.waitFor();
    assert.equal(await form.locator('input[type=text],input[type=email],textarea').count(), 0);
    assert.equal(await form.locator('select').count(), 7);
    const consent = form.getByRole('checkbox', {name:'Entendi que a participação é voluntária e que minhas respostas ficam somente nesta tela, sem envio automático.',exact:true});
    assert.equal(await consent.isChecked(), false);
    const generate = form.getByRole('button',{name:'Gerar meu resumo',exact:true});
    if (await generate.isEnabled()) await generate.click();
    assert.equal(await form.getByRole('button',{name:'Baixar minhas respostas',exact:true}).count(),0);
    await consent.check(); for (const select of await form.locator('select').all()) await select.selectOption('5');
    const beforeStorage=await page.evaluate(()=>JSON.stringify({...localStorage}));
    await generate.click(); const downloadButton=form.getByRole('button',{name:'Baixar minhas respostas',exact:true}); await downloadButton.waitFor();
    const downloadPromise=page.waitForEvent('download'); await downloadButton.click(); const download=await downloadPromise;
    const target='/tmp/cti-family-feedback-export.json'; await download.saveAs(target); const exported=JSON.parse(await readFile(target,'utf8'));
    assert.deepEqual(Object.keys(exported).sort(),['answers','instrumentVersion']); assert.equal(exported.answers.length,7);
    for(const answer of exported.answers) { assert.deepEqual(Object.keys(answer).sort(),['answer','item']); assert.ok(['5',5].includes(answer.answer)); }
    assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),beforeStorage);
    await form.getByRole('button',{name:'Limpar respostas',exact:true}).click(); assert.equal(await consent.isChecked(),false);
    assert.ok((await form.locator('select').evaluateAll(items=>items.map(item=>item.value))).every(value=>value===''));
    await consent.check(); await form.locator('select').first().selectOption('3'); await go('inicio'); await go('avaliacao-pbl');
    assert.equal(await consent.isChecked(),false); assert.ok((await form.locator('select').evaluateAll(items=>items.map(item=>item.value))).every(value=>value===''));
    return {items:7, personalFields:0, remoteSubmission:false, exportFields:Object.keys(exported), exportPath:target};
  });

  await check('Nine-step guided demonstration covers both profiles and about page states academic origin and pending validation', async () => {
    await go('demonstracao'); const demo=page.locator('.guided-demo'); await demo.waitFor();
    const titles=[];
    for(let step=1;step<=9;step++) {
      assert.match(await demo.textContent(),new RegExp(`Etapa ${step} de 9`)); titles.push(await demo.locator('h3').textContent());
      const mark=demo.getByRole('checkbox',{name:'Marcar esta etapa como vista',exact:true}); await mark.check();
      assert.ok(await demo.locator('a[href^="#"]').count()>0);
      if(step<9) {await demo.getByRole('button',{name:'Próxima etapa',exact:true}).click(); await waitFocus('.guided-demo h3');}
    }
    await demo.getByRole('button',{name:'Etapa anterior',exact:true}).click(); await waitFocus('.guided-demo h3'); assert.match(await demo.textContent(),/Etapa 8 de 9/);
    await demo.getByRole('button',{name:'Reiniciar demonstração',exact:true}).click(); assert.match(await demo.textContent(),/Etapa 1 de 9/);
    assert.equal(await demo.getByRole('checkbox',{name:'Marcar esta etapa como vista',exact:true}).isChecked(),false);
    await demo.locator('.demo-step-nav button').nth(8).click(); await waitFocus('.guided-demo h3'); await demo.getByRole('button',{name:'Concluir demonstração',exact:true}).click(); await waitFocus('.guided-demo h3'); assert.equal(await demo.getByRole('heading',{name:'Demonstração percorrida',exact:true}).count(),1);
    await demo.getByRole('button',{name:'Reiniciar demonstração',exact:true}).click(); await waitFocus('.guided-demo h3');
    await go('projeto'); const about=await page.locator('main').textContent();
    assert.match(about,/Faculdade Moinhos de Vento/); assert.match(about,/PBL|Basead[ao] em Problemas/); assert.match(about,/novo[s]? colaborador/);
    assert.match(about,/não.*(?:publicação oficial|adotado|aprova|valida)/i); assert.match(about,/a definir|a confirmar/);
    return {steps:9,titles,academicContext:true,falseOfficialClaim:false};
  });

  await check('Current-route semantics,visual navigation,skip link and document titles track all represented destinations', async () => {
    await page.setViewportSize({width: 1440, height: 1000});
    const navSamples = [];
    const routes = ['inicio', 'modulos', ...moduleIds, 'primeiro-dia', 'glossario', 'favoritos', 'caderno', 'projeto', ...newRoutes, 'pdf/' + pdfIds[0]];
    for (const route of routes) {
      await go(route); if (route.startsWith('pdf/')) await page.locator('.pdf-reader h1').waitFor();
      const base = route.split('/')[0];
      const sidebarCurrent = page.locator('.sidebar nav a[aria-current]');
      const mobileCurrent = page.locator('.mobile-nav a[aria-current]');
      assert.ok(await sidebarCurrent.count() <= 1); assert.ok(await mobileCurrent.count() <= 1);
      const expected = ['acolhimento', 'rotinas', 'equipamentos', 'dispositivos', 'registros', 'quiz', 'acolher-familia'].includes(base) ? '#modulos' : ['pdf', 'caderno'].includes(base) ? '#biblioteca' : '#' + base;
      assert.equal(await sidebarCurrent.getAttribute('href'), expected);
      assert.ok(['page', 'location'].includes(await sidebarCurrent.getAttribute('aria-current')));
      assert.equal(await page.locator(`.sidebar nav a[href="${expected}"]`).evaluate(element => element.classList.contains('active')), true);
      if (['inicio', 'modulos', 'escalas', 'biblioteca', 'projeto'].includes(expected.slice(1))) {
        assert.equal(await mobileCurrent.getAttribute('href'), expected);
      } else assert.equal(await mobileCurrent.count(), 0);
      const title = await page.title(); assert.ok(title.includes('Conhecendo a CTI')); assert.ok(title.length > 'Conhecendo a CTI'.length + 3);
      navSamples.push({route, title, sidebar: await sidebarCurrent.getAttribute('aria-current'), href: expected, mobile: await mobileCurrent.count() ? await mobileCurrent.getAttribute('aria-current') : null});
    }
    assert.ok(new Set(navSamples.map(item => item.title)).size >= 8, 'Document titles must differ by known route.');
    await go('equipamentos'); const topic = page.locator('button.topic-card').first(); const topicName = await topic.locator('h2').textContent(); await topic.click();
    // Opening a local dialog does not alter the route; a direct topic URL must identify that topic.
    await page.keyboard.press('Escape'); await go('equipamentos/' + slug(topicName)); await page.locator('dialog[open]').waitFor();
    assert.ok((await page.title()).includes(topicName)); await page.keyboard.press('Escape');
    const skipRoute = 'glossario'; await go(skipRoute); const before = page.url();
    const skip = page.locator('.skip-link'); assert.equal(await skip.count(), 1);
    assert.equal(await skip.getAttribute('href'), '#conteudo-principal');
    await skip.focus();
    const skipBox = await skip.boundingBox(); assert.ok(skipBox && skipBox.y >= 0 && skipBox.y < 100);
    await page.keyboard.press('Enter');
    await waitFocus('main#conteudo-principal'); assert.equal(page.url(), before);
    assert.equal(await page.locator('main#conteudo-principal').getAttribute('tabindex'), '-1');
    await page.setViewportSize({width: 390, height: 844}); await go('integracao');
    const more=page.locator('.more-learning-tools'); await more.locator('summary').focus(); await page.keyboard.press('Enter'); assert.equal(await more.getAttribute('open'),'');
    assert.equal(await more.locator('nav a').count(),7); assert.equal(await more.locator('a[aria-current=page]').getAttribute('href'),'#integracao');
    await more.locator('a[href="#laboratorio"]').click(); await page.getByRole('heading',{name:'Laboratório de anotações',exact:true}).waitFor(); assert.equal(page.url().split('/#')[1],'laboratorio');
    await go('inicio'); await skip.focus();
    const skipPath = '/tmp/cti-family-skip-mobile.png'; await page.screenshot({path: skipPath}); output.screenshots.push(skipPath);
    await page.keyboard.press('Enter'); await waitFocus('main#conteudo-principal');
    return {navSamples, skipFocus: await active(), skipRoutePreserved: true};
  });

  await check('Audited text pairs meet4.5 contrast and quiz/book form controls use16px text', async () => {
    await page.setViewportSize({width: 1440, height: 1000});
    const samples = [];
    await go('inicio');
    samples.push(...await computedSamples('.module-card>p,.sidebar-caption,.breadcrumb,.section-heading p,footer p,footer>span', 'home'));
    await go('registros'); samples.push(...await computedSamples('.page-description', 'page-description'));
    await go('primeiro-dia'); samples.push(...await computedSamples('.starter-source,.starter-review', 'checklist'));
    await go('glossario'); samples.push(...await computedSamples('.starter-results,.starter-review', 'glossary'));
    await glossaryField().fill('NPT'); samples.push(...await computedSamples('.starter-term-source', 'updated-source'));
    await go('quiz'); samples.push(...await computedSamples('.quiz-intro,.quiz-meta,.filter', 'quiz'));
    const formFonts = [{route: 'quiz', font: await page.locator('.quiz select').evaluate(element => parseFloat(getComputedStyle(element).fontSize))}];
    await page.locator('.quiz .answer').first().click(); samples.push(...await computedSamples('.quiz-answer-state', 'quiz-answer-states'));
    for (const [route, selector] of [['perfil','.profile-chooser p,.profile-chooser strong'], ['integracao','.integration-review strong,.integration-storage,.integration-source'], ['laboratorio','.lab-hint,.lab-tag,.lab-privacy p'], ['cti-virtual','.virtual-context p,.virtual-review'], ['avaliacao-pbl','.preparation-small,.feedback-count'], ['demonstracao','.demo-step-number,.demo-purpose'], ['conteudos','.content-review p,.content-catalog-list>li>div>span'], ['acolher-familia','.family-welcome-intro p,.family-audience-note,.family-review-status p,.family-guidance-card p,.family-guidance-card blockquote']]) {
      await go(route); samples.push(...await computedSamples(selector, route));
      const values=await page.locator('main input:not([type=checkbox]),main textarea,main select,.profile-compact select').evaluateAll(elements=>elements.map(element=>({label:element.getAttribute('aria-label')||element.closest('label')?.textContent?.trim().slice(0,90)||element.tagName,font:parseFloat(getComputedStyle(element).fontSize)})));
      formFonts.push(...values.map(value=>({route,...value})));
    }
    await go('caderno'); await page.locator('.book-counter').waitFor();
    formFonts.push({route: 'caderno', font: await page.getByRole('spinbutton', {name: 'Ir para página', exact: true}).evaluate(element => parseFloat(getComputedStyle(element).fontSize))});
    samples.push(...await computedSamples('.book-text summary,.book-counter', 'book'));
    assert.ok(samples.length > 20, 'Every audited text group should be represented.');
    const failing = samples.filter(item => item.ratio < 4.5);
    output.contrasts = samples;
    assert.deepEqual(failing, [], 'Audited normal text must meet4.5:1.');
    for (const item of formFonts) assert.ok(item.font >= 16, `${item.route} input font ${item.font}`);
    return {samples: samples.length, minimumContrast: Math.min(...samples.map(item => item.ratio)), formFonts};
  });

  await check('Four educational scale guides retain keyboard navigation,references and no patient/scoring inputs', async () => {
    await go('escalas'); const tabs = page.getByRole('tab'); assert.equal(await tabs.count(), 4);
    await tabs.first().focus(); await page.keyboard.press('End'); assert.equal(await tabs.nth(3).getAttribute('aria-selected'), 'true');
    await page.keyboard.press('Home'); assert.equal(await tabs.first().getAttribute('aria-selected'), 'true');
    await page.keyboard.press('ArrowRight'); assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true');
    const destinations = [
      ['eva', 'EVA', 'Dor'],
      ['eva-escala-visual-analogica', 'EVA', 'Dor'],
      ['bps', 'BPS', 'Dor'],
      ['bps-behavioral-pain-scale', 'BPS', 'Dor'],
      ['painad', 'PAINAD', 'Dor'],
      ['rass', 'RASS', 'Sedação e agitação'],
    ];
    for (const [target, selected, purpose] of destinations) {
      await go('escalas/' + target); const selectedTab = page.getByRole('tab', {selected: true});
      assert.equal(await selectedTab.count(), 1);
      assert.match(await selectedTab.textContent(), new RegExp(selected));
      assert.equal(await page.locator('.scale-purpose-guide').getByRole('button', {name: purpose, exact: true}).getAttribute('aria-pressed'), 'true');
      assert.ok(await page.locator('.scales-tabpanel:not([hidden]) .scales-sources a').count() > 0);
      assert.equal(await page.locator('.scales-guide input,.scales-guide textarea').count(), 0);
    }
    return {canonicalScaleRoutes: 4, preservedLongAliases: 2, correctPurposes: true};
  });

  await check('Scale purpose selector organizes pain, sedation and consciousness without patient scoring or decisions', async () => {
    await go('escalas'); const guide=page.locator('.scale-purpose-guide'); await guide.waitFor();
    assert.match(await guide.textContent(),/não avalia pacientes nem decide condutas/);
    await guide.getByRole('button',{name:'Dor',exact:true}).click(); assert.equal(await page.getByRole('tab').count(),3);
    assert.equal(await guide.getByRole('button',{name:'Dor',exact:true}).getAttribute('aria-pressed'),'true');
    await guide.getByRole('button',{name:'Sedação e agitação',exact:true}).click(); assert.equal(await page.getByRole('tab').count(),1);
    assert.match(await page.getByRole('tab').textContent(),/RASS/);
    await guide.getByRole('button',{name:'Nível de consciência',exact:true}).click(); assert.equal(await page.getByRole('tab').count(),0);
    assert.equal(await page.locator('.glasgow-introduction').count(),1); assert.match(await page.locator('.glasgow-introduction').textContent(),/Não há cálculo de pontuação/);
    assert.equal(await guide.locator('input,textarea,select').count(),0);
    await guide.getByRole('button',{name:'Todas as finalidades',exact:true}).click(); assert.equal(await page.getByRole('tab').count(),4);
    await go('escalas/rass'); await guide.getByRole('button',{name:'Dor',exact:true}).click(); await page.getByRole('button',{name:'Consultar RASS',exact:true}).click(); await sleep(100);
    assert.match(await page.getByRole('tab',{selected:true}).textContent(),/RASS/);
    await go('escalas/eva'); await guide.getByRole('button',{name:'Sedação e agitação',exact:true}).click(); await page.getByRole('button',{name:'Consultar EVA',exact:true}).click(); await sleep(100);
    assert.match(await page.getByRole('tab',{selected:true}).textContent(),/EVA/);
    await go('escalas'); const glasgowLink=page.locator('.glasgow-introduction .institutional-link');
    for(let attempt=0;attempt<2;attempt++) {await glasgowLink.click(); await page.locator('dialog[open] #detail-title').waitFor(); await page.keyboard.press('Escape'); await page.locator('dialog[open]').waitFor({state:'detached'});}
    const path='/tmp/cti-family-scales-mobile.png'; await page.screenshot({path}); output.screenshots.push(path);
    return {purposes:3,originalGuides:4,glasgowIntro:true,patientInputs:0};
  });

    await check('Family module integrates a ninth home card and five accessible learning sections without patient fields', async () => {
    await go('inicio');
    const card = page.locator('.module-card[href="#acolher-familia"]');
    assert.equal(await card.count(), 1);
    assert.equal(await card.locator('h3').textContent(), 'Acolher também é cuidar');
    assert.match(await card.textContent(), /Aprenda a acolher familiares e promover uma assistência humanizada e segura/);
    assert.ok(await card.locator('svg').count() >= 1);
    await card.click(); await page.locator('.family-welcome').waitFor();
    const family = page.locator('.family-welcome');
    assert.match(await family.textContent(), /A família faz parte do cuidado/);
    assert.match(await family.textContent(), /educativ|valida|supervis/i);
    const tabs = family.getByRole('tab');
    assert.equal(await tabs.count(), 5);
    const titles = await tabs.allTextContents();
    await tabs.first().focus(); await page.keyboard.press('End');
    assert.equal(await tabs.nth(4).getAttribute('aria-selected'), 'true');
    assert.equal(await focusIs(tabs.nth(4)), true);
    await page.keyboard.press('Home'); assert.equal(await tabs.first().getAttribute('aria-selected'), 'true');
    await page.keyboard.press('ArrowRight'); assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true');
    for (const [index, section] of ['acolhimento','visitante','falas','simulador','material'].entries()) {
      await go('acolher-familia/' + section); await family.waitFor();
      assert.equal(await family.getByRole('tab', {selected:true}).count(), 1);
      assert.equal(await family.getByRole('tab', {selected:true}).textContent(), titles[index]);
      const selectedId = await family.getByRole('tab', {selected:true}).getAttribute('id');
      assert.equal(await family.getByRole('tabpanel').getAttribute('aria-labelledby'), selectedId);
      assert.ok((await family.getByRole('tabpanel').textContent()).length > 100);
    }
    assert.equal(await family.locator('textarea,input[type=text],input[type=email],input[type=tel],input[type=password],iframe,object,embed').count(), 0);
    await go('acolher-familia/secao-inexistente'); assert.equal(await family.getByRole('tab').first().getAttribute('aria-selected'),'true');
    await go('acolher-familia/simulador?caso=caso-inexistente'); assert.equal(await page.locator('.family-simulator option:checked').textContent(),await page.locator('.family-simulator option').first().textContent());
    await go('acolher-familia/visitante');
    const visiting = await family.textContent();
    assert.match(visiting, /CTI Cardio/);
    assert.match(visiting, /um visitante por vez/i);
    assert.match(visiting, /confirm|relat|pendente/i);
    assert.match(visiting, /água|sabonete|preparação alcoólica/i);
    const path='/tmp/cti-family-module-mobile.png'; await page.screenshot({path}); output.screenshots.push(path);
    return {homeCard:1, sections:5,titles,patientDataFields:0,localRuleIsPending:true};
  });

  await check('Eight expandable communication examples show recommended and avoided expressions with explanations', async () => {
    await go('acolher-familia/falas');
    const cards=page.locator('.family-communication details');
    assert.equal(await cards.count(),8);
    const titles=[];
    for(let index=0;index<8;index++) {
      const item=cards.nth(index); const summary=item.locator('summary'); titles.push((await summary.textContent()).trim());
      await summary.focus(); await page.keyboard.press('Enter'); assert.equal(await item.getAttribute('open'),'');
      const text=await item.textContent();
      assert.equal(await item.getByRole('heading',{name:'Uma forma de acolher',exact:true}).count(),1); assert.equal(await item.getByRole('heading',{name:'O que evitar',exact:true}).count(),1);
      assert.ok(text.length>180);
      assert.equal(await focusIs(summary),true);
      await page.keyboard.press('Enter'); assert.equal(await item.getAttribute('open'),null);
    }
    return {situations:8,titles};
  });

  await check('Eight fictional communication cases expose feedback for all24 choices and retain memory-only progress', async () => {
    const {communicationCases}=await import(new URL('file://'+repo+'/src/family-welcome.ts').href);
    assert.equal(communicationCases.length,8);
    await go('acolher-familia/simulador');
    const simulator=page.locator('.family-simulator');
    const select=simulator.getByRole('combobox',{name:'Escolha uma situação fictícia',exact:true});
    assert.equal(await select.locator('option').count(),8);
    const storageBefore=await page.evaluate(()=>JSON.stringify({local:{...localStorage},session:{...sessionStorage}}));
    const tested=[];
    for(const scenario of communicationCases) {
      await go('acolher-familia/simulador?caso='+scenario.id);
      await page.waitForFunction(id=>document.querySelector('.family-simulator select')?.value===id,scenario.id);
      assert.match(await simulator.textContent(),new RegExp(scenario.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
      for(let option=0;option<3;option++) {
        if(await simulator.locator('.family-sim-feedback').count()) await simulator.getByRole('button',{name:'Tentar novamente',exact:true}).click();
        assert.equal(await simulator.locator('.family-sim-option').count(),3);
        const choice=simulator.locator('.family-sim-option').nth(option);
        await choice.focus(); await page.keyboard.press('Enter');
        const feedback=simulator.locator('.family-sim-feedback'); await feedback.waitFor();
        assert.equal(await feedback.getAttribute('role'),'status');
        assert.equal(await feedback.getAttribute('tabindex'),'-1'); await waitFocus('.family-sim-feedback');
        const text=await feedback.textContent();
        assert.ok(text.includes(scenario.options[option].feedback));
        assert.ok(text.includes(scenario.explanation));
        assert.ok(text.length>120);
        await page.keyboard.press('Tab'); assert.equal(await focusIs(simulator.locator('.family-sim-next')),true);
        assert.equal(await simulator.locator('.family-sim-option:not(:disabled)').count(),0);
        tested.push({id:scenario.id,option,expected:scenario.answer===option});
      }
      await simulator.getByRole('button',{name:'Tentar novamente',exact:true}).click();
      assert.equal(await simulator.locator('.family-sim-feedback').count(),0);
      assert.equal(await simulator.locator('.family-sim-option:disabled').count(),0);
    }
    assert.equal(await page.evaluate(()=>JSON.stringify({local:{...localStorage},session:{...sessionStorage}})),storageBefore);
    await go('acolher-familia/simulador?caso='+communicationCases[0].id);
    for(let index=0;index<8;index++) {
      assert.equal(await select.inputValue(),communicationCases[index].id);
      await simulator.locator('.family-sim-option').nth(communicationCases[index].answer).click();
      await simulator.locator('.family-sim-next').click();
    }
    assert.ok(await simulator.getByRole('button',{name:'Reiniciar simulações',exact:true}).count());
    assert.match(await simulator.textContent(),/não.*(?:certifica|autoriz|competência)|educativ|supervis/i);
    await simulator.getByRole('button',{name:'Reiniciar simulações',exact:true}).click();
    assert.equal(await select.inputValue(),communicationCases[0].id);
    assert.equal(await simulator.locator('.family-sim-feedback').count(),0);
    await simulator.locator('.family-sim-option').first().click(); await go('inicio'); await go('acolher-familia/simulador');
    assert.equal(await simulator.locator('.family-sim-feedback').count(),0);
    assert.equal(await select.inputValue(),communicationCases[0].id);
    const path='/tmp/cti-family-simulator.png'; await page.screenshot({path}); output.screenshots.push(path);
    return {cases:8,choicesTested:tested.length,tested,progressPersisted:false};
  });

  await check('Family module search, internal section links, favorites and review metadata are reachable', async () => {
    await go('inicio'); const search=page.getByRole('searchbox',{name:'Pesquisar pelo nome ou assunto',exact:true});
    for(const query of ['família','acolher também é cuidar','visitante','comunicação familiar']) {
      await search.fill(query);
      assert.ok(await page.locator('.home-search-list a[href^="#acolher-familia"]').count()>0,query);
      await page.getByRole('button',{name:'Limpar pesquisa',exact:true}).click();
    }
    await go('acolher-familia');
    const favorite=page.locator('.module-heading-row .favorite-button');
    if(await favorite.getAttribute('aria-pressed')==='true') await favorite.click();
    await favorite.click(); await go('favoritos');
    assert.equal(await page.locator('.favorites-list a[href="#acolher-familia"]').count(),1);
    await page.locator('.favorites-list a[href="#acolher-familia"]').click(); await page.locator('.family-welcome').waitFor();
    await go('conteudos'); const catalog=page.locator('.content-catalog');
    await catalog.getByRole('searchbox',{name:'Pesquisar conteúdo',exact:true}).fill('Acolher também é cuidar');
    assert.ok(await catalog.locator('.content-catalog-list>li').count()>=1);
    assert.match(await catalog.textContent(),/Última revisão clínica: não realizada/);
    assert.match(await catalog.textContent(),/Revisão profissional pendente/);
    await catalog.getByRole('combobox',{name:'Situação',exact:true}).selectOption('institutional_validated');
    assert.equal(await catalog.locator('.content-catalog-list>li').count(),0);
    return {queries:4,favoritePreserved:true,falseInstitutionalApproval:false};
  });

  await check('Family leaflet shows four readable A5 panels and offers a real downloadable PDF', async () => {
    await go('acolher-familia/material'); const leaflet=page.locator('.family-leaflet'); await leaflet.waitFor();
    const panels=[];
    for(let number=1;number<=4;number++) {
      await leaflet.locator(`.family-leaflet-pages button[aria-label^="Ver página ${number}:"]`).click();
      const panel=leaflet.locator(`.family-leaflet-preview .family-leaflet-panel[data-page="${number}"]`);
      await panel.waitFor({state:'visible'}); panels.push((await panel.textContent()).trim());
      assert.ok((await panel.textContent()).length>80);
      assert.equal(await leaflet.locator('.family-leaflet-preview .family-leaflet-panel:visible').count(),1);
    }
    assert.match(panels[0],/Bem-vindo à CTI/); assert.match(panels[1],/Sua presença importa/);
    assert.match(panels[2],/Cuidados e segurança/); assert.match(panels[3],/Estamos aqui para orientar/);
    assert.match(panels.join(' '),/Material educativo sujeito à validação institucional/);
    assert.match(panels.join(' '),/não.*(?:ouve|compreend)|não.*(?:afirm|garant)|não.*(?:saber|possível)/i);
    assert.doesNotMatch(panels.join(' '),/um visitante por vez|CTI Cardio/i);
    const download=leaflet.getByRole('link',{name:'Baixar PDF',exact:true}); assert.equal(await download.count(),1);
    const href=await download.getAttribute('href'); assert.match(href,/\.pdf$/);
    const response=await fetch(origin+href); assert.ok(response.ok); assert.equal(response.headers.get('content-type'),'application/pdf');
    const data=Buffer.from(await response.arrayBuffer()); assert.equal(data.subarray(0,5).toString(),'%PDF-');
    assert.equal(createHash('sha256').update(data).digest('hex'),createHash('sha256').update(await readFile(repo+'/public'+href)).digest('hex'));
    const promise=page.waitForEvent('download'); await download.click(); const received=await promise;
    await received.saveAs('/tmp/cti-family-leaflet-download.pdf');
    assert.equal(createHash('sha256').update(await readFile('/tmp/cti-family-leaflet-download.pdf')).digest('hex'),createHash('sha256').update(data).digest('hex'));
    const layouts=[];
    for(const width of [320,390,768,1440]) {
      await page.setViewportSize({width,height:1000});
      for(let number=1;number<=4;number++) {
        await leaflet.locator(`.family-leaflet-pages button[aria-label^="Ver página ${number}:"]`).click();
        await noOverflow(`acolher-familia/material/${number}`,width); layouts.push({width,page:number});
      }
    }
    await page.setViewportSize({width:390,height:844});
    const path='/tmp/cti-family-leaflet-preview.png'; await leaflet.screenshot({path}); output.screenshots.push(path);
    return {previewPages:4,downloadBytes:data.length,downloadSha256:createHash('sha256').update(data).digest('hex'),pdfHref:href,layouts};
  });

  await check('Print action isolates the two A4 landscape booklet sides in order4|1 and2|3', async () => {
    await go('acolher-familia/material'); const leaflet=page.locator('.family-leaflet'); await leaflet.waitFor();
    await page.evaluate(()=>{window.__ctiPrintCalls=0;window.print=()=>{window.__ctiPrintCalls+=1;};});
    await leaflet.getByRole('button',{name:'Imprimir',exact:true}).click(); await page.waitForFunction(()=>window.__ctiPrintCalls===1);
    assert.equal(await page.locator('.family-leaflet-print-root').count(),1);
    assert.deepEqual(await page.locator('.family-leaflet-print-sheet').evaluateAll(elements=>elements.map(el=>({side:el.dataset.side,pages:[...el.querySelectorAll('.family-leaflet-panel')].map(panel=>panel.dataset.page)}))),[{side:'frente',pages:['4','1']},{side:'verso',pages:['2','3']}]);
    const path='/tmp/cti-family-browser-printed.pdf';
    try {
    await page.emulateMedia({media:'print'});
    assert.equal(await page.locator('.sidebar').isVisible(),false);
    assert.equal(await page.locator('.mobile-nav').isVisible(),false);
    assert.equal(await page.locator('.topbar').isVisible(),false);
    assert.equal(await page.locator('.family-leaflet-actions').isVisible(),false);
    await page.pdf({path,printBackground:true,preferCSSPageSize:true,displayHeaderFooter:false});
    } finally {
      await page.emulateMedia({media:'screen'});
      await go('inicio');
    }
    const printProof = spawnSync(process.env.CTI_PYTHON || 'python3', ['-c', String.raw`
import fitz, json, re, sys
from pathlib import Path
pdf = fitz.open(sys.argv[1])
source = json.loads(Path(sys.argv[2]).read_text())
assert len(pdf) == 2, f'Expected two A4 faces, received {len(pdf)}'
normalize = lambda text: re.sub(r'\s+', '', text)
order = [[4, 1], [2, 3]]
checks = []
for sheet, numbers in zip(pdf, order):
    dimensions = [sheet.rect.width*25.4/72, sheet.rect.height*25.4/72]
    assert abs(dimensions[0]-297) < .2 and abs(dimensions[1]-210) < .2, dimensions
    for index, number in enumerate(numbers):
        text = normalize(sheet.get_text(clip=fitz.Rect(sheet.rect.width*index/2,0,sheet.rect.width*(index+1)/2,sheet.rect.height)))
        item = source['pages'][number-1]
        expected = [item['title'],source['statusNotice']]+[item[key] for key in ['subtitle','intro','message'] if key in item]
        expected += [value for block in item.get('blocks',[]) for value in [block['title'],block['text']]]
        missing = [value for value in expected if normalize(value) not in text]
        assert not missing, f'Clipped/missing content on panel {number}: {missing}'
        assert 'Seuespaçodeaprendizado' not in text and 'Módulosdeaprendizado' not in text
        checks.append({'panel':number,'allTextPresent':True})
print(json.dumps({'pages':len(pdf),'dimensionsMm':[[round(p.rect.width*25.4/72,2),round(p.rect.height*25.4/72,2)] for p in pdf],'order':order,'panels':checks}))
`, path, repo+'/src/data/family-leaflet.json'], {encoding:'utf8'});
    assert.equal(printProof.status,0,printProof.stderr || printProof.stdout);
    const verifiedPrint=JSON.parse(printProof.stdout);
    await page.emulateMedia({media:'screen'});
    await go('inicio');
    assert.equal(await page.locator('.family-leaflet-print-root').count(),0);
    return {printCalled:true,sheets:2,order:[[4,1],[2,3]],browserPdf:path,verifiedPrint};
  });

  await check('New family sections, communication cases and both leaflet PDFs remain available offline after first load', async () => {
    await page.setViewportSize({width:390,height:844}); await go('inicio');
    await page.evaluate(async()=>{await navigator.serviceWorker.ready;}); await page.reload(); await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);
    await context.setOffline(true); await page.reload(); await page.locator('.home-search').waitFor();
    for(const section of ['acolhimento','visitante','falas','simulador','material']) {
      await go('acolher-familia/'+section); await page.locator('.family-welcome').waitFor();
      assert.equal(await page.getByText('Página não encontrada',{exact:true}).count(),0);
      if(section==='simulador') {await page.locator('.family-sim-option').first().click(); await page.locator('.family-sim-feedback').waitFor();}
      if(section==='material') {
        const download=page.locator('.family-leaflet').getByRole('link',{name:'Baixar PDF',exact:true}); const href=await download.getAttribute('href');
        const offline=await page.evaluate(async href=>{const response=await fetch(href);const bytes=await response.arrayBuffer();return {status:response.status,type:response.headers.get('content-type'),length:bytes.byteLength};},href);
        assert.equal(offline.status,200);assert.equal(offline.type,'application/pdf');assert.ok(offline.length>1000);
        const cached=await page.evaluate(async()=>{const cache=await caches.open([...await caches.keys()].find(key=>key.startsWith('cti-')&&!key.endsWith('-apostilas')));return (await cache.keys()).filter(item=>item.url.includes('/acolher-familia/')&&item.url.endsWith('.pdf')).map(item=>item.url);});
        assert.equal(cached.length,2);
      }
    }
    await context.setOffline(false);
    return {sections:5,offlineSimulator:true,leafletPdfsPrecached:2};
  });


  await check('Mobile and desktop layouts and dialog reflow remain usable at320,390,768 and1440px', async () => {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({width, height: width === 1440 ? 1000 : 844});
      for (const route of ['inicio', 'modulos', ...moduleIds, 'primeiro-dia', 'glossario', 'favoritos', 'caderno', 'projeto', ...newRoutes]) {
        await go(route); if (route === 'caderno') await page.locator('.book-counter').waitFor(); await noOverflow(route, width);
      }
      await go('equipamentos'); await page.locator('button.topic-card').first().click(); await page.locator('dialog[open]').waitFor(); await noOverflow('equipamentos/modal', width); await page.keyboard.press('Escape');
      if (width === 390) { await go('inicio'); const path = '/tmp/cti-family-home-mobile.png'; await page.screenshot({path}); output.screenshots.push(path); }
      if (width === 1440) { await go('projeto'); const path = '/tmp/cti-family-about-desktop.png'; await page.screenshot({path}); output.screenshots.push(path); }
    }
  });

  await check('Blocked storage fails gracefully without user/patient identifiers', async () => {
    const blocked = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
    await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', {get() { throw new DOMException('blocked', 'SecurityError'); }}));
    const p = await blocked.newPage(); const errors = []; p.on('pageerror', error => errors.push(error.message));
    await p.goto(origin + '/#primeiro-dia'); await p.getByRole('checkbox').first().check(); assert.match(await p.locator('.starter-storage').textContent(), /Não foi possível guardar/);
    await p.goto(origin + '/#favoritos'); assert.equal(await p.getByRole('heading', {name: 'Meus favoritos', exact: true}).count(), 1);
    await p.goto(origin + '/#integracao'); await p.locator('.integration-checklist input[type=checkbox]').first().check(); assert.match(await p.locator('.integration-storage').textContent(), /Não foi possível guardar/);
    await p.getByRole('combobox',{name:'Perfil de aprendizagem',exact:true}).selectOption('colaborador'); assert.equal(await p.getByRole('combobox',{name:'Perfil de aprendizagem',exact:true}).inputValue(),'colaborador');
    assert.equal(await p.locator('.profile-compact-warning[role=status]').count(),1); await p.setViewportSize({width:320,height:844});
    const dimensions=await p.evaluate(()=>({root:document.documentElement.scrollWidth,body:document.body.scrollWidth})); assert.ok(dimensions.root<=321&&dimensions.body<=321,JSON.stringify(dimensions));
    assert.deepEqual(errors, []); await blocked.close();
  });

  await check('Final production cache retains internal routes,search,checklist,quiz,cases,scales and book offline', async () => {
    await page.setViewportSize({width: 390, height: 844}); await go('inicio');
    await page.evaluate(async () => { await navigator.serviceWorker.ready; }); await page.reload();
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    assert.ok((await page.evaluate(() => caches.keys())).includes(expectedCache));
    await context.setOffline(true); await page.reload(); await page.getByRole('searchbox', {name: 'Pesquisar pelo nome ou assunto'}).waitFor();
    await go('glossario'); await glossaryField().fill('NPT'); assert.equal(await page.locator('#glossary-npt>p').first().textContent(), 'Nutrição parenteral total');
    await go('primeiro-dia'); await page.getByRole('checkbox').first().check();
    await go('quiz'); await page.locator('.case-option').first().click(); await page.getByRole('button', {name: 'Continuar o caso', exact: true}).click();
    await page.locator('.quiz .answer').first().click(); await page.getByRole('button', {name: 'Próxima questão', exact: true}).click();
    await go('escalas/rass'); assert.equal(await page.getByRole('tab', {selected: true}).count(), 1);
    await go('caderno'); await page.locator('.book-counter').waitFor(); await page.locator('.book-slide[aria-hidden="false"] .book-page-image.is-ready').waitFor();
    assert.equal(await page.locator('.book-slide').count(), 96);
    for (const route of newRoutes) { await go(route); assert.equal(await page.getByText('Página não encontrada', {exact:true}).count(),0); }
    await go('laboratorio'); await page.getByRole('textbox',{name:'Sua anotação do cenário fictício',exact:true}).fill('Prática fictícia local.'); await page.getByRole('button',{name:'Conferir meu texto',exact:true}).click(); await page.locator('.lab-review').waitFor();
    await go('cti-virtual'); await page.locator('.virtual-box-station').first().click(); await page.locator('.virtual-cti-dialog[open]').waitFor(); await page.keyboard.press('Escape');
    await context.setOffline(false);
  });

  await check('All seven original PDFs and the96-page book source remain byte-identical to the approved baseline', async () => {
    const entries = [
      {href: '/materiais/caderno-cti-adulto-digital.pdf', sha256: 'a972f44330d1149e06eec607bc39ce314fb607e3d07f7c3c271864459107a0c8'},
      {href: '/materiais/caderno-cti-adulto-bolso-a4.pdf', sha256: '5cd9aa49767881706da4af5d6dc58ac09c95473915e56cba262a9d2cb94e9dd6'},
      ...JSON.parse(await readFile(repo + '/public/materiais/apostilas/integridade.json', 'utf8')).materials
    ];
    for (const entry of entries) {
      assert.equal(createHash('sha256').update(await readFile(repo + '/public' + entry.href)).digest('hex'), entry.sha256);
      assert.equal(createHash('sha256').update(await readFile(repo + '/dist' + entry.href)).digest('hex'), entry.sha256);
    }
    const manifest = JSON.parse(await readFile(repo + '/public/caderno/paginas.json', 'utf8'));
    assert.equal(manifest.pageCount, 96); assert.equal(manifest.sourceSha256, entries[0].sha256);
    return {pdfs: entries.length, bookPages: manifest.pageCount};
  });

  assert.deepEqual(output.errors,[], 'No uncaught application runtime errors.');
  output.cspViolations=await page.evaluate(()=>window.__ctiCspViolations); assert.deepEqual(output.cspViolations,[]); assert.ok(!(output.consoleErrors??[]).some(error=>/content security|content-security|refused to|violates.*policy/i.test(error)), 'No CSP violations reported in console.');
  output.requestMethods=[...new Set(requestTrace.map(request=>request.method))];
  assert.ok(requestTrace.every(request=>['GET','HEAD'].includes(request.method)), 'No exercise or feedback submission is made.');
  output.externalRequests = allRequests.filter(url => /^https?:/.test(url) && !url.startsWith(origin));
  assert.deepEqual(output.externalRequests, []);
  output.routes = [...new Set(output.routes)];
  output.status = output.failures.length ? 'has-failures' : 'completed';
} catch (error) {
  output.failures.push({name: 'setup/finalization', message: error.message, stack: error.stack}); output.status = 'incomplete';
} finally {
  await context?.close().catch(() => {}); await browser?.close().catch(() => {}); server?.kill();
  await writeFile('/tmp/cti-family-browser.json', JSON.stringify(output, null, 2));
  console.log(JSON.stringify({status: output.status, groups: output.checks.length, failures: output.failures, errors: output.errors, warnings: output.warnings, uniqueDestinations: output.routes.length, evidence: '/tmp/cti-family-browser.json'}, null, 2));
  if (output.failures.length) process.exitCode = 1;
}
