import { json } from 'co-body'
import { validateEmail} from '../utils/validateEmail'

export async function createGiftCard(ctx: Context) {

  const {
    clients: {profileSystem, giftCard},
    vtex: {account}
  } = ctx

  const body = await json(ctx.req)

  if (!body.email ) {
    ctx.body = { message: 'missed email' }
    ctx.status = 400

    return
  }

  else if(!validateEmail(body.email)){
     ctx.body = { message: 'email com formato inválido' }
    ctx.status = 400

    return
  }

  const register = await profileSystem.getRegisterOnProfileSystem(account, body.email)

  const valueGiftCard: {id: string, redemptionCode: string} = await giftCard.createGiftCard(account, register)

  // CONECTAR COM A LISTA GRAPHQL
  const creditGiftCard = 222

  const result = await giftCard.addCreditInGiftCard(account, valueGiftCard.redemptionCode, valueGiftCard.id, creditGiftCard)

  if(result) ctx.body = 'sucess'
  else ctx.body='failed'

}
