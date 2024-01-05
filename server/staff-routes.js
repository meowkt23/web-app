//staff-routes.js defines routes for handling staff

const express = require('express');
const cors = require('cors');
const { staffModel } = require('./database');
const router = express.Router();

//set up CORS config for the router
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

//apply CORS middleware to router
router.use(cors(corsOptions));

//route to GET all staff members
router.get('/staff', async (req, res) => {
  try {
    //fetch all staff members with specific fields
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

    //respond with fetched staff members
    res.json(staffMembers);
  } catch (error) {
    console.error('Error fetching staff members using GET all:', error); //error log
    res.status(500).json({ error: 'Internal Server Error for GET all' }); //error log
  }
});

//route to GET specific staff member by ID
router.get('/staff/:id', async (req, res) => {
  try {
    //fetch specific staff member by ID
    const staffMember = await staffModel.findById(req.params.id);

    //check staff member exists
    if (!staffMember) {
      return res.status(404).json({ error: 'Staff member not found using GET by ID' }); //error log
    }

    res.json(staffMember);
  } catch (error) {
    console.error('Error fetching staff member using GET by ID:', error); //error log
    res.status(500).json({ error: 'Internal Server Error for GET by ID' }); //error log
  }
});

//route to POST create new staff member
router.post('/staff', async (req, res) => {
  try {
    //validate and create new staff member
    const staffData = req.body;
    if (!staffData.firstName || !staffData.lastName || !staffData.dateOfBirth || !staffData.mobileNumber || !staffData.email || !staffData.role || !staffData.department) {
      throw new Error('Invalid request body. Missing required fields using POST for new staff member.'); //error log
    }
    const newStaffMember = await staffModel.create(staffData);
    res.json(newStaffMember);
  } catch (error) {
    console.error('Error creating staff member using POST new staff member:', error); //error log
    res.status(500).json({ error: 'Internal Server Error for POST new staff member' }); //error log
  }
});

//route to PUT update staff member by ID
router.put('/staff/:id', async (req, res) => {
  try {
    const staffId = req.params.id;
    //validate, update and fetch updated staff member
    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      return res.status(400).json({ error: 'Invalid staff ID using PUT update staff member' }); //error log
    }

    const updatedStaffMember = await staffModel.findByIdAndUpdate(staffId, req.body, { new: true });
    //check staff member exists
    if (!updatedStaffMember) {
      return res.status(404).json({ error: 'Staff member not found using PUT update staff member' }); //error log
    }

    //respond with updated staff member
    res.json(updatedStaffMember);
  } catch (error) {
    console.error('Error updating staff member using PUT update staff member:', error); //error log
    res.status(500).json({ error: 'Internal Server Error for PUT update staff member' }); //error log
  }
});

//route to DELETE staff member
router.delete('/staff/:id', async (req, res) => {
  try {
    //delete staff member by ID
    const deletedStaffMember = await staffModel.findByIdAndDelete(req.params.id);

    //check staff member exists
    if (!deletedStaffMember) {
      return res.status(404).json({ error: 'Staff member not found using DELETE staff member' }); //error log
    }

    res.json({ message: 'Staff member deleted successfully using DELETE staff member' }); //success log
  } catch (error) {
    console.error('Error deleting staff member using DELETE staff member:', error); //error log
    res.status(500).json({ error: 'Internal Server Error with DELETE staff member' }); //error log
  }
});

//export the router
module.exports = router;