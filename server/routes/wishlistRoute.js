import express from 'express'
import { addToWishlist, removeFromWishlist, getWishlist, checkWishlist } from '../controllers/wishlistController.js'
import authUser from '../middleware/auth.js';

const wishlistRouter = express.Router();

wishlistRouter.post('/add', authUser, addToWishlist)
wishlistRouter.post('/remove', authUser, removeFromWishlist)
wishlistRouter.get('/get', authUser, getWishlist)
wishlistRouter.get('/check/:productId', authUser, checkWishlist)

export default wishlistRouter

