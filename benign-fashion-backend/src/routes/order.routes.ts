import { Router } from 'express'
import { createOrderController, getAllOrdersController } from '../controllers/order.controller'

const router = Router()

router.post('/create', createOrderController)
router.get('/getAll', getAllOrdersController)
router.get('/getByUserId/:userId', getAllOrdersController)

export default router
