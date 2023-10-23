const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      description: 'Category name'
   },
    active: {
        type: Boolean,
        description: 'Category Active status',
    }
})

module.exports = mongoose.model('Category', categorySchema);
