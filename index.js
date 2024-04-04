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

app.post("/loginP", async (req, res) => {
  checkUser = req.body;
  var check = await new database.CRUD("Ibank", "personel").find({
    $and: [{ email: checkUser.email }, { password: checkUser.password }],
  });
  if (check.length > 0) {
    // Kullanıcı bulundu, başarılı giriş yapabilir
    return res.json({ message: "Başarıyla giriş yapıldı.", user: check.name });
  } else {
    // Kullanıcı bulunamadı, başarısız giriş
    return res.status(401).json({ error: "Giriş bilgileri geçersiz." });
  }
});

app.post("/registerC", (req, res) => {
  const newCustomer = {
    user_id: "2",
    name: req.body.name,
    surname: req.body.surname,
    age: req.body.age,
    email: req.body.email,
    password: req.body.password,
    maaş: req.body.maaş,
    bakiye: req.body.bakiye,
    role: "Müşteri",
  };
  new database.CRUD("Ibank", "customer").insert(newCustomer);
  return res.json(newCustomer);
});

app.post("/bakiyeG", async (req, res) => {
  const { email, password, miktar } = req.body;

  const artanMiktar = miktar > 0 ? miktar : 0;
  const azalanMiktar = miktar < 0 ? -miktar : 0;

  const result = await new database.CRUD("Ibank", "customer").update(
    { email: email, password: password },
    { $inc: { bakiye: artanMiktar - azalanMiktar } }
  );

  if (result.modifiedCount > 0) {
    return res.json("Bakiye güncellendi");
  } else {
    return res.json("Kullanıcı bulunamadı veya bakiye güncellenmedi");
  }
});

app.post("/login", async (req, res) => {
  checkUser = req.body;
  var check = await new database.CRUD("Ibank", "customer").find({
    $and: [{ email: checkUser.email }, { password: checkUser.password }],
  });
  if (check.length > 0) {
    // Kullanıcı bulundu, başarılı giriş yapabilir
    return res.json({ message: "Başarıyla giriş yapıldı.", user: check.name });
  } else {
    // Kullanıcı bulunamadı, başarısız giriş
    return res.status(401).json({ error: "Giriş bilgileri geçersiz." });
  }
});

app.post("/bakiyeSorgu", async (req, res) => {
  const { email, password } = req.body;
  var user = await new database.CRUD("Ibank", "customer").find({
    $and: [{ email: email }, { password: password }],
  });
  return res.json(user[0].bakiye); // find sorgusu dizi döndüğü için
});

app.post("/yenisifre", async (req, res) => {
  const { email, currentpassword, newpassword } = req.body;
  /*var user = await new database.CRUD("Ibank", "customer").find({
    $and: [{ email: email }, { password: currentpassword }],
  });*/

  var result = await new database.CRUD("Ibank", "customer").update(
    { email: email, password: currentpassword },
    { $set: { password: newpassword } }
  );
  if (result.modifiedCount > 0) {
    return res.json("Şifre başarıyla değiştirildi.");
  } else {
    // Güncelleme başarısızsa uygun bir hata mesajı döndürün
    return res
      .status(500)
      .json({ error: "Şifre güncellenirken bir hata oluştu." });
  }
});

const PORT = process.env.PORT || 3000; // varsayılan olarak 3000 portunu kullan
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
