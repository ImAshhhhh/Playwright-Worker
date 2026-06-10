import { launch } from "@cloudflare/playwright";

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const target = url.searchParams.get("url");

      if (!target) {
        return new Response(
          JSON.stringify({
            error: "Missing ?url= parameter"
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }

      const browser = await launch(env.MYBROWSER);

      const page = await browser.newPage();

      await page.goto(target, {
        waitUntil: "networkidle"
      });

      const screenshot = await page.screenshot({
        fullPage: true,
        type: "png"
      });

      await browser.close();

      return new Response(screenshot, {
        headers: {
          "Content-Type": "image/png"
        }
      });
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: err.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
  }
};
