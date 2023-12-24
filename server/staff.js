const mongoose = require('./database').mongoose;

const staffSchema = new mongoose.Schema({
  staffId: String,
  firstName: String,
  lastName: String
});

const StaffModel = mongoose.model("Staff", staffSchema);

module.exports = StaffModel;