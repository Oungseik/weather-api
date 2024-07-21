import { Hono } from "hono";
import { Effect as E } from "effect";
import { Schema as S, ArrayFormatter } from "@effect/schema";

import { LoginIn, RegisterIn } from "../lib/parsers";
import { Hashing, CreateEmployee, FindEmployee, Comparing, SignToken } from "@/services";
import { BadRequestError } from "@/errors";
import { getRegisterContext, getLoginContext } from "@/contexts";

let router = new Hono();

router.post("/register", async (c) => {
  let program = E.gen(function* () {
    let body = yield* E.tryPromise(() => c.req.json()).pipe(
      E.catchTag("UnknownException", () => E.fail(new BadRequestError("invalid json"))),
      E.flatMap(S.decode(RegisterIn)),
      E.catchTag("ParseError", (e) => {
        let message = ArrayFormatter.formatErrorSync(e);
        return E.fail(new BadRequestError(message));
      }),
    );
    let hash = yield* Hashing.pipe(E.andThen((h) => h.hash(body.password)));
    yield* CreateEmployee.pipe(E.andThen((srv) => srv.create({ ...body, password: hash })));
    return c.json({ message: "successfully registered" });
  });

  let runnable = program.pipe(
    E.provide(getRegisterContext()),
    E.catchAll((e) => E.succeed(e.intoResponse())),
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

    let employee = yield* FindEmployee.pipe(E.andThen((srv) => srv.find(body.email)));
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

