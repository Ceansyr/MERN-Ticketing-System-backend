import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://Chinmay:Cmmongodb%4047@cluster0.t3wsd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0S";

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000
})
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));
