import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";

// Add stealth plugin and adblocker plugin
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

export const htmlToText = async (url: string) => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    // Launch the browser
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

    const result = await page.evaluate(() => {
      const title = document.title.trim();
      const visibleText = document.body.innerText.replace(/\s+/g, " ").trim();
      const images = Array.from(document.querySelectorAll("img"))
        .map((img) => `[src="${img.getAttribute("src")?.split("?")[0] || ""}", alt="${img.getAttribute("alt") || ""}"]`)
        .join(" ");
      return `title:${title};html-content:${visibleText};images:${images};`;
    });

    return result;
  } catch (error) {
    console.log(error);
    return "";
  } finally {
    await browser.close();
  }
};

