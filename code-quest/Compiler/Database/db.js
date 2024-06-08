//Create a Database => import MongoDB
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Connected with dotenv
dotenv.config();

// console.log(process.env.MONGODB_URL);   // Check MONGODB_URL    
const DBConnection = async () => {
    const MONGO_URL = process.env.MONGODB_URL;

    // Check if MONGO_URL is defined
    if (!MONGO_URL) {
        console.error('MONGODB_URL is not defined in environment variables');
        return;
    }

    try{
        await mongoose.connect(MONGO_URL);
        console.log("DB connection established");
    }
    catch(error){
        console.log("Error while connecting to Mongo DB", error);
    }
};

export default DBConnection;

// module.exports = DBConnection; //Different than normal export