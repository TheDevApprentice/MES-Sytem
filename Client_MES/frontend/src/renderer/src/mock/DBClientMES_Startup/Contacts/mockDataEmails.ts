import { TableHeader } from "@renderer/components/tables"
import { Email } from '@renderer/mock/Types/types'

// (Représente la futur table en base de donnée)
export const emailData: Email[] = [
  {
    id: 1,
    email: 'email1@example.com',
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 2,
    email: 'email2@example.com',
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  },
  {
    id: 3,
    email: 'email3@example.com',
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString()
  }
]

export const headersEmails: TableHeader[] = [
  { text: 'Id', value: 'id', sortable: false, type: 'number' },
  { text: 'Email', value: 'email', sortable: false, type: 'text' },
  { text: 'Created At', value: 'createdAt', sortable: false, type: 'date' },
  { text: 'Updated At', value: 'updatedAt', sortable: false, type: 'date' }
]
