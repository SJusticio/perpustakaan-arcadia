import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./router/userRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend jalan")
})

app.use("/api/users", userRoutes)

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server berjalan di port${PORT}`));
