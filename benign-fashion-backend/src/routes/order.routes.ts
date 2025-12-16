import { Router } from 'express'
import { createOrderController, getAllOrdersController, getOrdersByUserIdController } from '../controllers/order.controller'

const router = Router()

router.post('/create', createOrderController)
router.get('/getAll', getAllOrdersController)
router.get('/getByUserId/:userId', getOrdersByUserIdController)

export default router
