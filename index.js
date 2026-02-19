const express = require("express");

const app = express();

const a = [
  2, 2, 4, 1, 4, 1, 4, 13, 53, 5, 354, 5, 35, 5, 3, 5, 3, 5, 3, 5, 3, 5, 3, 5,
  3, 5, 3, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3,
];
let count = undefined;
let number = 0;

for (let i = 0; i < a.length; i++) {
  if (a[i] === count) {
    number++;
  } else {
    if (number === 0) {
      count = a[i];
    } else {
      number--;
    }
  }
}

console.log(count);
console.log(number);

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello, World!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
