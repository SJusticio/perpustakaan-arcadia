import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    createUser,
    findUserByUsn,
    findAdminByUsn
} from "../model/userModel.js";


export const registerAccount = async (req, res) => {
    try{
        const { fullName, xUsername, phoneNumber, email, password } = req.body

        if(!fullName || !phoneNumber || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

        if(password.length < 8){
            return res.status(400).json({ message: "Password must be at least 8 characters" })
        }

        const existingUser = await findUserByEmail(email)
        if(existingUser){
            return res.status(409).json({ message: "Email already registered" })
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        let cleanUsername = null;
        if (xUsername) {
            const match = xUsername.match(xRegex);

            if (match) {
            // Jika input berupa link, ambil username
            cleanUsername = match[1];
            } else if (/^[A-Za-z0-9_]+$/.test(xUsername)) {
            // Jika input memang username (tanpa link)
            cleanUsername = xUsername;
            } else {
            return res.status(400).json({ message: "Invalid X (Twitter) username or link" });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Simpan user
        const newUser = await createUser(fullName, cleanUsername, phoneNumber, email, passwordHash);

        // Buat token
        const token = jwt.sign({ userId: newUser.id, email:newUser.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        
        res.status(201).json({
            message: "User registered successfully",
            data:{
                user: newUser,
                token,
            }
        });

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
            const admin = findAdminByUsn(username);
            if(!admin){
                return res.status(400).json({ message: "User haven't been registered!" })
            }

            if(admin.password !== password){
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
                    user: {
                        userId: admin.id_admin,
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
            data: {
                role: "peminjam",
                token,
                user: {
                    userId: user.id_peminjam,
                    userUsername: user.user_peminjam,
                    fullName: user.nama_peminjam    
                },
            },
        })
    }
    catch(e){
        console.error("Login error:", e)
        res.status(500).json({ message: "Server error"})
    }
}
