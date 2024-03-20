import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {router} from "./routes/routes.js"
import { createToken } from "./middleware/getToken.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 9000;
app.use(express.json());
app.use(cors());
app.use("/mpesa",createToken, router)


app.listen(PORT, () => {
  console.log(`app is running at:${PORT}`);
});
