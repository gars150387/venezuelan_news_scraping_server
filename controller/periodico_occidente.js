const url = "https://elperiodicodeoccidente.com/portuguesa";
const chromium = require("playwright");
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
        console.log("data");
        if (data.length > 0) {
          console.log("Existing data found", data);
          continue;
        } else {
          // Optionally insert into Supabase
          await supabase.from("noticia").insert({
            title: title,
            content: content,
            url: url,
          });
        }
      }
      continue;
    }

    // Close the browser
    await browser.close();
    response.json({
      message: "Thank you for helping me to collect news about my country.",
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "error", error: error });
  }
};

module.exports = main;
