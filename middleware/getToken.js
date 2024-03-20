import axios from "axios";

// Middlewares
export const createToken = async (req, res, next) => {
  const secret = process.env.SECRET;
  const consumer = process.env.CONSUMER;
  //   const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");
  try {
    const { data } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        auth: {
          username: consumer,
          password: secret,
        },
      }
    );
    req.token = data?.access_token;
    return next()
  } catch (error) {
    console.log(error);
    return res.status(400).json("TOKEN GENERETION ERROR: " + error.message);
  }
};
