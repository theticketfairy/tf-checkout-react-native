import type {
  IRemoveTicketFromResaleResponse,
  IResaleTicketResponse,
} from '../../api/types'
import type { SessionCoreHandleType } from '../Session/SessionCoreTypes'

type OrderDetailsCoreHandleType = {
  resaleTicket(
    data: FormData,
    orderHash: string
  ): Promise<IResaleTicketResponse>

  removeTicketFromResale(
    orderHash: string
  ): Promise<IRemoveTicketFromResaleResponse>
}

export type OrderDetailsCoreHandle = OrderDetailsCoreHandleType &
  SessionCoreHandleType
