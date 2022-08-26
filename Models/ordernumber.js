var mongoose = require("mongoose");

var orderCountSchema = new mongoose.Schema({
	count: {
		type:Number,
		default:0
	}
});

module.exports = mongoose.model('OrderCount',orderCountSchema);