import { Hono } from "hono";
import { Console, Effect as E } from "effect";
import { Schema as S, ArrayFormatter } from "@effect/schema";
import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";
import { ConsoleLogWriter, eq } from "drizzle-orm";

import { LoginIn, RegisterIn } from "../lib/parsers";
import { Hashing, Comparing, SignToken } from "@/services";
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError } from "@/errors";
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
      if (e._tag === "BadRequestError") {
        return E.succeed(e.intoResponse());
      } else if (e._tag === "ParseError") {
        return E.succeed(new BadRequestError(ArrayFormatter.formatErrorSync(e)).intoResponse());
      } else if (e._tag === "SqlError" && (e.cause as any).code === "SQLITE_CONSTRAINT_UNIQUE") {
        return E.succeed(new ForbiddenError("user already exist").intoResponse());
      } else {
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
    );

    let db = yield* SqliteDrizzle.SqliteDrizzle;
    let user = yield* db
      .select()
      .from(users)
      .where(eq(users.email, body.email))
      .pipe(E.flatMap((users) => E.fromNullable(users.at(0))));
    yield* Comparing.pipe(
      E.andThen((srv) => srv.compare(body.password, user.password)),
      E.flatMap((r) => (r ? E.succeed(r) : E.fail(new BadRequestError("incorrect password")))),
    );
    let token = yield* SignToken.pipe(E.andThen((srv) => srv.encode(body.email)));
    return c.json({ token });
  });

  let runnable = program.pipe(
    E.provide(DatabaseLive),
    E.provide(getLoginContext()),
    E.catchAll((e) => {
      switch (e._tag) {
        case "BadRequestError":
          return E.succeed(e.intoResponse());
        case "ParseError":
          return E.succeed(new BadRequestError(ArrayFormatter.formatErrorSync(e)).intoResponse());
        case "SqlError":
        case "ConfigError":
          return E.succeed(new InternalServerError("something went wrong").intoResponse());
        case "NoSuchElementException":
          return E.succeed(new NotFoundError("user not found").intoResponse());
      }
    }),
  );

  return E.runPromise(runnable);
});

export { router as authRouter };
