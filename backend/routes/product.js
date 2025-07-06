import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getProducts , addProduct , updateProduct , deleteProduct} from '../controllers/productsController.js';


const router = express.Router();

router.post('/add', authMiddleware, addProduct);
router.get('/',authMiddleware,getProducts);
router.put('/:id',authMiddleware , updateProduct);
router.delete('/:id' , authMiddleware , deleteProduct);

export default router;