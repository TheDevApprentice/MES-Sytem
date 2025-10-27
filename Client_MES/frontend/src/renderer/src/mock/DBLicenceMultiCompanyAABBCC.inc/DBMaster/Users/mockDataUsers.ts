import { TableHeader } from '@renderer/components/tables'

export type User = {
    id: number,
    name: string,
    username: string,
    email: string,
}

export const usersData: User[] = [
  {
    id: 1,
    name: 'User 1',
    username: 'admin',
    email: 'user1@companye.inc',
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
