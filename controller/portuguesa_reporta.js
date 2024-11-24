const url = "https://portuguesareporta.com/regionales/";
const { chromium } = require("playwright");
const { createClient } = require("@supabase/supabase-js");
const { configDotenv } = require("dotenv");
configDotenv(".env");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const main = async (request, response) => {
  try {
    const browser = await chromium.launch({ headless: true }); // Set to false if you want to see the browser window
    const page = await browser.newPage();
    await page.goto(url);
    const articles = await page.$$("article");
    for (const article of articles) {
      const url = await article.$eval("a", (el) => el.href);
      if (url) {
        const new_page = await browser.newPage();
        await new_page.goto(url);
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
          });
        }
      }
      continue;
    }
    // Close the browser
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

module.exports = main;
