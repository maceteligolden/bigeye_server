import { Schema, model } from "mongoose";
import { Transaction } from "../entities";
import { TransactionProcessor, TransactionStatus, TransactionType } from "../constants";

const transactionSchema: Schema = new Schema<Transaction>({
  amount: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [
        TransactionStatus.FAILED,
        TransactionStatus.PENDING,
        TransactionStatus.SUCCESS,
        TransactionStatus.CANCELLED
    ]
  },
  invoice_id: {
    type: Schema.Types.ObjectId,
    ref: "Invoice",
    required: true,
  },
  type: {
    type: String,
    enum: [
        TransactionType.BILL,
        TransactionType.BILL_RETRY,
        TransactionType.REFUND
    ],
    required: true
  },
  processor: {
    type: String,
    enum: [
        TransactionProcessor.STRIPE
    ],
    required: true
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

export default model<Transaction>("Transaction", transactionSchema);
