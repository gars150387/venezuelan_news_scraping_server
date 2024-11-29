const url = "https://elperiodicodeoccidente.com/portuguesa";
const { chromium } = require("playwright");
const { createClient } = require("@supabase/supabase-js");
const { configDotenv } = require("dotenv");
configDotenv(".env");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const main = async (request, response) => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });
    const articles = await page.$$(".post");
    for (const article of articles) {
      const url = await article.$eval(".column h2 a", (el) => el.href);
      if (url) {
        const new_page = await browser.newPage();
        await new_page.goto(url);

        // Get the title
        const title = await new_page.$eval(
          "header h1",
          (element) => element.innerText
        );
        // Get all paragraph content
        const content = await new_page.$$eval("p", (elements) =>
          elements.map((el) => el.innerText).join("\n")
        );
        const { data } = await supabase
          .from("noticia")
          .select("*")
          .eq("url", url);
        if (data.length === 0) {
          // Optionally insert into Supabase
          return await supabase.from("noticia").insert({
            title: title,
            content: content,
            url: url,
            location: "portuguesa_acarigua",
            type: "article",
            owner:"periodico_occidente",
          });
        }
      } else {
        const ownerFound = "periodico_occidente";
        if (!data[0].owner) {
          await supabase
            .from("noticia")
            .update({
              owner: ownerFound,
              type: "article",
            })
            .eq("url", url);
        } else if (data[0].owner === "") {
          await supabase.from("noticia").update({
            owner: ownerFound,
            type: "article",
          });
        }
      }
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
