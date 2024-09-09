import mongoose from "mongoose";
import { Base } from "./base.entity";
import { TransactionProcessor, TransactionStatus, TransactionType } from "../constants";

export default interface Transaction extends Base {
    invoice_id: mongoose.Types.ObjectId;
    status: TransactionStatus;
    amount: string;
    type: TransactionType;
    processor: TransactionProcessor;
}