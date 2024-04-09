const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fName: String,
    lName: String,
    email: String,
    phone: Number,
    address: String,
    dAddress: String,
    country: String,
    state: String,
    zip: Number
  });

  module.exports = mongoose.model('checkout', contactSchema);