const router = require('express').Router();
let blogPost = require('../models/blogpost.model');

// Get all the blogposts from database
router.route('/').get((req, res) => {
    blogPost.find()
        .then(blogPosts => res.json(blogPosts))
        .catch(err => res.status(400).json('Error:' + err));
});

// find blogpost by petId
router.route('/pet/:petId').get((req, res) => {
    blogPost.find({"petId":req.params.petId})
        .then(blogpost => res.json(blogpost))
        .catch(err => res.status(400).json('Error: ' + err))
});

// Add a new blogpost to the database
router.route('/add').post((req, res) => {
    const petId = req.body.petId;
    const title = req.body.title;
    const date = Date.parse(req.body.date);
    const content = req.body.content;
    const type = req.body.type;

    const newBlogPost = new blogPost({
                                         petId,
                                         title,
                                         date,
                                         content,
                                         type
                                     });

    newBlogPost.save()
        .then(() => res.json('blogPost added!'))
        .catch(err => res.status(400).json('Error:' + err));
});

// find blogpost by id
router.route('/:id').get((req, res) => {
    blogPost.findById(req.params.id)
        .then(blogpost => res.json(blogpost))
        .catch(err => res.status(400).json('Error: ' + err))
});

// delete a blogpost from the database
router.route('/:id').delete((req, res) => {
    blogPost.findByIdAndDelete(req.params.id)
        .then(() => res.json('Blogpost deleted'))
        .catch(err => res.status(400).json('Error: ' + err))
});

// update a blogpost from the database
router.route('/update/:id').put((req, res) => {
    blogPost.findById(req.params.id)
        .then(blogpost => {
            blogpost.petId = req.body.petId;
            blogpost.title = req.body.title;
            blogpost.date = req.body.date;
            blogpost.content = req.body.content;
            blogpost.save()
                .then(() => res.json('Blogpost Updated!'))
                .catch(err => res.status(400).json('Error:' + err));
        })
        .catch(err => res.status(400).json('Error:' + err));
});
module.exports = router;
