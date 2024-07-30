const express = require("express");
const cors = require("cors");
const r = require("rethinkdbdash")({
  servers: [
    {
      host: "localhost",
      port: 28015,
    },
  ],
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const list = await r.db("todoList").table("list").run();
    res.status(200).send({
      message: "Fetch başarılı.",
      code: 200,
      payload: list,
    });
  } catch (err) {
    console.error("Fetch sırasında bir hata oluştu:", err);
    res.status(500).send({
      message: "Fetch sırasında bir hata oluştu.",
      code: 500,
      payload: err.message,
    });
  }
});

app.post("/addList", async (req, res) => {
  const { gorev } = req.body;

  if (!gorev) {
    return res.status(400).send({
      message: "Boş bırakılamaz.",
      code: 400,
    });
  }

  try {
    const result = await r.db("todoList").table("list").insert({ gorev }).run();
    res.status(200).send({
      message: "Veri eklendi.",
      code: 200,
      payload: result,
    });
  } catch (err) {
    console.error("Veri eklenirken bir hata oluştu:", err);
    res.status(500).send({
      message: "Veri eklenirken bir hata oluştu.",
      code: 500,
      payload: err.message,
    });
  }
});

app.delete("/deleteList/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await r.db("todoList").table("list").get(id).delete().run();
    if (result.deleted === 1) {
      res.status(200).send({
        message: "Görev başarıyla silindi.",
      });
    } else {
      res.status(404).send({
        message: "Görev bulunamadı.",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Silme sırasında bir hata oluştu.",
      error: err.message,
    });
  }
});

app.put("/updateList/:id", async (req, res) => {
  const { id } = req.params;
  const { gorev } = req.body;
  try {
    const result = await r
      .db("todoList")
      .table("list")
      .get(id)
      .update({ gorev })
      .run();
      
    if (result.replaced === 1) {
      res.status(200).send({
        message: "Görev güncellendi.",
      });
    } else {
      res.status(404).send({
        message: "Görev bulunamadı.",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Güncelleme sırasında bir hata oluştu.",
      error: err.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Sunucu http://localhost:3000 adresinde çalışıyor.");
});
