import { injectable } from "tsyringe";
import { Plan } from "../../../shared/entities";
import { PlanRepository, UserRepository } from "../../../shared/repositories";
import { GetActivePlanOutput } from "../dto";

@injectable()
export default class PlanService {
    constructor(
        private planRepository: PlanRepository,
        private userRepository: UserRepository
    ){

    }

    async getPlans(): Promise<Plan[]> {
        return await this.planRepository.fetchAll()
    }

    async getActivePlan(cognitoId: string): Promise<GetActivePlanOutput> {
        const userData = await this.userRepository.fetchOneByCognitoId(cognitoId);

        return {
            active_plan_id: userData ? userData?.active_plan : ""
        }
    }
}