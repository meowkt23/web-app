const express = require('express');
const router = express.Router();
const StaffModel = require('./staff');

// Get all staff members
router.get('/staff', async (req, res) => {
  try {
    const staffMembers = await StaffModel.find();
    res.json(staffMembers);
  } catch (error) {
    console.error('Error getting staff members:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new staff member
router.post('/staff', async (req, res) => {
  try {
    const newStaffMember = new StaffModel(req.body);
    await newStaffMember.save();
    res.json(newStaffMember);
  } catch (error) {
    console.error('Error adding staff member:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update a staff member
router.put('/staff/:id', async (req, res) => {
  try {
    const updatedStaffMember = await StaffModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStaffMember);
  } catch (error) {
    console.error('Error updating staff member:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a staff member
router.delete('/staff/:id', async (req, res) => {
  try {
    await StaffModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;