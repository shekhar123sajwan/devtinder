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

//Find user by email

app.get("/feed", async (req, res) => {
  const email = req.body.email;

  try {
    const user = await User.find({ email: email });
    if (user.length == 0) {
      res.status(404).send("User Not Found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/user", async (req, res) => {
  const email = req.body.email;

  try {
    const user = await User.find({ email: email });
    if (user.length == 0) {
      res.status(404).send("User Not Found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const dataObj = req.body;
  const ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "password",
    "gender",
    "about",
    "skills",
  ];

  try {
    const isAllowed = Object.keys(dataObj).every((val) =>
      ALLOWED_FIELDS.includes(val)
    );
    if (!isAllowed) {
      res.status(400).send("fields not allowed to update");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, dataObj, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete({ _id: userId });
    res.send("User Deleted").status(200);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

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
