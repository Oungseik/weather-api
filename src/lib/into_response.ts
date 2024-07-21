export abstract class ResponseError {
  abstract intoResponse(): Response;
}

export abstract class IntoResponse<Tag extends string> extends Error {
  abstract readonly status: number;
  abstract readonly _tag: Tag;
  reason: string | object;

  constructor(reason: string | object) {
    super();
    this.reason = reason;
  }

  intoResponse(): Response {
    return new Response(JSON.stringify({ reason: this.reason }), {
      status: this.status,
      statusText: this._tag,
      headers: { "Content-Type": "application/json" },
    });
  }
}
