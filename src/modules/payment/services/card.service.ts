import { injectable } from "tsyringe";
import { UserRepository } from "../../../shared/repositories";
import { AuthorizeCardInput, AuthorizeCardOutput, SaveCardInput, SaveCardOutput } from "../dto";
import { BadRequestError } from "../../../shared/errors";
import { Stripe } from "../../../shared/facade";

@injectable()
export default class CardService {
  constructor(
    private userRepository: UserRepository,
    private stripe: Stripe,
  ) {}

  async authorizeAddCard(args: AuthorizeCardInput): Promise<AuthorizeCardOutput> {
    const { user_id } = args;

    const checkUser = await this.userRepository.fetchOneById(user_id);

    if (!checkUser) {
      throw new BadRequestError("user not found");
    }

    const { stripe_customer_id } = checkUser;

    const { client_secret } = await this.stripe.setupIntent({ customer: stripe_customer_id! });

    if (!client_secret) {
      throw new BadRequestError("failed while generating secret");
    }

    return {
      client_secret,
    };
  }

  async saveCard(args: SaveCardInput): Promise<SaveCardOutput> {
    const { stripe_customer_id, stripe_card_id } = args;

    const user = await this.userRepository.fetchOneByCustomerId(stripe_customer_id);

    if (!user) {
      throw new BadRequestError("user not found");
    }

    const cardDetails = await this.stripe.fetchCardDetails({
      payment_method_id: stripe_card_id,
    });

    if (!cardDetails) {
      throw new BadRequestError("failed to fetch card details");
    }

    const updateAccount = await this.userRepository.updateWithCustomerId(stripe_customer_id, {
      stripe_card_id,
      stripe_card_last_digits: cardDetails.last4,
      stripe_card_expire_date: `${cardDetails.exp_month}/${cardDetails.exp_year}`,
      stripe_card_type: cardDetails.brand,
    });

    if (!updateAccount) {
      throw new BadRequestError("failed to add card to user record");
    }

    return {
      isCardSaved: true,
    };
  }
}
