import { ServerResponse } from "../interfaces";

export function Res(args: ServerResponse): void {
  const { res, code, message, data } = args;

  res.status(code).json({
    message,
    data,
  });
}
