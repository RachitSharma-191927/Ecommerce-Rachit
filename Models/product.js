var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
  name: String,
  image: String,
  mrp: Number,
  category: String,
  price: Number,
  disc_perc: Number,
  discount: Number,
  category: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

productSchema.index({ name: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
