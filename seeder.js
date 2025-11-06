// seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('./src/utils/logger');
const { RegionalAdminUser } = require('./src/models/User.model');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info('mongodb connected for seeding...');
    } catch (err) {
        logger.error(`error connecting to db for seeding: ${err.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await RegionalAdminUser.deleteMany();

        const adminUser = {
            username: process.env.ADMIN_USERNAME || 'admin',
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
            password: process.env.ADMIN_PASSWORD || 'password123',
            role: 'Regional Admin',
            passwordChangeRequired: false, 
        };

        await RegionalAdminUser.create(adminUser);

        logger.info('admin user has been successfully created! ');
        process.exit();
    } catch (error) {
        logger.error(`error during seeding: ${error.message}`);
        process.exit(1);
    }
};

connectDB().then(() => {
    importData();
});