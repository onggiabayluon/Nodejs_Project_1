const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//import plugin slug mongoose
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Course = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    videoId: { type: String },
    level: { type: String },
    thumbnail: { type: String },
    slug: { type: String, slug: 'title', unique: true }
  }, {
    timestamps: true,
  });

  // Add plugin
  mongoose.plugin(slug);
  Course.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt : true  
  });


  //               mongoose.model('ModelName', mySchema);
  module.exports = mongoose.model('Course', Course);
