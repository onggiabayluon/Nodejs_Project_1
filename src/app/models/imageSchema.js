const mongoose = require('mongoose');
//import plugin slug mongoose
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');


const Schema = mongoose.Schema;

const imageSchema = new Schema({
  contentType: String,
  data: Buffer
}, {
  timestamps: true,
});

  // Add plugin
  imageSchema.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt : true  
  });
  mongoose.plugin(slug);

  //               mongoose.model('ModelName', mySchema);
  module.exports = mongoose.model('imageSchema', imageSchema);
