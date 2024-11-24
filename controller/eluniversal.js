const url = "https://www.elnacional.com/politica/";
const { chromium } = require("playwright");
const { createClient } = require("@supabase/supabase-js");
const { configDotenv } = require("dotenv");
configDotenv(".env");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const main = async (request, response) => {
  const maxRetries = 3; // Maximum number of retries
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
      const articles = await page.$$(".article");
      for (const article of articles) {
        const articleUrl = await article.$eval(".title a", (el) => el.href);
        if (articleUrl) {
          const newPage = await browser.newPage();
          let articleNavigationSuccessful = false;
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
              await newPage.goto(articleUrl, { timeout: 60000 });
              articleNavigationSuccessful = true;
              break;
            } catch (error) {
              if (attempt < maxRetries) {
                await newPage.waitForTimeout(retryDelay);
              } else {
                console.log(
                  `Failed to navigate to article ${articleUrl} after ${maxRetries} attempts`
                );
              }
            }
          }

          if (articleNavigationSuccessful) {
            const title = await newPage.$eval(
              ".title h1",
              (element) => element.innerText
            );
            const content = await newPage.$$eval(
              ".title .extract",
              (elements) => elements.map((el) => el.innerText).join("\n")
            );
            const { data } = await supabase
              .from("noticia")
              .select("*")
              .eq("url", articleUrl);
            if (data.length === 0) {
              await supabase.from("noticia").insert({
                title: title,
                content: content,
                url: articleUrl,
                location: "dc_caracas",
                type: "article",
              });
            }
          }
          await newPage.close();
        }
      }
    }

    await browser.close();
    const responseTemplate = {
      ok:true,
      message: "Thank you for helping me to collect news about my country.",
    };
    response.send({
      statusCode: 200,
      body: JSON.stringify(responseTemplate),
    })
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
