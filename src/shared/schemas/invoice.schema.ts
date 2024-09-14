import { Schema, model } from "mongoose";
import { InvoiceStatus } from "../constants";
import { Invoice } from "../entities";

const invoiceSchema: Schema = new Schema<Invoice>({
  amount: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [
      InvoiceStatus.DRAFT,
      InvoiceStatus.OPEN,
      InvoiceStatus.PAID,
      InvoiceStatus.UNCOLLECTIBLE,
      InvoiceStatus.VOID,
    ],
    required: true,
  },
  subscription_id: {
    type: Schema.Types.ObjectId,
    ref: "Subscription",
    required: true,
  },
  stripe_invoice_id: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: function () {
      return Date.now();
    },
  },
  updated_at: {
    type: Date,
  },
});

export default model<Invoice>("Invoice", invoiceSchema);
