const express = require("express");
const app = express();

// app.get(/[a-z][0-9]{0,9}$/, (req, res) => {
//   res.send({ name: "SHEKHAR" });
// });

app.get("/user/:userId/:name/:password", (req, res) => {
  console.log(req.params);
  res.send("HELLo");
});

app.listen(3000, () => {
  console.log("Server listening port 3000");
});
