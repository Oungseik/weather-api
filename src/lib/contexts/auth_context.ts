import { Context as C } from "effect";
import jwt from "jsonwebtoken";
import { compareSync } from "bcrypt";

import { Comparing, SignToken, Hashing } from "@/services";
import { config } from "src/config";

export function getLoginContext() {
  return C.empty().pipe(
    C.add(Comparing, { compare: (password, hash) => compareSync(password, hash) }),
    C.add(SignToken, {
      encode: (email) => jwt.sign({ email }, config.secret, { expiresIn: "7d" }),
    }),
  );
}
