const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogPostSchema = new Schema({
                                      petId: {type: String, required: true},
                                      title: {type: String, required: true},
                                      date: {type: Date, required: true},
                                      content: {type: String, required: true},
                                      type: {type: String, required: true}
                                  }, {
                                      timestamps: true,
                                  });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;


