const mongoose= require('mongoose');


const connectDB = async () => {
    try {
        //mongodb connection Sting 
      await mongoose.connect(process.env.database, {
        useNewUrlParser: true,
        useUnifiedTopology:true,
        tls:true,
        tlsCAFile:"./cer/ca-certificate.crt",
      });
  
      console.log('MongoDB Connected...');
      
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;
