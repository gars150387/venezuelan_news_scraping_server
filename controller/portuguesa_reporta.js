const url = "https://portuguesareporta.com/regionales/";
const { chromium } = require("playwright");
const { createClient } = require("@supabase/supabase-js");
const { configDotenv } = require("dotenv");
configDotenv(".env");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const main = async (request, response) => {
  const maxRetries = 6; // Maximum number of retries
  const retryDelay = 5000; // Delay between retries in milliseconds
 try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });
    let navigationSuccessful = false;
    const articles = await page.$$("article");
    for (const article of articles) {
      const url = await article.$eval("a", (el) => el.href);
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
        const new_page = await browser.newPage();
        const titles = await new_page.$eval(
          "header h1",
          (elements) => elements.innerText
        );
        const content = await new_page.$eval(
          "div.entry-content",
          (elements) => elements.innerText
        );
        const { data } = await supabase
          .from("noticia")
          .select("*")
          .eq("url", url);
        if (data.length === 0) {
          // Optionally insert into Supabase
          await supabase.from("noticia").insert({
            title: titles,
            content: content,
            url: url,
            location: "portuguesa_acarigua",
            type: "article",
            owner: "portuguesa_report",
          });
        }
      }
    }
    // Close the browser
    await browser.close();
    const responseTemplate = {
      ok: true,
      message: "Thank you for helping me to collect news about my country.",
    };
    return response.send({
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

module.exports = main;
