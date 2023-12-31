import jwksClient from "jwks-rsa";
import { decode, Algorithm } from "jsonwebtoken";

const client = jwksClient({
  jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
  timeout: 30000,
});

const getGooglesPublicKey = async (userIdToken: string) => {
  try {
    const decodedHeader = decode(userIdToken, { complete: true }) as {
      header: { alg: Algorithm; kid: string; typ: string };
    };
    // console.log("decodedHeader", decodedHeader);
    const key = await client.getSigningKey(decodedHeader.header.kid),
      publicKey = key.getPublicKey();

    return { algorithm: decodedHeader.header.alg, publicKey };
  } catch (error: any) {
    throw new Error("getGooglesPublicKey error:" + error.message);
  }
};

export default getGooglesPublicKey;
