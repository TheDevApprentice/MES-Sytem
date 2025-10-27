import { TableHeader } from '@renderer/components/tables'
import { User } from '@renderer/mock/Types/types'

export const usersData: User[] = [
  {
    id: 1,
    name: 'User 1',
    username: 'admin',
    email: 'user1@companye.inc',
    password: 'admin'
  }
]

export const headersUsers: TableHeader[] = [
  { text: 'Id', value: 'id', sortable: false, type: 'number' },
  { text: 'Name', value: 'name', sortable: false, type: 'text' },
  { text: 'Username', value: 'username', sortable: false, type: 'text' },
  { text: 'Email', value: 'email', sortable: false, type: 'text' },
  { text: 'Role', value: 'role', sortable: false, type: 'text' },
  { text: 'Permissions', value: 'permissions', sortable: false, type: 'text' }
]
