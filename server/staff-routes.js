const express = require('express');
const cors = require('cors');
const { staffModel } = require('./database');
const router = express.Router();

const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

router.use(cors(corsOptions));

// Get all staff members using GET all
router.get('/staff', async (req, res) => {
  try {
    const staffMembers = await staffModel.find({}, {
      'firstName': 1,
      'lastName': 1,
      'dateOfBirth': 1,
      'mobileNumber': 1,
      'email': 1,
      'role': 1,
      'department.name': 1,
      'department.site': 1,
    });

    res.json(staffMembers);
  } catch (error) {
    console.error('Error fetching staff members:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific staff member using GET specific
router.get('/staff/:id', async (req, res) => {
  try {
    const staffMember = await staffModel.findById(req.params.id);

    if (!staffMember) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json(staffMember);
  } catch (error) {
    console.error('Error fetching staff member:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new staff member using POST
router.post('/staff', async (req, res) => {
  try {
    const staffData = req.body;
    if (!staffData.firstName || !staffData.lastName || !staffData.dateOfBirth || !staffData.mobileNumber || !staffData.email || !staffData.role || !staffData.department) {
      throw new Error('Invalid request body. Missing required fields.');
    }
    const newStaffMember = await staffModel.create(staffData);
    res.json(newStaffMember);
  } catch (error) {
    console.error('Error creating staff member:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a staff member using PUT
router.put('/staff/:id', async (req, res) => {
  try {
    const staffId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      return res.status(400).json({ error: 'Invalid staff ID' });
    }

    const updatedStaffMember = await staffModel.findByIdAndUpdate(staffId, req.body, { new: true });

    if (!updatedStaffMember) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json(updatedStaffMember);
  } catch (error) {
    console.error('Error updating staff member:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Delete a staff member using DELETE
router.delete('/staff/:id', async (req, res) => {
  try {
    const deletedStaffMember = await staffModel.findByIdAndDelete(req.params.id);

    if (!deletedStaffMember) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;