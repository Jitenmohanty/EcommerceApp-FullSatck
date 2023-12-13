import { Router } from "express";
import { createOrder, deleteOrder, fetchAllOrders, fetchOrderByUser, updateOrder } from "../Controllers/Order.js";

const OrderRouter = Router();

OrderRouter.post('/',createOrder)
           .get('/own/',fetchOrderByUser)
           .patch('/:id',updateOrder)
           .delete('/:id',deleteOrder)
           .get('/',fetchAllOrders)

export default OrderRouter;