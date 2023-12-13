import  { Router } from 'express'
import { fetchUserById, updateUser } from '../Controllers/User.js';
const UserRouter = Router();

UserRouter.get('/own',fetchUserById)
      .patch('/:id',updateUser)


export default UserRouter;