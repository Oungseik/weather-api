import { IntoResponse } from "../into_response";

export class NotFoundError extends IntoResponse<"NotFoundError"> {
  readonly _tag = "NotFoundError";
  readonly status = 404;
}

export class BadRequestError extends IntoResponse<"BadRequestError"> {
  readonly _tag = "BadRequestError";
  readonly status = 400;
}

export class ForbiddenError extends IntoResponse<"ForbiddenError"> {
  readonly _tag = "ForbiddenError";
  readonly status = 403;
}

export class InternalServerError extends IntoResponse<"InternalServerError"> {
  readonly _tag = "InternalServerError";
  readonly status = 500;
}
