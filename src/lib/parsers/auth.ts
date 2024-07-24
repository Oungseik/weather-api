import { Schema as S } from "@effect/schema";

export const RegisterIn = S.Struct({
  name: S.String.pipe(S.nonEmpty()),
  email: S.String.pipe(
    S.pattern(/^(?!\.)(?!.*\.\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i),
  ),
  password: S.String.pipe(S.nonEmpty()),
});

export type RegisterIn = S.Schema.Type<typeof RegisterIn>;

export const LoginIn = S.Struct({
  email: S.String.pipe(
    S.pattern(/^(?!\.)(?!.*\.\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i),
  ),
  password: S.String.pipe(S.nonEmpty()),
});

export type LoginIn = S.Schema.Type<typeof LoginIn>;
