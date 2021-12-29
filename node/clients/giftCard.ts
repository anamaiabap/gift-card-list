import { JanusClient } from '@vtex/api'
import type { InstanceOptions, IOContext } from '@vtex/api'

export class giftCard extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
        ...(ctx.authToken
          ? { VtexIdclientAutCookie: ctx.authToken }
          : null),
      },
    })
  }

  public async createGiftCard(account: string, profileIdValue:string) {

    const value = await this.http.post<{id: string, redemptionCode: string}>(
      `https://${account}.vtexcommercestable.com.br/api/giftcards`,
      {
        relationName:"loyalty-program",
        expiringDate:"9999-12-31T23:59:59.997",
        profileId:profileIdValue,
        multipleRedemptions:true,
        multipleCredits:true,
        restrictedToOwner:false
      }
    )

    return {id: value.id, redemptionCode: value.redemptionCode}

  }

  public async addCreditInGiftCard(account: string, redemptionCodeValue:string, id:string, valueGiftCard: number) {

    const value = await this.http.post<{id: string}>(
      `https://api.vtex.com/${account}/giftcards/${id}/transactions`,
      {
        operation: "Credit",
        value: valueGiftCard,
        redemptionCode: redemptionCodeValue
      }
    )

    if(value.id != null) return true
    else return false
  }

}
