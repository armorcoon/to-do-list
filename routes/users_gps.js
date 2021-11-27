const express = require('express');
const {addUsers_gps,getUsers_gps} = require('../controller/users')

const router = express.Router();

//since the server got url, just receive the request from server.js
router.route('/').get(getUsers_gps).post(addUsers_gps);

module.exports = router;