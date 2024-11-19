const shortid = require("shortid");
const URL = require("../Models/Url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortID = shortid();

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.render("home", {
    id: shortID,
  });
}

module.exports = {
  handleGenerateNewShortURL
};