import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = [];
    for (const user of users) {
      const createdUser = await User.create(user);
      createdUsers.push(createdUser);
    }
    
    // Create some initial products
    const adminUser = createdUsers[0]._id;
    
    const sampleProducts = [
        {
            productName: 'Gold Antique Bangle',
            image: '/images/bangle1.jpg',
            description: 'Beautiful 22k gold antique bangle with intricate designs.',
            category: 'Bangles',
            price: 150000,
            stockQuantity: 5,
            user: adminUser
        },
        {
            productName: 'Diamond Studded Gold Chain',
            image: '/images/chain1.jpg',
            description: 'Elegant gold chain featuring premium diamonds for a completely luxurious look.',
            category: 'Chains',
            price: 85000,
            stockQuantity: 10,
            user: adminUser
        },
        {
            productName: 'Ruby Gold Ring',
            image: '/images/ring1.jpg',
            description: 'A stunning ruby center stone set in 18k solid gold.',
            category: 'Rings',
            price: 45000,
            stockQuantity: 3,
            user: adminUser
        }
    ];

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
    try {
      await Order.deleteMany();
      await Product.deleteMany();
      await User.deleteMany();
  
      console.log('Data Destroyed!');
      process.exit();
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  };
  
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
