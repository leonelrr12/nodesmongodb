const express = require('express');
const User = require('../models/user');
const router = express.Router();
const passport = require('passport');

router.get('/user/signin', (req, res) => {
    res.render('users/signin.hbs');
});

router.get('/user/signup', (req, res) => {
    res.render('users/signup.hbs');
});

router.post('/user/signup', async (req, res) => {
    const { name, email, password, confPassword } = req.body;
    const errors = [];
    if(password != confPassword){
        errors.push({text: 'Contraseña no coniciden.'})
    }
    if(password.length === 0){
        errors.push({text: 'Debe indicar una Contraseña.'})
    } else {
        if(password.length < 6){
            errors.push({text: 'Largo minimo de la Contraseña es de 6 caracteres.'})
        }    
    }
    if(name.length === 0){
        errors.push({text: 'Debe indicar el nombre del usuario.'})
    }
    if(email.length === 0){
        errors.push({text: 'Debe indicar un email válido.'})
    }
    if(errors.length > 0){
        res.render('users/signup.hbs', {
            errors, 
            name, 
            email
        })
    } else {
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg', 'Email ya registrado, pruebe con otro.')
            res.render('users/signup.hbs', { name, email });
        } else {
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Usuario registrado.');
            res.redirect('/user/signin');
        }
    }
});

router.post('/user/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

router.get('/user/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})

module.exports = router;