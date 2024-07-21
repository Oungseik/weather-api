import { Context as C } from "effect";
import jwt from "jsonwebtoken";
import { hashSync, compareSync } from "bcrypt";
import { Comparing, CreateEmployee, FindEmployee, Hashing, SignToken } from "@/services";
import { config } from "src/config";

export function getRegisterContext() {
  return C.empty().pipe(
    C.add(Hashing, { hash: (password) => hashSync(password, 10) }),
    C.add(CreateEmployee, { create: addEmployee }),
  );
}

export function getLoginContext() {
  return C.empty().pipe(
    C.add(FindEmployee, { find: findEmployee }),
    C.add(Comparing, { compare: (password, hash) => compareSync(password, hash) }),
    C.add(SignToken, {
      encode: (email) => jwt.sign({ email }, config.secret, { expiresIn: "7d" }),
    }),
  );
}
