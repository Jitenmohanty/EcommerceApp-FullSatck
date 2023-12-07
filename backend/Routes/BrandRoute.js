import  { Router } from 'express'
import { createBrands, fetchBrands } from '../Controllers/Brand.js';

const Brandrouter = Router();

Brandrouter.post('/',createBrands)
      .get('/',fetchBrands)

export default Brandrouter;