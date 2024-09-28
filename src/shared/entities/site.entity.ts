import { Base } from "./base.entity";

export default interface Site extends Base {
  name?: string;
  healthcheck_link?: string;
  user_id?: string;
}
