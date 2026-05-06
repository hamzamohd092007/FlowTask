import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['1.1.1.1', '8.8.8.8']);

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', ()=> console.log('Database connected'));
        await mongoose.connect(`${process.env.MONGODB_URL}`);
    } catch (error) {
        console.log(error);
    }
}

export default connectDB