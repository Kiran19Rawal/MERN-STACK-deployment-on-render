import mongoose from 'mongoose';
import colors from "colors";
const connectDB = async ()=>{
        try{
          const conn = await mongoose.connect(process.env.MONGO_URL);
        }catch(error){
    }
};
export default connectDB;