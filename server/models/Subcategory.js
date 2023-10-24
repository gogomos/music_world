const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      description: 'Category name'
   },
   categoryId: {
    type: String,
    description: 'The related category id'
   },
   active: {
      type: Boolean,
      description: 'Sub-Category Active status',
   }
})

module.exports = mongoose.model('SubCategory', subcategorySchema);
