export const AWSSNSTargetARN = {
  GENERAL: `${process.env.AWS_SNS_TARGET_ARN_GENERAL}`,
  UPDATE: `${process.env.AWS_SNS_TARGET_ARN_UPDATE}`,
};

export enum AWSServices {
  SQS = "sqs",
}

export enum AWSSESTemplates {}
