export interface IAddOnResponse {
  attributes: {
    active: boolean
    addOnGroupId?: number
    cost: number
    currency: string
    description?: string
    equivalentTicketTypeId?: number
    feeIncluded: boolean
    flagLimitToTicketQuantity: boolean
    groupName?: string
    groupSortOrder?: any
    hasSales: boolean
    id: string
    image?: string
    imageUrl?: string
    level: string
    limitPerTicket?: any
    maxQuantity?: number
    name: string
    prerequisiteTicketTypeIds?: any
    price: number
    sortOrder: string
    stock: number
    type?: any
    withholdFromResale: boolean
  }
  id: string
  type?: string
}
