const User = require("../models/User");
const UserGps = require("../models/UserGps");

// @desc  Get all stores from database
// @route GET /api/v1/stores
// @access Public
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    //error
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc  Create a user, add all users
// @route POST /api/v1/stores
// @access Public
exports.addUsers = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "This user already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

exports.addUsers_gps = async (req,res,next) => {
  try {
    const usergps = await UserGps.create(req.body);
    return res.status(200).json({
      success: true,
      data: usergps,
    });
  } catch (error) {
    if (err.code === 11000){
      return res.status(400).json({error:'This user already exists'});
    }
    res.status(500).json({ error: "Server error"});
  }
};

exports.getUsers_gps = async (req,res,next) => {
  try {
    const usergps = await UserGps.find();
    return res.status(200).json({
      success: true,
      count: usergps.length,
      data: usergps,
    });
  } catch (error) {
    if (err.code === 11000){
      return res.status(400).json({error:'This user already exists'});
    }
    res.status(500).json({ error: "Server error"});
  }
};
