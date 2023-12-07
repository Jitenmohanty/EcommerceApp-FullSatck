import { Category } from "../Models/Category.js";

export const fetchCategory = async(req,res)=>{
    try {
        const CategoryList = await Category.find({}).exec();
        res.status(200).json(CategoryList)
    } catch (error) {
        res.status(400).json(error)
    }
}
export const createCategory = async(req,res)=>{
    const newCategory = new Category(req.body);
    try {
        const docs = await newCategory.save();
        res.status(201).json(docs)
    } catch (error) {
        res.status(400).json(error)
    }
}