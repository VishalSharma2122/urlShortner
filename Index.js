const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./Connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./Middleware/Auth");
const URL = require("./Models/Url");
const urlRoute = require("./Routes/Url");
const staticRoute = require("./Routes/StaticRouter");
const userRoute = require("./Routes/User");

const app = express();
const PORT = 8001;

// connect to mongoDb
connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected")
);


//view engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//Routes
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);



app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
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

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));