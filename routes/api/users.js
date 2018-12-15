const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../../models/User')


// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req,res) => res.json({msg: 'User works'}) );

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req,res)=> {
    User.findOne({email:req.body.email})
        .then(user => {
            if(user){
                return res.status(400).json({email : "Email Already Exist"});
            } else {
                const avatar_ = gravatar.url(req.body.email, {
                    s: '200', //Size
                    r: 'pg', //Rating
                    d: 'nm' //Default
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar : avatar_ || '',
                    password: req.body.password
                });

                bcrypt.genSalt(10,(err,salt) => {
                    bcrypt.hash(newUser.password,salt,(err,hash) => {
                        console.log(newUser.password);
                        console.log(req.body.password);
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch( err => console.log(err));
                    })
                })
            }
        })
});


module.exports = router;