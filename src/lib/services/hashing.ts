import { Context as C } from "effect";

export class Hashing extends C.Tag("HashingService")<
  Hashing,
  {
    readonly hash: (password: string) => string;
  }
>() {}

export class Comparing extends C.Tag("ComparingService")<
  Comparing,
  {
    readonly compare: (password: string, hash: string) => boolean;
  }
>() {}
