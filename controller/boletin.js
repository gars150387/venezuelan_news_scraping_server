const { chromium } = require("playwright");
const { createClient } = require("@supabase/supabase-js");
const { configDotenv } = require("dotenv");
configDotenv(".env");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const main = async (request, response) => {
  //   const searchUrl = request._parsedOriginalUrl.query
  const url = "https://mariacorinamachado.beehiiv.com/archive";
  const maxRetries = 6; // Maximum number of retries
  const retryDelay = 5000; // Delay between retries in milliseconds
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });
    const articles = await page.$$(
      "div.transparent.h-full.cursor-pointer.overflow-hidden.rounded-lg.flex.flex-col.border"
    );
    for (const article of articles) {
      const newUrl = await article.$eval("a", (el) => el.href);
      const newPage = await browser.newPage();
      await newPage.goto(newUrl, { timeout: 30000 });
      const title = await newPage.$eval("h1", (el) => el.innerText);
      const content = await newPage.$$eval("#content-blocks p", (elements) =>
        elements.map((el) => el.innerText).join("\n")
      );
      console.log("scrapped page content", {
        title: title,
        content: content,
        url: newUrl,
        location: "digital_boletin",
        type: "boletin",
        owner: "maria_corina_boletin",
      });
      const { data } = await supabase
        .from("noticia")
        .select("*")
        .eq("url", newUrl);
      if (data.length === 0) {
        await supabase.from("noticia").insert({
          title: title,
          content: content,
          url: newUrl,
          location: "digital_boletin",
          type: "boletin",
          owner: "maria_corina_boletin",
        });
      }
    }
    await browser.close();
    const responseTemplate = {
      ok: true,
      message: "Thank you for helping me to collect news about my country.",
    };
    response.send({
      statusCode: 200,
      body: JSON.stringify(responseTemplate),
    });
  } catch (error) {
    console.log(error);
    response.send({
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        message: "error",
        error: error.message,
      }),
    });
  }
};
// main();
module.exports = main;
