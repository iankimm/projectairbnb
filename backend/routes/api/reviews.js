const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, User, Review } = require('../../db/models');

const router = express.Router();

//Get all Reviews of the Current User
router.get('/current', async (req, res) => {
  const { user } = req;

  let id = user.id;

  let Reviews = await Review.findAll({
    where: {userId : id }
  });
  return res.json({Reviews})
})


module.exports = router;
