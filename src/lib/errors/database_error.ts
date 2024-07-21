import { IntoResponse } from "../into_response";

export class DuplicationError extends IntoResponse<"DuplicationError"> {
  readonly _tag = "DuplicationError";
  readonly status = 400;
}

export class DatabaseError extends IntoResponse<"DatabaseError"> {
  readonly _tag = "DatabaseError";
  readonly status = 500;
}
