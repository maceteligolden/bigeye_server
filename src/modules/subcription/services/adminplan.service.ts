import { injectable } from "tsyringe";
import { Stripe } from "../../../shared/facade";
import { StripeCreatePlanInput, StripeDeletePlanInput } from "../../../shared/dto";
import { PlanRepository } from "../../../shared/repositories";
import { CreatePlanOutput } from "../dto";

@injectable()
export default class AdminPlanService {
  constructor(
    private stripe: Stripe,
    private planRepository: PlanRepository,
  ) {}

  async createPlan(args: StripeCreatePlanInput): Promise<CreatePlanOutput> {
    const { name, amount } = args;

    const stripeplan = await this.stripe.createPlan(args);

    const plan = await this.planRepository.create({
      name,
      amount,
      stripe_plan_id: stripeplan.plan_id,
      stripe_price_id: stripeplan.price_id,
    });

    return {
      plan_id: plan.stripe_plan_id,
      price_id: plan.stripe_price_id,
      name,
      amount,
    };
  }

  async deletePlan(args: StripeDeletePlanInput): Promise<any> {
    const { plan_id } = args;

    const plan = await this.planRepository.fetchOneById(plan_id);

    await this.stripe.deletePlan({
      plan_id: plan.stripe_plan_id,
    });

    const response = await this.planRepository.delete(plan_id);
    return {
      isDeleted: response ? true : false,
    };
  }
}
