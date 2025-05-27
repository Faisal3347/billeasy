import express from 'express';
import { updateReview, deleteReview,addReview } from '../Controllers/reviewController.js';
import  authMiddleware  from '../Middleware/AuthMiddleware.js'; 

const router = express.Router();




router.put('/review/:id', authMiddleware, updateReview);
router.delete('/review/:id', authMiddleware, deleteReview);
router.post('/review/:id', authMiddleware, addReview);




export default router;
