// const randToken = require('rand-token');
import jwt from "jsonwebtoken";
const secretKey = require("./config/secretKey").secretKey;
const accessoption = require("./config/secretKey").accessoption;
const refreshoption = require("./config/secretKey").refreshoption;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
  sign: async (user: any) => {
    const payload = {
      id: user.member_id,
      name: user.member_name,
    };
    const result = {
      accesstoken: jwt.sign(payload, secretKey, accessoption),
      refreshtoken: jwt.sign(payload, secretKey, refreshoption),
    };
    console.log(result);
    return result;
  },
  verify: async (token: any) => {
    let decoded;
    try {
      // verify를 통해 값 decode!
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      if (err === "jwt expired") {
        console.log("expired token");
        return TOKEN_EXPIRED;
      } else if (err === "invalid token") {
        console.log("invalid token");
        console.log(TOKEN_INVALID);
        return TOKEN_INVALID;
      } else {
        console.log("invalid token");
        return TOKEN_INVALID;
      }
    }
    return decoded;
  },
};
