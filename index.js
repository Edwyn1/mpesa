import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

const app = express();
dotenv.config();

const PORT = process.env.PORT;
let token;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Middlewares //
const createToken = async (req, res, next) => {
  const secret = process.env.SECRET;
  const consumer = process.env.CONSUMER;
  const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");

  await axios
    .get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    )
    .then((data) => {
      token = data.data.access_token;
      console.log(data.data);
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json("TOKEN GENERETION ERROR: " + err.message);
    });
};

app.post("/stk", createToken, async (req, res) => {
  const amount = req.body.amount;
  const phone = req.body.phone.substring(1);

  // console.log(req.body);
  const shortCode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;

  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);
  const password = new Buffer.from(shortCode + passkey + timestamp).toString(
    "base64"
  );

  const data = {
    BusinessShortCode: "174379",
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: `254${phone}`,
    PartyB: "174379",
    PhoneNumber: `254${phone}`,
    CallBackURL: "https://4594-102-219-208-254.ngrok-free.app/callback",
    AccountReference: "SUNSET LIQOUR",
    TransactionDesc: "Payment of liquor",
  };
  await axios
    .post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      data,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )
    .then((data) => {
      const dataArray = [];
      dataArray.push(data.data);
      console.log(data.data);
      res.status(200).json(data.data);
    })
    .catch((err) => {
      console.log(err);
      res.status(422).json("STK PUSH ERROR: " + err.message);
    });
});
app.post("/callback", async (req, res) => {
  const callbackData = req.body;
  console.log(callbackData);
});

app.listen(PORT, () => {
  console.log(`app is running at:${PORT}`);
});
