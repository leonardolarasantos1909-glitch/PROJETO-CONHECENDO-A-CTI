import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("cti-install-hint-v1", "shown");
  });
});
test("início, identidade, menu e rotas diretas", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/CTI Conecta/);
  await expect(
    page.getByText("Sua jornada de aprendizado", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText("Selecione seu perfil", { exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Calculadora", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Cálculo", exact: true })
    .selectOption("drip");
  await page.getByLabel("Volume (mL)", { exact: true }).fill("500");
  await page.getByLabel("Tempo", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Calcular", exact: true }).click();
  await expect(page.locator("output")).toContainText("83,333");
  await page.getByRole("button", { name: "Fechar calculadora" }).click();
  await page.getByRole("button", { name: "Calculadora", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Cálculo", exact: true })
    .selectOption("drip");
  await expect(page.getByLabel("Volume (mL)", { exact: true })).toHaveValue("");
  await page.keyboard.press("Escape");
  for (const [route, title] of [
    ["clinica", "Enciclopédia clínica"],
    ["diluicao", "Tabela institucional de diluição"],
    ["integracao", "Checklist de integração"],
    ["cti-virtual", "CTI virtual educativo"],
    ["projeto", "Conhecimento que aproxima."],
  ]) {
    await page.goto(`/#${route}`);
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await page.goto("/" + route);
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
  }
});
test("favoritos, checklists, busca e armazenamento bloqueado", async ({
  page,
}) => {
  await page.goto("/#integracao");
  const check = page.getByRole("checkbox").first();
  await check.check();
  await page.reload();
  await expect(check).toBeChecked();
  await page.goto("/#primeiro-dia");
  const first = page.getByRole("checkbox").first();
  await first.check();
  await page.reload();
  await expect(first).toBeChecked();
  await page.goto("/");
  await page
    .getByRole("button", { name: /Adicionar aos favoritos:/ })
    .first()
    .click();
  await page.goto("/#favoritos");
  await expect(
    page.getByRole("button", { name: /Remover dos favoritos:/ }).first(),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: /Remover dos favoritos:/ }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Meus favoritos", exact: true }),
  ).toBeVisible();
  await page.goto("/");
  await page.getByRole("searchbox").first().fill("RASS");
  await expect(page.getByText(/resultado.*encontrado/).first()).toBeVisible();
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("blocked");
      },
    });
  });
  await page.goto("/#integracao");
  await page.getByRole("checkbox").first().check();
  await expect(page.getByRole("checkbox").first()).toBeChecked();
});
test("registro de RCP e nova sessão preservam histórico", async ({ page }) => {
  await page.goto("/#rcp");
  await page
    .getByRole("button", { name: "Iniciar deslocamento", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Cheguei — iniciar compressões", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Pausar compressões", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Retomar compressões", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Registrar choque", exact: false })
    .click();
  await page
    .getByRole("button", { name: "Encerrar sessão", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Gerar relatório", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Iniciar nova RCP", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Iniciar deslocamento", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Relatório de/ })).toHaveCount(
    1,
  );
});
test("PDF real, navegação, zoom e download", async ({ page }) => {
  await page.goto("/#biblioteca");
  const link = page.locator('a[href^="#pdf/"]').first();
  const href = await link.getAttribute("href");
  expect(href).toBeTruthy();
  await link.click();
  await expect(page.locator("canvas")).toBeVisible();
  await expect(
    page.getByText("Carregando página…", { exact: true }),
  ).toHaveCount(0, { timeout: 30000 });
  await expect(page.locator(".mobile-nav")).toBeHidden();
  await page.getByRole("button", { name: "Próxima", exact: true }).click();
  await expect(page.getByLabel("Página do PDF")).toHaveValue("2");
  await page.locator(".pdf-canvas").evaluate((el) => {
    const start = new Touch({
      identifier: 1,
      target: el,
      clientX: 280,
      clientY: 200,
    });
    el.dispatchEvent(
      new TouchEvent("touchstart", { bubbles: true, touches: [start] }),
    );
    const end = new Touch({
      identifier: 1,
      target: el,
      clientX: 80,
      clientY: 205,
    });
    el.dispatchEvent(
      new TouchEvent("touchend", { bubbles: true, changedTouches: [end] }),
    );
  });
  await expect(page.getByLabel("Página do PDF")).toHaveValue("3");
  await page.getByRole("button", { name: "Aumentar zoom" }).click();
  await expect(page.getByText("125%", { exact: true })).toBeVisible();
  await page.getByRole("searchbox", { name: "Buscar no PDF" }).fill("CTI");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();
  await expect(page.locator('.pdf-controls [role="status"]')).toContainText(
    /páginas encontradas/,
    {
      timeout: 30000,
    },
  );
  await expect(
    page.getByRole("button", { name: /^p\. / }).first(),
  ).toBeVisible();
  const file = page.getByRole("link", { name: "Baixar PDF", exact: true });
  const response = await page.request.get((await file.getAttribute("href"))!);
  expect(response.status()).toBe(200);
  expect((await response.body()).subarray(0, 4).toString()).toBe("%PDF");
  await page.reload();
  await expect(page.locator("canvas")).toBeVisible();
});

test("migra somente perfil legado e preserva os dados existentes", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("cti-profile", "estagiario");
    localStorage.setItem("cti-visited", '["acolhimento"]');
  });
  await page.goto("/");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("cti-profile")))
    .toBe(null);
  expect(await page.evaluate(() => localStorage.getItem("cti-visited"))).toBe(
    '["acolhimento"]',
  );
  await page.goto("/#escalas");
  await expect(page.getByRole("tab", { name: /RASS/ })).toBeVisible();
  await page.getByRole("tab", { name: /RASS/ }).click();
  await expect(page.getByRole("tabpanel")).toContainText("RASS");
});
