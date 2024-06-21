import { injectable } from "tsyringe";
import { Plan } from "../../../shared/entities";
import { PlanRepository, SubscriptionRepository, UserRepository } from "../../../shared/repositories";
import { GetActivePlanOutput } from "../dto";
import { BadRequestError } from "../../../shared/errors";
import { Database } from "../../../shared/facade";
import { ObjectId, Schema } from "mongoose";

@injectable()
export default class PlanService {
  constructor(
    private planRepository: PlanRepository,
    private subscriptionRepository: SubscriptionRepository,
    private userRepository: UserRepository,
    private database: Database,
  ) {}

  async getPlans(): Promise<Plan[]> {
    return await this.planRepository.fetchAll();
  }

  async getActivePlan(cognitoId: string): Promise<GetActivePlanOutput> {
    const userData = await this.userRepository.fetchOneByCognitoId(cognitoId);

    if (!userData) {
      throw new BadRequestError("user not found");
    }

    const plan = await this.planRepository.fetchOneById(userData.active_plan?.toString()!);
    const subscription = await this.subscriptionRepository.fetchByPriceId(plan?._id?.toString()!);

    return {
      _id: plan?._id,
      name: plan ? plan.name : "",
      amount: plan ? plan.amount : "",
      createdDate: subscription?.start_date!,
    };
  }
}
