import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();

    // Test at multiple viewport sizes
    const viewports = [
        { name: 'desktop-1920', width: 1920, height: 1080 },
        { name: 'desktop-1440', width: 1440, height: 900 },
        { name: 'laptop-1366', width: 1366, height: 768 },
    ];

    for (const vp of viewports) {
        const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

        // Dashboard - clear localStorage to get fresh layout
        await page.goto('http://localhost:5177/');
        await page.evaluate(() => {
            localStorage.removeItem('solas-dashboard-layout');
            localStorage.removeItem('solas-dashboard-docked');
        });
        await page.reload();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: `screenshots/${vp.name}-dashboard.png`, fullPage: false });
        console.log(`Captured: ${vp.name} Dashboard`);

        // Property Hub
        await page.goto('http://localhost:5177/properties');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `screenshots/${vp.name}-properties.png`, fullPage: false });
        console.log(`Captured: ${vp.name} Property Hub`);

        // Property Profile
        await page.click('table tbody tr:first-child');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `screenshots/${vp.name}-profile.png`, fullPage: false });
        console.log(`Captured: ${vp.name} Property Profile`);

        // Finance page
        await page.goto('http://localhost:5177/finance');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `screenshots/${vp.name}-finance.png`, fullPage: false });
        console.log(`Captured: ${vp.name} Finance`);

        await page.close();
    }

    await browser.close();
    console.log('Done! Multi-viewport screenshots saved.');
})();
