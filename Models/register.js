const mongoose = require("mongoose");
var bcrypt = require("bcrypt");
const product = require("./product");
const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  img: {
    type: String,
    default:"Images/AccountImage.png",
  },
  cart:{
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref:product,
            },
            qty: Number
        }
    ],
    cart_total: {type: Number, default: 0},
    discount: {type: Number, default: 0},
    total: {type: Number, default: 0}
},
  orders:[
    {
        type:mongoose.Types.ObjectId,
        ref:"Order",
    }
  ],
});



registerSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

registerSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Register = mongoose.model("Register", registerSchema);
module.exports = Register;