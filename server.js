const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const app = express();
const connectDB = require("./db/connect");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

connectDB(process.env.MONGO_URI);
app.listen(port, console.log(`server is listening on port ${port}...`));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  if(!req.body.shortUrl)
    await ShortUrl.create({ full: req.body.fullUrl, short: req.body.shortUrl });
  else 
    await ShortUrl.create({ full: req.body.fullUrl })
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});
