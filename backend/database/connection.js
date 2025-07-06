import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Log to check the URI being used
    // console.log("Connecting to:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI); // No need for extra options in Mongoose v6+
    console.log("Connection created successfully");
  } catch (error) {
    console.error(" MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
