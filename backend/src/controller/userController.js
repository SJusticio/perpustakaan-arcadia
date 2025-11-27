import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    createUser,
    findUserByUsn,
    findAdminByUsn
} from "../model/userModel.js";


export const registerAccount = async (req, res) => {
    try{
        const { name, username, password } = req.body

        if(password.length < 8){
            return res.status(400).json({ message: "Password must be at least 8 characters" })
        }

        const existingUser = await findUserByUsn(username)
        if(existingUser){
            return res.status(409).json({ message: "Usename already registered" })
        }

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Save user
        const newUser = await createUser(name, username, passwordHash, 1);

        // Buat token
        const token = jwt.sign(
            { userId: newUser.id, username:newUser.user_peminjam }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(201).json({
            message: "User registered successfully",
            data: {
                role: "peminjam",
                token,
                user: {
                    userId: newUser.id_peminjam,
                    username: newUser.user_peminjam,
                    name: newUser.nama_peminjam    
                },
            },
        })

    }
    catch(e){
        console.error("Register error:", e);
        res.status(500).json({ message: "Server error" });
    }
}

export const loginAccount = async (req, res) =>{
    try{
        const { username, password } =  req.body

        if(!username){
            res.status(400).json({ message : "Please fill username field"})
        }

        if(!password){
            res.status(400).json({ message : "Please fill password field"})
        }

        if(password.length < 8){
            res.status(400).json({ message : "Password must have at least 8 characters"})
        }
        
        const user = await findUserByUsn(username);
        
        if(!user){
            const admin = await findAdminByUsn(username);
            if(!admin){
                return res.status(400).json({ message: "User haven't been registered!" })
            }

            if(admin.pass_admin !== password){
                return res.status(400).json({ message: "Wrong password. Please try again." })
            }

            const token = jwt.sign(
                { userId: admin.id_admin, username: admin.user_admin },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            )

            return res.status(200).json({
                message: "Login successful",
                data: {
                    role: "admin",
                    token,
                    userId: admin.id_admin,
                    user: {
                        userUsername: admin.user_admin,
                        fullName: admin.nama_admin    
                    },
                },
            })
        }

        const isMatch = await bcrypt.compare(password, user.pass_peminjam);
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password. Please try again." });
        }
        const token = jwt.sign(
            { userId: user.id_peminjam, username: user.user_peminjam },
            process.env.JWT_SECRET,                            
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).json({
            message: "Login successful",
            userId: user.id_peminjam,
            data: {
                role: "peminjam",
                token,
                user: {
                    Username: user.user_peminjam,
                    name: user.nama_peminjam    
                },
            },
        })
    }
    catch(e){
        console.error("Login error:", e)
        res.status(500).json({ message: "Server error"})
    }
}
