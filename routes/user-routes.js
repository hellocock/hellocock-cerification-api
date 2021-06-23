const express = require('express');
const {
       getkakaocert,
      } = require('../controllers/userController');

const router = express.Router();

router.get('/user/:id',  getkakaocert);

module.exports = {
    routes: router
}
