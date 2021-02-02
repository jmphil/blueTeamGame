const express = require("express");
const router = express.Router();
const db = require('../models');

router.get('/game', async (req, res) => {
    let pointLeaders = await db.points.findAll({raw: true, include: db.users,limit: 10})
    res.render("/game",{
      pointLeaders
    });
  });

module.exports = router;