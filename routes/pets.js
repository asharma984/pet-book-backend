const router = require('express').Router();
let Pet = require('../models/pet.model');

// Get all the pets from database
router.route('/').get((req,res) => {
    Pet.find()
        .then(pets => res.json(pets))
        .catch(err => res.status(400).json('Error:' + err));
});

// get all pets for user
router.route('/user/:userId').get((req, res) =>{
    Pet.find({"userId":req.params.userId})
        .then(pet => res.json(pet))
        .catch(err => res.status(400).json('Error: ' +err))
});

// Add a new pet to the database
router.route('/add').post((req, res) => {
    const userId = req.body.userId;
    const type = req.body.type;
    const species = req.body.species;
    const breeds = req.body.breeds;
    const age = req.body.age;
    const size = req.body.size;
    const gender = req.body.gender;
    const name = req.body.name;
    const description = req.body.description;
    const photos = req.body.photos;
    const blogpostId = req.body.blogpostId;
    const contact = req.body.contact;

    const newPet = new Pet({
                               userId,
                               type,
                               species,
                               breeds,
                               age,
                               size,
                               gender,
                               name,
                               description,
                               photos,
                               blogpostId,
                               contact
                           });

    newPet.save()
        .then(() => res.json('Pet added!'))
        .catch(err => res.status(400).json('Error:' + err));
});

// find pet by id
router.route('/:id').get((req, res) =>{
    Pet.findById(req.params.id)
        .then(pet => res.json(pet))
        .catch(err => res.status(400).json('Error: ' +err))
});

// delete a pet from the database
//TODO remove all blogposts for pet currently handled on front end
router.route('/:id').delete((req,res) =>{

    Pet.findByIdAndDelete(req.params.id)
        .then(() => res.json('Pet Removed'))
        .catch(err => res.status(400).json('Error: ' + err))
});

// update a pet from the database
router.route('/update/:id').put((req, res) =>{
    console.log(req.body.photos)
    Pet.findById(req.params.id)
        .then(pet => {
            pet.userId = req.body.userId;
            pet.type = req.body.type;
            pet.species = req.body.species;
            pet.breeds = req.body.breeds;
            pet.age = req.body.age;
            pet.size = req.body.size;
            pet.gender = req.body.gender;
            pet.name = req.body.name;
            pet.description = req.body.description;
            pet.photos = req.body.photos;
            pet.blogpostId = req.body.blogpostId;
            pet.contact = req.body.contact;
            pet.save()
                .then(() => res.json('Pet Updated!'))
                .catch(err => res.status(400).json('Error:' + err));
        })
        .catch(err => res.status(400).json('Error:' + err));
});
module.exports = router;
