const express = require('express');
const router = express.Router();

// @route  GET api/wishlist
// @desc   Test route
// @access Public
router.get('/', (req, res) => res.send('wishlist route'));

module.exports = router;