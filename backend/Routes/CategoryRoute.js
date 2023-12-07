import  { Router } from 'express'
import { createCategory, fetchCategory } from '../Controllers/Category.js';

const Categoryrouter = Router();

Categoryrouter.post('/',createCategory)
      .get('/',fetchCategory)

export default Categoryrouter;