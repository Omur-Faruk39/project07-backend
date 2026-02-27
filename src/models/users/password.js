const db = require("../../config/db.js");

const addPassword = async (data) => {
  db.query("SELECT sum(followerId) FROM followers WHERER userId = ?", data);
};
