const vendorController = require('../controllers/vendorControllers');
const express = require('express');

const router = express.Router();

router.post('/register',vendorController.vendorRegister);

router.post('/login',vendorController.venderLogin);

router.get('/all-vendors',vendorController.getAllVendors);
router.get('/single-vendor/:id',vendorController.getVendorById);

module.exports = router;