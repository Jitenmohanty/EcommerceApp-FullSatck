import { Order } from "../Models/Order.js";

export const fetchOrderByUser = async(req,res)=>{
    const {id} = req.user;
    try {
        const orderItem = await Order.find({user:id})
        res.status(201).json(orderItem)
    } catch (error) {
        res.status(400).json(error)
    }
}

export const fetchAllOrders = async(req,res)=>{
     // sort = {_sort:"price",_order="desc"}
    // pagination = {_page:1,_limit=10}
    let query = Order.find({deleted:{$ne:true}})
    let totalOrdersQuery = Order.find({deleted:{$ne:true}})

    if(req.query._sort && req.query._order ){
        query = query.sort({[req.query._sort]: req.query._order})
    }

    const totalDocs = await totalOrdersQuery.countDocuments().exec();

    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
      }

    try {
        const docs = await query.exec();
        res.set('X-Total-Count', totalDocs)
        res.status(200).json(docs)
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
