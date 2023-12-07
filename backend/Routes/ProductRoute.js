import express, { Router } from 'express'
import { createProduct, fetchAllProducts, fetchProductById, updateProduct } from '../Controllers/Product.js';

const router = Router();

router.post('/',createProduct)
      .get('/',fetchAllProducts)
      .get('/:id',fetchProductById)
      .patch('/:id',updateProduct)

export default router;