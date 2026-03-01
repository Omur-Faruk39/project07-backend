var request = require("request");
var options = {
  method: "POST",
  url: "https://api.sms.net.bd/sendsms",
  formData: {
    api_key: "YOUR_API_KEY",
    msg: "Test",
    to: "8801800000000",
  },
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

const axios = require("axios");
const FormData = require("form-data");

const formData = new FormData();
formData.append("name", "api");
formData.append("password", "NS0tI2gFBGiwf6R73Fe3N6isZ9TCK863glBuP3ZF");
formData.append("to", "01700000000");

axios
  .post("https://api.sms.net.bd/sendsms", formData, {
    headers: formData.getHeaders(),
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
