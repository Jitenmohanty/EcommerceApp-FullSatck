import  { Router } from 'express'
import { createProduct, fetchAllProducts, fetchProductById, updateProduct } from '../Controllers/Product.js';

const Productrouter = Router();

Productrouter.post('/',createProduct)
      .get('/',fetchAllProducts)
      .get('/:id',fetchProductById)
      .patch('/:id',updateProduct)

export default Productrouter;