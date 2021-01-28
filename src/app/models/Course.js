const mongoose = require('mongoose');
//import plugin slug mongoose
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');


const Schema = mongoose.Schema;

const Course = new Schema({
    title: { type: String, required: true, },
    description: { type: String },
    videoId: { type: String },
    level: { type: String },
    thumbnail: { type: String },
    finalImg: { 
      contentType: String,
      data: Buffer,
    },
    slug: { type: String, slug: 'title', unique: true }
  }, {
    timestamps: true,
  });

  // Add plugin
  Course.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt : true  
  });
  mongoose.plugin(slug);

  //               mongoose.model('ModelName', mySchema);
  module.exports = mongoose.model('Course', Course);
