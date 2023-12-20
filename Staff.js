const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    staffId: String,
    firstName: String,
    lastName: String
});

module.exports = mongoose.model('Staff', staffSchema);