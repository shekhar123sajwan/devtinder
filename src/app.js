const express = require("express");
const app = express();

const dbConnection = require("./config/database");
const { mongoose } = require("mongoose");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

dbConnection();

app.use(cookieParser());
app.use(express.json());

app.use("/", authRouter);
app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/sendConnectionRequest", requestRouter);

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

// app.use("^/$|/index(.html)?", rootRoutes);

app.all("*", (req, res) => {
  res.send("404");
});

mongoose.connection.on("open", () => {
  console.log("Connected TO DB");
  app.listen(3000, () => {
    console.log("Server listening port 3000");
  });
});
