import {
  IRemoveTicketFromResaleResponse,
  IResaleTicketResponse,
} from '../../api/types'

type OrderDetailsCoreHandle = {
  resaleTicket(
    data: FormData,
    orderHash: string
  ): Promise<IResaleTicketResponse>

  removeTicketFromResale(
    orderHash: string
  ): Promise<IRemoveTicketFromResaleResponse>
}

export default OrderDetailsCoreHandle
