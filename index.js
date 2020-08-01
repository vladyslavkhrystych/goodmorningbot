const { Telegraf } = require("telegraf");
const axios = require("axios");
var cron = require("node-cron");

const token = "1114449845:AAEru3S7ZO_sZssM9BQ_3FX9UgkMhwFlUv8";
const openWeatherToken = "e4be0cd4a75788a1cee38dbb08118871";
const dtfToken = `e10b25296d83657a4ccf1261f30df34f009d5e59de3682f6419c2233e773a190`;

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

const getWeather = () => {
  return axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=Kyiv&units=metric&appid=${openWeatherToken}`
    )
    .then(({ data }) => {
      const message = `
*Погода* 

${data.weather[0].description}
Температура: ${Math.floor(data.main.temp)}
Ощущается как: ${Math.floor(data.main.feels_like)}
Влажность: ${data.main.humidity}%
`;

      // console.log(message);

      return message;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};

const getNews = () => {
  return axios
    .get(`https://api.dtf.ru/v1.9/timeline/index/popular?count=3`, {
      headers: { "X-Device-Token": dtfToken },
    })
    .then(({ data }) => {
      // console.log(data.result);

      return data.result;
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

const bot = new Telegraf(token);

bot.start((ctx) => {
  ctx.reply(
    "Привет, каждый день в 8 утра я буду присылать тебе три главных новости и прогноз погоды на сегодня. "
  );

  // cron.schedule("0 8 * * *", () => {
  cron.schedule("0 8 * * *", () => {
    const date = new Date();

    let result = `*Доброе утро, кожаный мешок* 👾 \nСегодня ${date.getDate()} ${
      monthesLocale[date.getMonth()]
    } \n`;

    getWeather().then((weather) => {
      result += weather;

      getNews().then((news) => {
        let newsStr = "\nА вот и лучшие материалы с ДТФ на данный момент: \n";

        news.forEach((item) => {
          newsStr += `\n [${item.title}](${item.url})`;
        });

        result += newsStr;

        ctx.replyWithMarkdown(result);
      });
    });
  });
});

bot.launch();
