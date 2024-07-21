import type { DatabaseError, DuplicationError, NotFoundError } from "@/errors";
import { Context as C, Effect as E } from "effect";

export interface Employee {
  username: string;
  email: string;
  password: string;
}

export class CreateEmployee extends C.Tag("CreateEmployeeService")<
  CreateEmployee,
  {
    readonly create: (info: Employee) => E.Effect<void, DatabaseError | DuplicationError>;
  }
>() {}

export class FindEmployee extends C.Tag("FindEmployee")<
  FindEmployee,
  {
    readonly find: (email: string) => E.Effect<Employee, NotFoundError | DatabaseError>;
  }
>() {}
