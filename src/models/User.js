const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 10,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(val) {
        if (!validMail(val)) {
          throw new Error("Email not vaid");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender Not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png",
    },
    about: {
      type: String,
      default: "This is defaulat about user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const validMail = (mail) => {
  return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(
    mail
  );
};

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    {
      user: user,
    },
    "devtinder",
    { expiresIn: "7D" }
  );
  return token;
};

userSchema.methods.verifyPassword = async function (userPassword) {
  const user = this;
  const password = await bcrypt.compare(userPassword, user.password);
  return password;
};
module.exports = mongoose.model("User", userSchema);
