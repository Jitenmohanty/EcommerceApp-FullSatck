import {Router} from 'express'
import { addToCart, deleteFromCart, fetchCartByUser, updateCart } from '../Controllers/Cart.js';

const CartRouter = Router();

CartRouter.post('/',addToCart)
          .get('/',fetchCartByUser)
          .patch('/:id',updateCart)
          .delete('/:id',deleteFromCart)

export default CartRouter;