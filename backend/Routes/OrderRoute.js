import { Router } from "express";
import { createOrder, deleteOrder, fetchOrderByUser, updateOrder } from "../Controllers/Order.js";

const OrderRouter = Router();

OrderRouter.post('/',createOrder)
           .get('/',fetchOrderByUser)
           .patch('/:id',updateOrder)
           .delete('/:id',deleteOrder)

export default OrderRouter;