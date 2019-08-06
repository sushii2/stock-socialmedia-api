const express = require("express");
const request = require("request");
const router = express.Router();
const auth = require("../../middleware/auth");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const Portfolio = require("../../models/Portfolio");
const User = require("../../models/User");

// @route  GET api/portfolio/me
// @desc   Get current users portfolio.
// @access Private
router.get("/me", auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id }).populate(
      "user",
      "name"
    );

    if (!portfolio) {
      return res
        .status(400)
        .json({ msg: "There is no portfolio for this user" });
    }

    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route POST api/portfolio
//@desc Create or update a user's stock portfolio
//@access private
router.post(
  "/",
  auth,
  [
    check("portname", "A name for your portfolio is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array });
    }

    const { portname, goal } = req.body;

    const portfolioFields = {};
    portfolioFields.user = req.user.id;
    if (portname) portfolioFields.portname = portname;
    if (goal) portfolioFields.goal = goal;

    try {
      let portfolio = await Portfolio.findOne({ user: req.user.id });

      //update portfolio is it exists
      if (portfolio) {
        portfolio = await Portfolio.findOneAndUpdate(
          { user: req.user.id },
          { $set: portfolioFields },
          { new: true }
        );

        return res.json(portfolio);
      }
      //Create if not found
      portfolio = new Portfolio(portfolioFields);
      await portfolio.save();
      res.json(portfolio);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Sever Error");
    }
  }
);

// @route  GET api/portfolio
// @desc   Get all portfolios
// @access Public
router.get("/", async (req, res) => {
  try {
    const portfolios = await Portfolio.find().populate("user", "name");
    res.json(portfolios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  GET api/portfolio/user/:user_id
// @desc   Get portfolio by user_id
// @access Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      user: req.params.user_id
    }).populate("user", "name");

    if (!portfolio) {
      return res.status(400).json({ msg: "Portfolio not found" });
    }

    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Portfolio not found " });
    }
    res.status(500).send("Server Error");
  }
});

//@route PUT api/portfolio/stock
//@desc Create or update a user's stock portfolio
//@access private
router.put(
  "/stock",
  auth,
  [
    check("ticker", "symbol is require or incorrect.")
      .not()
      .isEmpty(),
    check("name", "Stock name is required")
      .not()
      .isEmpty(),
    check(
      "qty",
      "Quantity of the stock purchased is required and should be numeric"
    )
      .isNumeric()
      .not()
      .isEmpty(),
    check(
      "dateInvested",
      "Date of investment is required and should be valid date format."
    )
      .not()
      .isEmpty(),
    check(
      "priceInvested",
      "Price of the stock purchased is required and should be numeric"
    )
      .isNumeric()
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ticker, name, qty, dateInvested, priceInvested } = req.body;

    //Build Portfolio object
    const newStock = {
      ticker,
      name,
      qty,
      dateInvested,
      priceInvested
    };

    try {
      let portfolio = await Portfolio.updateOne({ user: req.user.id });

      //add stock to the portfolio
      portfolio.stocks.unshift(newStock);

      await portfolio.save();

      res.json(portfolio);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Sever Error");
    }
  }
);

//@route DELTE api/portfolio/stock/:stock_id
//@desc Delete a stock from user's portfolio
//@access private
router.delete("/stock/:stock_id", auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });

    //Get the remove index
    const removeIndex = portfolio.stocks
      .map(item => item.id)
      .indexOf(req.params.stock_id);
    portfolio.stocks.splice(removeIndex, 1);
    await portfolio.save();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sever Error");
  }
});

// @route   PUT api/profile/experience/:exp_id
// @desc    Edit profile experience
// @access  Private
router.put(
  "/stock/:stock_id",
  [
    auth,
    check("ticker", "symbol is require or incorrect.")
      .not()
      .isEmpty(),
    check("name", "Stock name is required")
      .not()
      .isEmpty(),
    check(
      "qty",
      "Quantity of the stock purchased is required and should be numeric"
    )
      .isNumeric()
      .not()
      .isEmpty(),
    check(
      "dateInvested",
      "Date of investment is required and should be valid date format."
    )
      .not()
      .isEmpty(),
    check(
      "priceInvested",
      "Price of the stock purchased is required and should be numeric"
    )
      .isNumeric()
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }
      
    const { ticker,
      name,
      qty,
      dateInvested,
      priceInvested } = req.body
    
    const stock = { ticker, name, qty, dateInvested, priceInvested };

    try {
      const portfolio = await Portfolio.findOneAndUpdate(
        { user: req.user.id , 'stock_id': req.params.stock_id },
        {
          $set: {
            'stocks.$': { _id: req.params.stock_id, ...stock }
          }
        },
        { new: true }
      );
      res.json(portfolio);
      
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
    
  }
);

// @route   GET api/portfolio/stock/quote/:stock_id
// @desc    Get specific stock Quote
// @access  Private
router.get("stock/quote/:stock_id", auth, (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    const stockTicker = portfolio.stocks.indexOf(req.params.stock_id).ticker;

    const options = {
      uri: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockTicker}&apikey=${config.get('API_KEY')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if(error) console.error(error);

      if(response.statusCode !== 200){
        res.status(404).json({msg: 'No quote found for this stock'});
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

// @route   GET api/portfolio/stock/intraday/:stock_id
// @desc    Get specific stocks intraday time series.
// @access  Private
router.get("stock/intraday/:stock_id", auth, (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    const stockTicker = portfolio.stocks.indexOf(req.params.stock_id).ticker;

    const options = {
      uri: `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockTicker}&apikey=${config.get('API_KEY')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if(error) console.error(error);

      if(response.statusCode !== 200){
        res.status(404).json({msg: 'No intraday time series found for this stock'});
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

// @route   GET api/portfolio/stock/daily/:stock_id
// @desc    Get specific stocks daily time series.
// @access  Private
router.get("stock/daily/:stock_id", auth, (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    const stockTicker = portfolio.stocks.indexOf(req.params.stock_id).ticker;

    const options = {
      uri: `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockTicker}&apikey=${config.get('API_KEY')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if(error) console.error(error);

      if(response.statusCode !== 200){
        res.status(404).json({msg: 'No intraday time series found for this stock'});
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

// @route   GET api/portfolio/stock/daily/:stock_id
// @desc    Get specific stocks weekly time series.
// @access  Private
router.get("stock/weekly/:stock_id", auth, (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    const stockTicker = portfolio.stocks.indexOf(req.params.stock_id).ticker;

    const options = {
      uri: `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${stockTicker}&apikey=${config.get('API_KEY')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if(error) console.error(error);

      if(response.statusCode !== 200){
        res.status(404).json({msg: 'No intraday time series found for this stock'});
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});



module.exports = router;
