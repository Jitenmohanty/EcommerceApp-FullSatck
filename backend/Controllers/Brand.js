import { Brand } from "../Models/Brand.js"

export const fetchBrands = async(req,res)=>{
    try {
        const brands = await Brand.find({}).exec();
        res.status(200).json(brands)
    } catch (error) {
        res.status(400).json(error)
    }
}
export const createBrands = async(req,res)=>{
    const brand = new Brand(req.body);
    try {
        const brands = await brand.save();
        res.status(201).json(brands)
    } catch (error) {
        res.status(400).json(error)
    }
}