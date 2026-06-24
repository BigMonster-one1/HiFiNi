import { chromium } from "playwright";

const URL = "https://www.hifini.net/sg_sign.htm";

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

(async () => {
  log("Launching browser...");

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();

  try {
    log("Opening check-in page...");
    await page.goto(URL, { waitUntil: "networkidle" });

    const html = await page.content();

    if (html.includes("签到成功")) {
      log("✅ Check-in successful!");
    } else if (html.includes("已经签到")) {
      log("⚠️ Already checked in today.");
    } else if (html.includes("_guard/auto.js")) {
      log("⚠️ Blocked by anti-bot guard (unexpected in Playwright)");
    } else {
      log("❓ Unknown response:");
      log(html.slice(0, 300));
    }

  } catch (err) {
    log("❌ Error: " + err.message);
  }

  await browser.close();
  log("Done.");
})();