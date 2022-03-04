import { datetime, timedelta } from "datetime";

module.exports = {
  secretKey: "thlee",
  accessoption: {
    // algorithm: "HS256",
    expiresIn: "1m",
    issuer: "thlee",
  },
  refreshoption: {
    // algorithm: "HS256",
    expiresIn: "60m",
    issuer: "thlee",
  },
};
