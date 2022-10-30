const axios = require("axios");
const config = require("../config.json");

setInterval(async () => {
  try {
    const response = await axios.get("http://65.2.176.36:3000/health");
    if (response.data.message == "GREEN 🟩") {
      let message = "Price API - GREEN 🟩";
      await axios.post(
        `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage?chat_id=${config.telegramChatId}&text=${message}&parse_mode=html`
      );
    } else {
      let message = "Price API - RED 🟥";
      await axios.post(
        `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage?chat_id=${config.telegramChatId}&text=${message}&parse_mode=html`
      );
    }
  } catch (error) {
    let message = "Price API - RED 🟥";
    await axios.post(
      `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage?chat_id=${config.telegramChatId}&text=${message}&parse_mode=html`
    );
  }
}, config.alertInterval);
