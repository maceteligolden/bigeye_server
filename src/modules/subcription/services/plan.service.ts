import { injectable } from "tsyringe";
import { Plan } from "../../../shared/entities";
import { PlanRepository } from "../../../shared/repositories";

@injectable()
export default class PlanService {
    constructor(
        private planRepository: PlanRepository
    ){

    }

    async getPlans(): Promise<Plan[]> {
        return await this.planRepository.fetchAll()
    }

}