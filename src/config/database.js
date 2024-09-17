const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://shekhar:VD73Z7078P6AlHFs@cluster0.bca2o.mongodb.net/"
    );
  } catch (err) {
    console.log(err);
  }
};
module.exports = dbConnection;
