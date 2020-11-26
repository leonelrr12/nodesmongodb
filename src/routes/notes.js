const express = require('express');
const { DocumentProvider } = require('mongoose');
const router = express.Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res, ) => {
    res.render('notes/new-note.hbs');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({text: 'Please Write a Title'});
    }
    if(!description) {
        errors.push({text: 'Please Write a Desctiption'})
    }
    if(errors.length > 0) {
        res.render('notes/new-note.hbs', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({ title, description });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Note added successfully!');
        res.redirect('/notes');
    }
})

router.get('/notes', isAuthenticated, async (req, res, ) => {
    await Note.find({user: req.user.id}).sort({ date: 'desc' })
    .then(datos => {
        //console.log(datos);
        const contexto = {
            notes: datos.map(dato => {
                return {
                    id: dato._id,
                    title: dato.title,
                    description: dato.description
                }
            })
        }
        res.render('notes/index.hbs', { notes: contexto.notes });
    })
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    await Note.findById(req.params.id)
    .then(datos => {
        //console.log(datos);
        const contexto = {
            _id: datos._id,
            title: datos.title,
            description: datos.description
        }
        res.render('notes/edit-note.hbs', {note: contexto})
    })
})

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const { title, description } = req.body
    await Note.findByIdAndUpdate(req.params.id, { title, description })
    req.flash('success_msg', 'Note Updated Successfully!');
    res.redirect('/notes')
})

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    const id = req.params.id
    //await Note.findOneAndDelete({_id: id})
    try {
        await Note.findByIdAndDelete(id)
        req.flash('success_msg', 'Note Deleted Successfully!');
    } catch (error) {
        req.flash('error_msg', 'Error: Note NOT deleted!');
    }
    res.redirect('/notes')
})


module.exports = router;