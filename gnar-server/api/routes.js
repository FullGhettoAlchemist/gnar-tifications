// Import dependencies
const express = require('express');
const router = express.Router();
// Import internal dependencies
const { User } = require('../database');

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works');
});

/* GET all users. */
router.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        if (err) res.status(500).send(error)
        res.status(200).json(users);
    });
});

/* GET one users. */
router.get('/users/:id', (req, res) => {
    User.findById(req.param.id, (err, users) => {
        if (err) res.status(500).send(error)
        res.status(200).json(users);
    });
});

/* Create a user. */
router.post('/users', (req, res) => {
	// todo implement the correct keys and valyes
	// name:       String,
	// number:     {type: Number, required: true, unique: true },
	// email:      String,
	// date:       Date
    let user = new User({
        name: req.body.name,
        age: req.body.age
    });

    user.save(error => {
        if (error) res.status(500).send(error);
        res.status(201).json({
            message: 'User created successfully'
        });
    });
});

module.exports = router;