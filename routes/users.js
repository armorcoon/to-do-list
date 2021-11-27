const express = require('express');
const {getUsers, addUsers} = require('../controller/users')

const router = express.Router();

//since the server got url, just receive the request from server.js
router.route('/').get(getUsers).post(addUsers);

module.exports = router;