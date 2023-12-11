import { Product } from "../Models/Product.js";

export const createProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    const response = await product.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const fetchAllProducts = async (req, res) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  // TODO : we have to try with multiple category and brands after change in front-end
  let query = Product.find({deleted:{$ne:true}});
  let totalProductsQuery = Product.find({deleted:{$ne:true}});

  if (req.query.category) {
    query = query.where({ category: req.query.category });
    totalProductsQuery = totalProductsQuery.where({ category: req.query.category });
  }

  if (req.query.brand) {
    query = query.where({ brand: req.query.brand });
    totalProductsQuery = totalProductsQuery.where({ brand: req.query.brand });
  }

  // TODO: How to get sort on discounted Price not on Actual price
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  try {
    const totalDocs = await totalProductsQuery.countDocuments().exec();
    console.log({ totalDocs });

    if (req.query._page && req.query._limit) {
      const pageSize = req.query._limit;
      const page = req.query._page;
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    const docs = await query.exec();
    //That's way to send data in the headers.
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};


export const fetchProductById = async(req,res)=>{
  const {id} = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product)
  } catch (error) {
    res.status(400).json(error)
  }
}

export const updateProduct = async(req,res)=>{
  const {id} = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id,req.body,{new:true});
    res.status(200).json(product)
  } catch (error) {
    res.status(400).json(error)
  }
}