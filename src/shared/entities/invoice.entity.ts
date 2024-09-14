import mongoose from "mongoose";
import { Base } from "./base.entity";
import { InvoiceStatus } from "../constants";

export default interface Invoice extends Base {
  subscription_id?: mongoose.Types.ObjectId;
  status?: InvoiceStatus;
  amount?: string;
  stripe_invoice_id?: string;
}
