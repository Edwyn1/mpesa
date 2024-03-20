import axios from "axios";

export const getStatus = async (req, res) => {
  return res.status(200).json({ message: "System is up" });
};

export const makePayment = async (req, res) => {
  const { amount, phone } = req.body;
  if (!amount || !phone) {
    return res.status(400).json({ message: "Please provide amount and phone" });
  }
  //   console.log(req.token);

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

  const body = {
    BusinessShortCode: "174379",
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: `254${phone}`,
    PartyB: "174379",
    PhoneNumber: `254${phone}`,
    CallBackURL: "https://liquourlogic.co.ke/",
    AccountReference: "SUNSET LIQOUR",
    TransactionDesc: "Payment of liquor",
  };
  await axios
    .post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      body,
      {
        headers: {
          authorization: `Bearer ${req.token}`,
        },
      }
    )
    .then((data) => {
      const dataArray = [];
      dataArray.push(data.data);
      //   console.log(data.data);
      res.status(200).json(data.data);
    })
    .catch((err) => {
      console.log(err);
      res.status(err?.status || 422).json("STK PUSH ERROR: " + err.message);
    });
};

export const getCallback = async (req, res) => {
  const callbackData = req.body;
  console.log(callbackData);
};

export const checkPaymentStatus = async (req,res)=>{
    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const {checkoutId} = req.query

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
    const body = {
      BusinessShortCode: "174379",
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutId || "ws_CO_20032024133654821757532111",
    };  
    try {
       const { data } = await axios.post(
         "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
         body,
         {
           headers: {
             authorization: `Bearer ${req.token}`,
           },
         }
       );
        res.status(200).json({data})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error});
    }
}

