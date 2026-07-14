import { test, expect } from '@playwright/test';

test.describe('Navbar Alignment', () => {
  test('nav links should be centered inside navbar', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const navbar = page.locator('.navbar');
    const navLinks = page.locator('.nav-links');

    const navbarBox = await navbar.boundingBox();
    const navLinksBox = await navLinks.boundingBox();

    expect(navbarBox).not.toBeNull();
    expect(navLinksBox).not.toBeNull();

    const navbarCenterX =
      navbarBox.x + navbarBox.width / 2;

    const navLinksCenterX =
      navLinksBox.x + navLinksBox.width / 2;

    const difference = Math.abs(
      navbarCenterX - navLinksCenterX
    );

    console.log('Navbar Center:', navbarCenterX);
    console.log('Nav Links Center:', navLinksCenterX);
    console.log('Difference:', difference);

    expect(difference).toBeLessThanOrEqual(10);
  });
});