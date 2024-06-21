import { injectable } from "tsyringe";
import { Plan } from "../../../shared/entities";
import { PlanRepository, UserRepository } from "../../../shared/repositories";
import { GetActivePlanOutput } from "../dto";
import { BadRequestError } from "../../../shared/errors";
import { Database } from "../../../shared/facade";

@injectable()
export default class PlanService {
  constructor(
    private planRepository: PlanRepository,
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

    const plan = await this.planRepository.fetchById(userData?.active_plan!.toString());

    if (!plan) {
      throw new BadRequestError("no active plan found");
    }

    return {
      _id: plan?._id,
      name: plan?.name ? plan.name : "",
      amount: plan?.amount ? plan.amount : "",
    };
  }
}
