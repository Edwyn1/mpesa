import express from "express";
import { checkPaymentStatus, getCallback,getStatus,makePayment } from "../controller/mpesa.js";
// import { validateTransaction } from "../controller/validator";

const router = express.Router();

// router.post("/stkpush", createToken, postStk);
// router.post("/callback", callback);
// router.post("/validate", validateTransaction);
router.get("/status", getStatus);
router.post("/stk", makePayment);
router.post("/callback", getCallback);
router.post("/payemnt/status", checkPaymentStatus);

export {router};
