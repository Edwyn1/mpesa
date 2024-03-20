import express from "express";
import { createToken, postStk, callback } from "../controller/controller";
import { validateTransaction } from "../controller/validator";

const router = express.Router();

router.post("/stkpush", createToken, postStk);
router.post("/callback", callback);
router.post("/validate", validateTransaction);

module.exports = router;
