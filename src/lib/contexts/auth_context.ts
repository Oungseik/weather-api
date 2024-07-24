import { Context as C, Effect as E } from "effect";
import jwt from "jsonwebtoken";
import { compareSync } from "bcrypt";

import { Comparing, FindUser, SignToken } from "@/services";
import { users } from "@/databases/sqlite/schemas";
import { config } from "src/config";

export function getLoginContext() {
  return C.empty().pipe(
    C.add(FindUser, { find: findEmployee }),
    C.add(Comparing, { compare: (password, hash) => compareSync(password, hash) }),
    C.add(SignToken, {
      encode: (email) => jwt.sign({ email }, config.secret, { expiresIn: "7d" }),
    }),
  );
}
