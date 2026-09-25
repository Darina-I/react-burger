import { test, expect } from '@playwright/test';

test.describe.serial('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./e2e/har/ingredients.har', {
      url: '**/api/**',
      update: false,
    });

    await page.goto('/');
  });

  test('должен перетаскивать ингредиенты в конструктор (булки)', async ({ page }) => {
    const buns = page.locator('[data-testid="buns-list"]'); //ищем карточки ингредиентов
    await expect(buns.first()).toBeVisible(); //берем первую булку

    const dropZone = page.locator('[data-testid="burger-constructor-drop"]'); //ищем div, куда нужно перетаскивать ингредиенты
    await expect(dropZone).toContainText('Выберите булку'); //проверяет начальное значение

    await buns.first().dragTo(dropZone); //перетаскиваем булку

    await expect(page.locator('[data-testid="constructor-bun-top"]')).toBeVisible(); //проверяем, что встала верхняя булка
    await expect(page.locator('[data-testid="constructor-bun-bottom"]')).toBeVisible(); //проверяем, что встала нижняя булка
  });

  test('должен перетаскивать ингредиенты в конструктор (соусы)', async ({ page }) => {
    const sauces = page.locator('[data-testid="sauces-list"]'); //ищем карточки ингредиентов
    await expect(sauces.first()).toBeVisible(); //берем первую

    const dropZone = page.locator('[data-testid="burger-constructor-drop"]'); //ищем div, куда нужно перетаскивать ингредиенты
    await expect(dropZone).toContainText('Выберите начинку'); //проверяет начальное значение

    await sauces.first().dragTo(dropZone); //перетаскиваем

    await expect(page.locator('[data-testid="constructor-ingredients"]')).toBeVisible(); //проверяем, что ингредиент добавился
  });

  test('должен перетаскивать ингредиенты в конструктор (начинки)', async ({ page }) => {
    const mains = page.locator('[data-testid="mains-list"]'); //ищем карточки ингредиентов
    await expect(mains.first()).toBeVisible(); //берем первую

    const dropZone = page.locator('[data-testid="burger-constructor-drop"]'); //ищем div, куда нужно перетаскивать ингредиенты
    await expect(dropZone).toContainText('Выберите начинку'); //проверяет начальное значение

    await mains.first().dragTo(dropZone); //перетаскиваем

    await expect(
      page.locator('[data-testid="constructor-ingredients"]').first()
    ).toBeVisible(); //проверяем, что ингредиент добавился
  });

  test('открытие модального окна при нажатии на ингредиент в списке', async ({
    page,
  }) => {
    const cards = page.locator('[data-testid="ingredient-card"]');
    await expect(cards.first()).toBeVisible();

    await cards.nth(3).click();

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible();
  });

  test('отображение в модальном окне данных ингредиента', async ({ page }) => {
    const cards = page.locator('[data-testid="ingredient-card"]');
    await expect(cards.first()).toBeVisible();

    const card = cards.nth(3);
    const cardName = await card.locator('[data-testid="ingredient-name"]').textContent();

    await card.click();
    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible();

    await expect(modal).toContainText(cardName || '');
    await expect(modal).toContainText('Калории');
    await expect(modal).toContainText('Белки');
    await expect(modal).toContainText('Жиры');
    await expect(modal).toContainText('Углеводы');
  });
});
