const { Telegraf } = require("telegraf");
const axios = require("axios");

const token = "1114449845:AAEru3S7ZO_sZssM9BQ_3FX9UgkMhwFlUv8";
const openWeatherToken = "e4be0cd4a75788a1cee38dbb08118871";
const dtfToken = `e10b25296d83657a4ccf1261f30df34f009d5e59de3682f6419c2233e773a190`;

const bot = new Telegraf(token);
bot.start((ctx) =>
  ctx.reply(
    "Привет, каждый день в 8 утра я буду присылать тебе три главных новости и прогноз погоды на сегодня. "
  )
);

// axios
//   .get(
//     `https://api.openweathermap.org/data/2.5/weather?q=Kyiv&units=metric&appid=${openWeatherToken}`
//   )
//   .then(function ({ data }) {
//     const message = `
//       Погода: ${data.weather[0].description}

//       Температура: ${Math.floor(data.main.temp)}
//       Ощущается как: ${Math.floor(data.main.feels_like)}

//       Влажность: ${data.main.humidity}%
//     `;

//     console.log(message);
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   })
//   .then(function () {
//     // always executed
//   });

axios
  .get(`https://api.dtf.ru/v1.9/timeline/index/popular?count=3`, {
    headers: { "X-Device-Token": dtfToken },
  })
  .then(function ({ data }) {
    // console.log(data.result);

    data.result.forEach((item) => {
      console.log(item.title);
    });
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });

bot.launch();
