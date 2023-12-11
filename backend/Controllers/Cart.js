import { Cart } from "../Models/Cart.js";


export const fetchCartByUser = async(req,res)=>{
    const {user} = req.query;
    try {
        const cartItem = await Cart.find({user:user}).populate('product')
        res.status(201).json(cartItem)
    } catch (error) {
        res.status(400).json(error)
    }
}

export const addToCart = async(req,res)=>{
    const cartItem = new Cart(req.body);
    try {
        const docs = await cartItem.save();
        const result = await docs.populate('product');
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json(error)
    }
}

export const deleteFromCart = async(req,res)=>{
    const {id} = req.params;
    try {
        const docs = await Cart.findByIdAndDelete(id)
        res.status(201).json(docs)
    } catch (error) {
        res.status(400).json(error)
    }
}

export const updateCart = async(req,res)=>{
    const {id} = req.params;
    try {
        const docs = await Cart.findByIdAndUpdate(id,req.body,{new:true})
        const result = await docs.populate('product')
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
}