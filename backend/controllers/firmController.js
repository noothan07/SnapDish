const Firm = require('../models/Firm');
const Vendor = require('../models/vendor');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save images
  },
  filename: function (req, file, cb) {
    // Save file with original name + timestamp to avoid duplicates
    cb(null,Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({storage: storage});

const addFirm = async(req,res)=>{
    try {
    const {firmName, area, category, region, offer} = req.body;

    const image = req.file? req.file.filename:undefined;

    const vendor = await Vendor.findById(req.vendorId);
    if(!vendor){
      res.status(400).json({message:"vendor not found"})
    }

    const firm = new Firm({firmName, area, category, region, offer, image, vendor: vendor._id})

    const savedFrim = await firm.save();

    vendor.firm.push(savedFrim)

    await vendor.save();

    return res.status(200).json({message:"firm added successfully"})

    } catch (error) {
      console.log("at line 40 in firmcontroller",error);
      res.status(400).json("internal server error")
    }
}

const deleteFirmById = async (req,res) => {
    try {
        const firmId = req.params.firmId;
        const deletedFirm = await Product.findByIdAndDelete(firmId);

        if(!deletedFirm){
            return res.status(404).json({error:"no product found"});
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({error:"internal server error"});
    }
}

module.exports = {addFirm: [upload.single('image'), addFirm], deleteFirmById}