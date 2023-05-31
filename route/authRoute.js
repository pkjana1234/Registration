import express  from "express";
const router=express.Router();
import {registerController,
    loginController,
    testController,
    forgrtPasswordController,
} from '../controller/authController.js';
import { isAdmin, requireSigning } from "../middleware/authMiddleware.js";

router.post('/register',registerController);
router.post('/login',loginController);

//protrct route
router.get('/test',requireSigning,isAdmin,testController)

//forgrt password
router.post('/forgot-password',forgrtPasswordController)


export default router;