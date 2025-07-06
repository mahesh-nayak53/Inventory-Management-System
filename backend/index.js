// index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database/connection.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/category.js';
import supplierRoutes from './routes/supplier.js';
import ProductRoutes from  './routes/product.js';
import userRoutes from './routes/user.js';
import orderRoutes from './routes/order.js';
import dashboardRoutes from './routes/dashboard.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend origin
  credentials: true               // Allow cookies if used
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/category' , categoryRoutes);
app.use('/api/supplier',supplierRoutes);
app.use('/api/products' , ProductRoutes);
app.use('/api/users',userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

// // MongoDB URI
// const uri = " ";

// // MongoDB Client
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// // MongoDB Connection Function
// async function run() {
//   try {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } catch (err) {
//     console.error("MongoDB connection failed:", err);
//   } finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);

// Root route (for browser test)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server after DB is connected
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error("Failed to connect to DB. Server not started:", err.message);
});

