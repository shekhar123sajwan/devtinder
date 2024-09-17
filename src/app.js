const express = require("express");
const app = express();
const rootRoutes = require("./routes/root");
const adminRoute = require("./routes/admin");
const dbConnection = require("./config/database");
const { mongoose } = require("mongoose");
const User = require("./models/User");
dbConnection();

app.use(express.json());
app.post("/signup", async (req, res) => {
  const userObj = req.body;
  const user = new User(userObj);
  try {
    await user.save();
    res.status(200).json("success");
  } catch (err) {
    res.status(400).json(err.message);
  }
});

app.use("/admin", adminRoute);

app.use("^/$|/index(.html)?", rootRoutes);

app.all("*", (req, res) => {
  res.send("404");
});

mongoose.connection.on("open", () => {
  console.log("Connected TO DB");
  app.listen(3000, () => {
    console.log("Server listening port 3000");
  });
});
