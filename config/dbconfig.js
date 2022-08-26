const mongoose = require("mongoose");
require("dotenv").config();

password = encodeURIComponent(process.env.password);

mongoose.connect(
  `mongodb+srv://Ekart2:${password}@cluster0.jkv3hvc.mongodb.net/?retryWrites=true&w=majority`,
  (err) => {
    if (err) console.log("Error is there",err);
    else {
      console.log("Connected to the Atlas database");
    }
  }
);
