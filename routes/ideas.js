const express = require('express');
const mongoose = require('mongoose');
const router = express.Router(); 
const verifyJWT_MW = require('./../middlewares/verifierJwt');

// Load Models
require('../models/Idea');
const Idea = mongoose.model('ideas');
require('../models/User');
const User = mongoose.model('users');

const getIdUser = async (userCredential) => {
  const id = User.findOne({idUser: userCredential})
  .then(user => user.id);
  return await id;
}
// Idea Index Page
router.get('/', verifyJWT_MW, async (req, res) => {
  const id = await getIdUser(req.user.idUser); 
  Idea.find({user: id})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});

// Add Idea Form
router.get('/add', (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    if(idea.id != req.params.id){
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea:idea
      });
    }    
  });
});

// Process Form
router.post('/', verifyJWT_MW, async (req, res) => {
  const id = await getIdUser(req.user.idUser);
  req.user.id = id;
  let errors = [];

  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }

  if(errors.length > 0){
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: id
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Idea added');
        res.redirect(`/ideas/?token=${req.user.prewToken}`);
      })
  }
});

// Edit Form process
router.put('/:id', verifyJWT_MW, (req, res) => { 
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        req.flash('success_msg', 'Idea updated');
        res.redirect(`/ideas/?token=${req.user.prewToken}`);
      })
  });
});

// Delete Idea
router.delete('/:id', verifyJWT_MW, ( req, res) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Idea removed');
      res.redirect(`/ideas/?token=${req.user.prewToken}`);
    });
});

module.exports = router;
