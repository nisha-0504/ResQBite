<<<<<<< HEAD
//db.js
=======
>>>>>>> origin/nishh
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
<<<<<<< HEAD
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
=======
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("DB Error:", error);
>>>>>>> origin/nishh
    process.exit(1);
  }
};

module.exports = connectDB;
