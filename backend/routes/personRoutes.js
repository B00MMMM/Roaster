const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const Trait = require('../models/Trait');
const authMiddleware = require('../middleware/auth');

// GET all traits (public)
router.get('/traits', async (req, res) => {
  try {
    const traits = await Trait.find().sort({ category: 1, name: 1 });
    res.json(traits);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching traits', error: error.message });
  }
});

// POST create new trait (protected)
router.post('/traits', authMiddleware, async (req, res) => {
  try {
    const { name, category, description } = req.body;
    
    const trait = new Trait({
      name,
      category,
      description
    });
    
    await trait.save();
    res.status(201).json(trait);
  } catch (error) {
    res.status(400).json({ message: 'Error creating trait', error: error.message });
  }
});

// GET all persons for the logged-in user
router.get('/persons', authMiddleware, async (req, res) => {
  try {
    const persons = await Person.find({ userId: req.user.id })
      .populate('traits')
      .sort({ name: 1 });
    res.json(persons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching persons', error: error.message });
  }
});

// POST create new person
router.post('/persons', authMiddleware, async (req, res) => {
  try {
    const { name, skinColor, animalType, traits } = req.body;
    
    const person = new Person({
      name,
      skinColor,
      animalType,
      traits,
      userId: req.user.id
    });
    
    await person.save();
    await person.populate('traits');
    res.status(201).json(person);
  } catch (error) {
    res.status(400).json({ message: 'Error creating person', error: error.message });
  }
});

// GET specific person by ID
router.get('/persons/:id', authMiddleware, async (req, res) => {
  try {
    const person = await Person.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    }).populate('traits');
    
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    
    res.json(person);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching person', error: error.message });
  }
});

// PUT update person
router.put('/persons/:id', authMiddleware, async (req, res) => {
  try {
    const { name, skinColor, animalType, traits } = req.body;
    
    const person = await Person.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, skinColor, animalType, traits },
      { new: true, runValidators: true }
    ).populate('traits');
    
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    
    res.json(person);
  } catch (error) {
    res.status(400).json({ message: 'Error updating person', error: error.message });
  }
});

// DELETE person
router.delete('/persons/:id', authMiddleware, async (req, res) => {
  try {
    const person = await Person.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    
    res.json({ message: 'Person deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting person', error: error.message });
  }
});

module.exports = router;
