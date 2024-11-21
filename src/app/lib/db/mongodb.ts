import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

let isConnected = false;

const connect = async () => {
  console.log("mongo", MONGODB_URI);

  if (isConnected) {
    console.log("Already connected to MongoDB");
    return mongoose.connection; // החזר את החיבור אם הוא כבר קיים
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connection.readyState === 1;
    console.log("Mongodb connection successful !!!");
    return mongoose.connection; // החזר את החיבור החדש
  } catch (error) {
    throw new Error("Error in connection to MongoDB: " + error);
  }
};

export default connect;
