import type { DatabaseError, NotFoundError } from "@/errors";
import { Context as C, Effect as E } from "effect";

export interface User {
  name: string;
  email: string;
  password: string;
}

export class FindUser extends C.Tag("FindUserService")<
  FindUser,
  {
    readonly find: (email: string) => E.Effect<User, NotFoundError | DatabaseError>;
  }
>() {}
