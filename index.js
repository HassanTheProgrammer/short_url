const express = require("express");

const { connectToMongoDB } = require("./connect");
const URLRoute = require("./routes/URL");
const URL = require("./models/URL");
const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("==> MONGO_DB CONNECTED"))
  .catch(() => console.log("==> MONGO_DB CONNECTION ERROR <=="));

app.use(express.json());

app.use("/url", URLRoute);
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`==> SERVER STARTED ON PORT ${PORT}`));
