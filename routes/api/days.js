// All of these are rooted off `/api/days`

var Promise = require('bluebird');
var router = require('express').Router();

var db = require('../../models');
var Hotel = db.model('hotel');
var Restaurant = db.model('restaurant');
var Activity = db.model('activity');
var Place = db.model('place');
var Day = db.model('day');

router.get('/', function (req, res, next) {
	// find all days
	Day.findAll().then(function (days) {
		res.send(days);
	})

})

// Need a seperate post from the /:id below; doen't catch there.
router.post('/', function (req, res, next) {
	res.send("You created a day");
})

router.get('/:number', function (req, res, next) {
	// find day by id
})

router.delete('/:number', function (req, res, next) {
	// delete a day by id
	Day.findOne({
		where: {
			number: req.params.number
		}
	})
		.then(function (day) {
			day.destroy();
		})
})

router.post('/:number', function (req, res, next) {
	// res.send("You created a day");
	Day.create({
		number: req.params.number
	})
		.then(function (day) {
			res.send(day);
		})
})


// get attractions of that type for a specific day
router.put('/:number/hotels', function (req, res, next) {
	Day.findOne({
		where: {
			number: req.params.number
		}
	})
		.then(function (day) {
			day.hotelId = req.body.id
		})
		.catch(next)
})

router.post('/:number/restaurants', function (req, res, next) {

})

router.post('/:number/activities', function (req, res, next) {

})

module.exports = router;
