export enum TransactionStatus {
    SUCCESS = "success",
    PENDING = "pending",
    FAILED = "failed"
}

export enum TransactionType {
    REFUND = "refund",
    BILL = "bill",
    BILL_RETRY = "bill_retry"
}

export enum TransactionProcessor {
    STRIPE = "stripe"
}