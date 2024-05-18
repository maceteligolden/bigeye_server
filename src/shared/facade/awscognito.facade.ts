import { injectable } from "tsyringe";
import { IAWS } from "../interfaces";

@injectable()
export default class AWSCognito implements IAWS {
  constructor() {}
  initialize(): void {}
}
