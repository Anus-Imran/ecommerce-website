import express from 'express'
import { updateStatus, userOrders, allOrders, placeOrder, placeOrderRazorpay, placeOrderStripe, verifyStripe } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'


const orderRouter = express.Router();

// Admin features

orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// payment features

orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)
orderRouter.post('/stripe', authUser, placeOrderStripe)

// User features

orderRouter.get('/userorders', authUser, userOrders)

// Verify payment

orderRouter.post('/verifyStripe', authUser, verifyStripe)

export default orderRouter;