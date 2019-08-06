const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  portname: {
    type: String,
    required: true
  },
  goal: {
    type: String
  },
  stocks: [
    {
      ticker: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      qty: {
        type: Number,
        required: true
      },
      dateInvested: {
        type: Date,
        required: true
      },
      priceInvested: {
        type: Number,
        required: true
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Portfolio = mongoose.model("portfolio", PortfolioSchema);
