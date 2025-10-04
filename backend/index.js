const express = require('express');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const vendorRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const frimRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes')

const app = express();
const PORT = 3000;
dotEnv.config()

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("mongoDB connected successfully!"))
.catch((err) => console.log("connection failed",err))

// middlewares
app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);
app.use('/firm',frimRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Express backend!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
