import { injectable } from "tsyringe";
import { SiteRepository, UserRepository } from "../../shared/repositories";
import { Site } from "../../shared/entities";
import { BadRequestError } from "../../shared/errors";

@injectable()
export default class SiteService {
    constructor(
        private siteRepository: SiteRepository,
        private userRepository: UserRepository
    ){

    }

    async create(args: Site): Promise<any> {
        const { name, healthcheck_link, user_id} = args;
        const checkName = await this.siteRepository.fetchOneByName(name!);

        if(checkName){
            throw new BadRequestError("name already exist")
        }

        const user = await this.userRepository.fetchOneByCognitoId(user_id!);

        return await this.siteRepository.create({
            name,
            healthcheck_link,
            user_id: user?._id!
        })
    }

    async fetchAll(user_id: string): Promise<Site[] | null> {
        const user = await this.userRepository.fetchOneByCognitoId(user_id!);

        return await this.siteRepository.fetchAllByUserId(user?._id!);
    }

    async delete(site_id: string): Promise<void> {
        await this.siteRepository.delete(site_id);
    }
}