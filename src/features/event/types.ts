export interface IEventCustomFields {
  attributes: Array<OrderAttribute | TicketAttribute | AddOnAttribute>
}

// ----------------- Base Structures -----------------

export interface Group {
  id: string
  label: string | null
  image: string
  type: 'order' | 'ticket' | 'add-on'
  order: string
  fields: Field[]
}

export interface Field {
  id: string
  image: string
  type: FieldType
  name: string
  order: string
  label: string
  defaultValue: string | string[]
  required: boolean
  description: string | null
  settings: FieldSettings
  options?: FieldOption[]
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'phone'
  | 'radio'
  | 'select'
  | 'select_multi'

export interface FieldSettings {
  showOnMyTickets: boolean
  showOnPdf: boolean
  showOnScan: boolean
  allowUpdate: boolean
}

export interface FieldOption {
  id: string
  name: string
  value: string
}

// ----------------- Attribute Wrappers -----------------

export interface OrderAttribute {
  order: {
    group: Group & { type: 'order' }
  }
}

export interface TicketAttribute {
  ticket: {
    group: Group & { type: 'ticket' }
  }
}

export interface AddOnAttribute {
  'add-on': {
    group: Group & { type: 'add-on' }
  }
}
