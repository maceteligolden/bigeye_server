import { ServerResponse } from "../interfaces";

export function Res(args: ServerResponse): void {
  const { res, code, message, error, data } = args;

  res.status(code).json({
    message,
    error,
    data,
  });
}
