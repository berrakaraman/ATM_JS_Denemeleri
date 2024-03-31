const express = require("express");
const app = express();
const database = require("./database");
database.connector();

app.get("/hello", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000; // varsayılan olarak 3000 portunu kullan
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
