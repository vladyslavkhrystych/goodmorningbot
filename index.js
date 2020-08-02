const { Telegraf } = require("telegraf");
const cron = require("node-cron");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

const monthesLocale = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const getWeather = async () => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Kyiv&units=metric&appid=${process.env.OPEN_WEATHER_TOKEN}`
  );
  const result = await response.json();

  const message =
    "*Погода*\n" +
    result.weather[0].description +
    "\nТемпература: " +
    Math.floor(result.main.temp) +
    "\nОщущается как: " +
    Math.floor(result.main.feels_like) +
    "\nВлажность: " +
    result.main.humidity +
    "%\n";

  return message;
};

const getNews = async () => {
  const response = await fetch(
    `https://api.dtf.ru/v1.9/timeline/index/popular?count=3`,
    {
      headers: { "X-Device-Token": process.env.DTF_TOKEN },
    }
  );

  const resJson = await response.json();

  return resJson.result;
};

const prepareData = async () => {
  const date = new Date();

  let result = `*Доброе утро, кожаный мешок* 👾 \nСегодня ${date.getDate()} ${
    monthesLocale[date.getMonth()]
  } \n\n`;

  const weather = await getWeather();
  const news = await getNews();

  result += weather;

  let newsStr = "\nА вот и лучшие материалы с ДТФ на утро: \n";

  news.forEach((item) => {
    newsStr += `\n[${item.title || "Нет тайтла"}](${item.url})`;
  });

  result += newsStr;

  return result;
};

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "Привет, каждый день в 8 утра я буду присылать тебе три главных новости и прогноз погоды на сегодня. "
  );

  const cronTiming =
    process.env.MODE === "development" ? "*/10 * * * * *" : "0 8 * * *";

  cron.schedule(cronTiming, async () => {
    const message = await prepareData();

    ctx.replyWithMarkdown(message);
  });
});

bot.launch();
