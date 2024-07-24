import { Hono } from "hono";
import { Effect as E } from "effect";
import { Schema as S, ArrayFormatter } from "@effect/schema";
import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";

import { LoginIn, RegisterIn } from "../lib/parsers";
import { Hashing, FindUser, Comparing, SignToken } from "@/services";
import { BadRequestError, InternalServerError } from "@/errors";
import { getLoginContext } from "@/contexts";
import { hashSync } from "bcrypt";
import { users } from "@/databases/sqlite/schemas";
import { DatabaseLive } from "@/databases/sqlite";

let router = new Hono();

router.post("/register", async (c) => {
  let program = E.gen(function* () {
    let body = yield* E.tryPromise(() => c.req.json()).pipe(
      E.catchTag("UnknownException", () => E.fail(new BadRequestError("invalid json"))),
      E.flatMap(S.decode(RegisterIn)),
    );
    let hash = yield* Hashing.pipe(E.andThen((h) => h.hash(body.password)));
    let db = yield* SqliteDrizzle.SqliteDrizzle;
    yield* db.insert(users).values({ email: body.email, password: hash, name: body.name });
    return c.json({ message: "successfully registered" }, 201);
  });

  let runnable = program.pipe(
    E.provide(DatabaseLive),
    E.provideService(Hashing, { hash: (password) => hashSync(password, 10) }),
    E.catchAll((e) => {
      switch (e._tag) {
        case "BadRequestError":
          return E.succeed(e.intoResponse());
        case "ParseError":
          return E.succeed(new BadRequestError(ArrayFormatter.formatErrorSync(e)).intoResponse());
        case "SqlError":
        case "ConfigError":
          return E.succeed(new InternalServerError("something went wrong").intoResponse());
      }
    }),
  );

  return E.runPromise(runnable);
});

router.post("/login", async (c) => {
  let program = E.gen(function* () {
    let body = yield* E.tryPromise(() => c.req.json()).pipe(
      E.catchTag("UnknownException", () => E.fail(new BadRequestError("invalid json"))),
      E.flatMap(S.decode(LoginIn)),
      E.catchTag("ParseError", (e) => {
        let message = ArrayFormatter.formatErrorSync(e);
        return E.fail(new BadRequestError(message));
      }),
    );

    let employee = yield* FindUser.pipe(E.andThen((srv) => srv.find(body.email)));
    yield* Comparing.pipe(
      E.andThen((srv) => srv.compare(body.password, employee.password)),
      E.flatMap((r) => (r ? E.succeed(r) : E.fail(new BadRequestError("incorrect password")))),
    );
    let token = yield* SignToken.pipe(E.andThen((srv) => srv.encode(body.email)));
    return c.json({ token });
  });

  let runnable = program.pipe(
    E.provide(getLoginContext()),
    E.catchAll((e) => E.succeed(e.intoResponse())),
  );

  return E.runPromise(runnable);
});

export { router as authRouter };
