const express = require("express");
const app = express();
const rootRoutes = require("./routes/root");
const adminRoute = require("./routes/admin");
const dbConnection = require("./config/database");
const { mongoose } = require("mongoose");
dbConnection();

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
