import * as crypto from "node:crypto";
import "dotenv/config";
const algorithm = "aes-256-cbc";

const key = Buffer.from(
  "6a2e3cfb5f3edcbcc3adf67f5a04b8c9d2e0ae7c4cc0e9724f1fefbc87ed9ea3",
  "hex"
);
const iv = Buffer.from("64fe128efab12c349a8b1a5b7424c2e1", "hex");

export const cryptMiddleware = function () {
  return {
    inbound(message) {
      try {
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        const decrypted = Buffer.concat([
          decipher.update(message),
          decipher.final(),
        ]);
        return decrypted;
      } catch (err) {
        console.error("Decryption failed:", err.message);
        return message; // fallback: treat it as unencrypted
      }
    },
    outbound(message) {
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      const encrypted = Buffer.concat([cipher.update(message), cipher.final()]);
      return encrypted;
    },
  };
};
