const { chromium } = require("playwright");
const { createClient } = require("@supabase/supabase-js");
const { configDotenv } = require("dotenv");
configDotenv(".env");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const main = async (request, response) => {
  const searchUrl = request._parsedOriginalUrl.query;
  const url = searchUrl;
  const maxRetries = 6; // Maximum number of retries
  const retryDelay = 5000; // Delay between retries in milliseconds
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    let navigationSuccessful = false;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await page.goto(url, { timeout: 30000 }); // Set timeout to 30 seconds
        navigationSuccessful = true;
        break; // Exit loop if navigation is successful
      } catch (error) {
        if (attempt < maxRetries) {
          await page.waitForTimeout(retryDelay);
        } else {
          throw new Error(
            `Failed to navigate to ${url} after ${maxRetries} attempts`
          );
        }
      }
    }
    if (navigationSuccessful) {
      const articles = await page.$$("ytd-rich-item-renderer");
      for (const article of articles) {
        const articleUrl = await article.$eval(
          "ytd-thumbnail a",
          (el) => el.href
        );
        const title = await article.$eval(
          "#details yt-formatted-string",
          (el) => el.innerText
        );
        const { data } = await supabase
          .from("noticia")
          .select("*")
          .eq("url", articleUrl);
        if (data.length === 0) {
          await supabase.from("noticia").insert({
            title: title,
            content: "",
            url: articleUrl,
            location: "digital_youtube",
            type: "video",
            owner: String(url).split("/")[3],
          });
        }
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
