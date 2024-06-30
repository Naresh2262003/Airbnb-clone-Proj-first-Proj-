const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initData=require("./data.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
    .then( res => console.log("SUCCESS"))
    .catch( err => console.log("ERROR"));

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async() =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("DB has been initialised");
}

initDB();