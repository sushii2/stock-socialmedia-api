# stock-socialmedia-api
This is a back end for a website I was trying to make but abandoned the idea.
To use this API clones this repo, download the dependencies, Go to the config folder under default.json, replace the values of the key with yours, like the mongodb cluster URL, ALphavantage API key and your jwt secret.
This was a learning experience for me, if you like this API star it :D

# API Endoints

## Authentication
1. 
// @route  GET api/auth
// @desc   Test route
// @access Public

2. 
// @route  POST api/auth
// @desc   Authenticate user and get token
// @access Public

## Users
1.
// @route  POST api/users
// @desc   Register user
// @access Public

## Profile
1.
// @route  GET api/profile/me
// @desc   Get current users profile
// @access Private
2.
// @route  POST api/profile
// @desc   Create or update a user profile.
// @access Private
3.
// @route  GET api/profile
// @desc   get all profiles
// @access Public
4.
// @route  GET api/profile/user/:user_id
// @desc   get profile by user id.
// @access Public
5.
// @route  DELETE api/profile
// @desc   delete profile, user, portfolio, wishlist and post
// @access Private
6.
// @route  PUT api/profile/experience
// @desc   Add profile experience
// @access Private
7.
// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete experience from profile.
// @access Private
8.
// @route  PUT api/profile/education
// @desc   Add profile education
// @access Private
9.
// @route  DELETE api/profile/exducation/:edu_id
// @desc   Delete education from profile.
// @access Private
 
 ## Users Stock Portfolio (Uses ALPHAVANTAGE API)
 1.
 // @route  GET api/portfolio/me
// @desc   Get current users portfolio.
// @access Private
2.
//@route POST api/portfolio
//@desc Create or update a user's stock portfolio
//@access private
3.
// @route  GET api/portfolio
// @desc   Get all portfolios
// @access Public
4.
// @route  GET api/portfolio/user/:user_id
// @desc   Get portfolio by user_id
// @access Public
5.
//@route PUT api/portfolio/stock
//@desc Create or update a user's stock portfolio
//@access private
6.
//@route DELTE api/portfolio/stock/:stock_id
//@desc Delete a stock from user's portfolio
//@access private
7.
// @route   PUT api/portfolio/stock/:stock_id
// @desc    Edit a specific portfolio stock that was previously added
// @access  Private
8.
// @route   GET api/portfolio/stock/quote/:stock_id
// @desc    Get specific stock Quote
// @access  Private
9.
// @route   GET api/portfolio/stock/intraday/:stock_id
// @desc    Get specific stocks intraday time series.
// @access  Private
10.
// @route   GET api/portfolio/stock/daily/:stock_id
// @desc    Get specific stocks daily time series.
// @access  Private
11.
// @route   GET api/portfolio/stock/daily/:stock_id
// @desc    Get specific stocks weekly time series.
// @access  Private

## POSTS
In Progress.......

 





