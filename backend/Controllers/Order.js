import { Order } from "../Models/Order.js";

export const fetchOrderByUser = async(req,res)=>{
    const {user} = req.query;
    try {
        const orderItem = await Order.find({user:user})
        res.status(201).json(orderItem)
    } catch (error) {
        res.status(400).json(error)
    }
}
export const createOrder = async(req,res)=>{
    const order = new Order(req.body)
    try {
        const orderItem = await order.save();
        res.status(201).json(orderItem)
    } catch (error) {
        res.status(400).json(error)
    }
}
export const deleteOrder = async(req,res)=>{
    const {id} = req.params;
    try {
        const orderItem = await Order.findByIdAndDelete(id)
        res.status(201).json(orderItem)
    } catch (error) {
        res.status(400).json(error)
    }
}
export const updateOrder = async(req,res)=>{
    const {id} = req.params;
    try {
        const orderItem = await Order.findByIdAndUpdate(id,req.body,{new:true})
        res.status(201).json(orderItem)
    } catch (error) {
        res.status(400).json(error)
    }
}
