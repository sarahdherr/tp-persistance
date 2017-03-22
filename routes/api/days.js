// All of these are rooted off `/api/days`

var Promise = require('bluebird');
var router = require('express').Router();

var db = require('../../models');
var Hotel = db.model('hotel');
var Restaurant = db.model('restaurant');
var Activity = db.model('activity');
var Place = db.model('place');
var Day = db.model('day');

router.get('/', function(req, res, next) {
	// find all days
	res.send(console.log("get all days"));

})

router.get('/:id', function(req, res, next) {
	// find day by id
})

router.delete('/:id', function(req, res, next) {
	// delete a day by id
})

router.post('/:id', function(req, res, next) {
	// create a new day	
})


// get attractions of that type for a specific day 
router.post('/:id/hotels', function(req, res, next) {

})

router.post('/:id/restaurants', function(req, res, next) {

})

router.post('/:id/activities', function(req, res, next) {

})

module.exports = router;