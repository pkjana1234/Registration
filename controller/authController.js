import { hashPassword,comparePassword } from "../helper/authHelper.js";
import userModel from "../model/userModel.js";
import JWT from 'jsonwebtoken'
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
        //validation
        if (!name) {
            return res.send({ message: "Name is Required" });
        }
        if (!email) {
            return res.send({ message: "Email is Required" });
        }
        if (!password) {
            return res.send({ message: "Password is Required" });
        }
        if (!phone) {
            return res.send({ message: "Phone no is Required" });
        }
        if (!address) {
            return res.send({ message: "Address is Required" });
        }
        if (!answer) {
            return res.send({ message: "Answer is Required" });
        }
        //check user
        const exisitingUser = await userModel.findOne({ email });
        //exisiting user
        if (exisitingUser) {
            return res.status(500).send({
                success: false,
                message: "Already Register this email please login",
            });
        }
        //register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            answer,
        }).save();

        return res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Errro in Registeration",
            error,
        });
    }



}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        //check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email is not registerd",
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).json({
                success: false,
                message: "Invalid Password",
            });
        }
const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"5d"});
res.status(200).send({
    success: true,
    message: "login successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      answer:user.answer,
    },
    token,
  });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Errro in login",
            error,
        });
    }

}

export const forgrtPasswordController=async(req,res)=>{
    try{
        const{email,answer,newPassword}=req.body;
        if(!email){
            res.status(400).send({message:"Email is required"})
        }
        if(!answer){
            res.status(400).send({message:"Answer is required"})
        }
        if(!newPassword){
            res.status(400).send({message:"New Password is required"})
        }
        //check email exist or not
        const user=await userModel.findOne({email,answer});
        if(!user){
            return res.status(404).send({success:false,message:"wrong Email or Answer"})
        }
        const heased=await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id,{
            password:heased
        })
        res.status(200).send({success:true,message:"Password Reset Successfully"})

    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Errro in forget password",
            error,
        });
    }

}

//protect route
export const testController=async(req,res)=>{
    return res.status(200).json({message:"protected route"})

}


