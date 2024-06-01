import { injectable } from "tsyringe";
import { Stripe } from "../../../shared/facade";
import { StripeCreatePlanInput, StripeDeletePlanInput } from "../../../shared/dto";
import { PlanRepository } from "../../../shared/repositories";
import { CreatePlanOutput } from "../dto";
import { BadRequestError, InternalServerError } from "../../../shared/errors";

@injectable()
export default class AdminPlanService {
  constructor(
    private stripe: Stripe,
    private planRepository: PlanRepository,
  ) {}

  async createPlan(args: StripeCreatePlanInput): Promise<CreatePlanOutput> {
    const { name, amount } = args;

    const checkName = await this.planRepository.fetchOneByName(name);

    if (checkName) {
      throw new BadRequestError("name already exists");
    }

    const stripeplan = await this.stripe.createPlan(args);

    if (!stripeplan) {
      throw new InternalServerError("failed to create plan on payment provider");
    }

    const plan = await this.planRepository.create({
      name,
      amount,
      stripe_plan_id: stripeplan.plan_id,
      stripe_price_id: stripeplan.price_id,
    });

    if (!plan) {
      throw new InternalServerError("failed to add plan to records");
    }

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

    if (!plan) {
      throw new BadRequestError("plan not found");
    }

    const stripeDelete = await this.stripe.deletePlan({
      plan_id: plan!.stripe_plan_id,
    });

    if (!stripeDelete) {
      throw new InternalServerError("failed to delete plan on payment provider");
    }

    const response = await this.planRepository.delete(plan_id);

    if (!response) {
      throw new InternalServerError("failed to delete plan from records");
    }
    return {
      isDeleted: response ? true : false,
    };
  }
}
