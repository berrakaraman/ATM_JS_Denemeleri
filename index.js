const express = require("express");
const app = express();
const database = require("./database");
database.connector();

app.use(express.json({ limit: 100000000 })); //gelen istekleri Json olarak ayırır
app.use(express.urlencoded({ extended: false })); // şifreleme yapar

app.get("/hello", (req, res) => {
  res.send("Hello, World!");
});

app.post("/register", (req, res) => {
  const newPersonel = {
    user_id: "1",
    name: req.body.name,
    surname: req.body.surname,
    age: req.body.age,
    email: req.body.email,
    password: req.body.password,
    role: "Personel",
  };
  new database.CRUD("Ibank", "personel").insert(newPersonel);
  return res.json(newPersonel);
});
app.post("/registerC", (req, res) => {
  const newCustomer = {
    user_id: "2",
    name: req.body.name,
    surname: req.body.surname,
    age: req.body.age,
    email: req.body.email,
    password: req.body.password,
    maaş: req.body.password,
    güncelbakiye: req.body.bakiye,
    role: "Müşteri",
  };
  new database.CRUD("Ibank", "customer").insert(newCustomer);
  return res.json(newCustomer);
});

const PORT = process.env.PORT || 3000; // varsayılan olarak 3000 portunu kullan
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
