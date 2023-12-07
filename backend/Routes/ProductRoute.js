import express, { Router } from 'express'
import { createProduct } from '../Controllers/Product.js';

const router = Router();

router.post('/',createProduct);

export default router;