import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    // Screenshot Dashboard
    await page.goto('http://localhost:5181/');
    await page.waitForTimeout(1000); // Wait for animations
    await page.screenshot({ path: 'screenshots/dashboard.png', fullPage: false });
    console.log('Captured: Dashboard');

    // Screenshot Property Hub
    await page.goto('http://localhost:5181/properties');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/properties.png', fullPage: false });
    console.log('Captured: Property Hub');

    // Screenshot a Property Profile (click View button on first row)
    const viewBtn = page.locator('button:has-text("View")').first();
    if (await viewBtn.count() > 0) {
        await viewBtn.click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'screenshots/property-profile.png', fullPage: false });
        console.log('Captured: Property Profile');
    } else {
        console.log('Skipped: Property Profile (no View button found)');
    }

    await browser.close();
    console.log('Done! Screenshots saved to /screenshots/');
})();
