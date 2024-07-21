import { Context as C } from "effect";

export class SignToken extends C.Tag("SignTokenService")<
  SignToken,
  {
    readonly encode: (email: string) => string;
  }
>() {}
