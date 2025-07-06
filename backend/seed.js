import bcrypt from 'bcrypt';
import User from './models/User.js';
import connectDB from './database/connection.js';

const register = async () => {
    try {
        await connectDB();

        const hashPassword = await bcrypt.hash(" ", 10);

        // Create or update admin user
        const Admin = await User.findOneAndUpdate(
            { email: "admin@gmail.com" },         // Filter
            {
                name: "admin",
                email: "admin@gmail.com",
                password: hashPassword,
                address: "admin address",
                role: "admin"
            },
            { upsert: true, new: true } // Create if not exists, return new doc
        );

        console.log("Admin user created successfully");
    } catch (error) {
        console.log("Error creating/updating admin:", error.message);
    }
};

register();
