import type { TableHeader } from '@components/tables/types/types'

export type Configuration = {
  companyId: number
  domainName: string
  dns: string
  // General
  timezone: string
  db_timezone: string
  hashDriver: string
  // Database
  db_name: string
  db_user: string
  db_password: string
  db_host: string
  db_port: number
  // Mail
  mail_from: string
  mail_from_name: string
  mail_smtp: string
  mail_port: number
  mail_user: string
  mail_password: string
  mail_is_ssl: boolean
  mail_is_tls: boolean
  // Redis
  redis_connection: string
  redis_password: string
  redis_port: number
  redis_host: string
  redis_database: number
  redis_is_ssl: boolean
  redis_is_tls: boolean
}

export const configurationData: Configuration[] = [
  {
    companyId: 1,
    domainName: 'companyE.inc',
    dns: 'companyE.inc',
    // General
    timezone: 'companyE.inc',
    db_timezone: 'companyE.inc',
    hashDriver: 'companyE.inc',
    // Database
    db_name: 'companyE.inc',
    db_user: 'companyE.inc',
    db_password: 'companyE.inc',
    db_host: 'companyE.inc',
    db_port: 25,
    // Mail
    mail_from: 'companyE.inc',
    mail_from_name: 'companyE.inc',
    mail_smtp: 'companyE.inc',
    mail_port: 25,
    mail_user: 'companyE.inc',
    mail_password: 'companyE.inc',
    mail_is_ssl: true,
    mail_is_tls: true,
    // Redis
    redis_connection: 'companyE.inc',
    redis_password: 'companyE.inc',
    redis_port: 6379,
    redis_host: 'companyE.inc',
    redis_database: 0,
    redis_is_ssl: true,
    redis_is_tls: true
  }
]

export const headersConfiguration: TableHeader[] = [
  { text: 'Company ID', value: 'company', sortable: false, type: 'number' },
  { text: 'Domain Name', value: 'domainName', sortable: false, type: 'text' },
  { text: 'DNS', value: 'dns', sortable: false, type: 'text' },
  { text: 'Mail From', value: 'mail_from', sortable: false, type: 'text' },
  { text: 'Mail From Name', value: 'mail_from_name', sortable: false, type: 'text' },
  { text: 'Mail SMTP', value: 'mail_smtp', sortable: false, type: 'text' },
  { text: 'Mail Port', value: 'mail_port', sortable: false, type: 'number' },
  { text: 'Mail User', value: 'mail_user', sortable: false, type: 'text' },
  { text: 'Mail Password', value: 'mail_password', sortable: false, type: 'text' },
  { text: 'Mail Is SSL', value: 'mail_is_ssl', sortable: false, type: 'boolean' },
  { text: 'Mail Is TLS', value: 'mail_is_tls', sortable: false, type: 'boolean' },
  { text: 'Redis Connection', value: 'redis_connection', sortable: false, type: 'text' },
  { text: 'Redis Password', value: 'redis_password', sortable: false, type: 'text' },
  { text: 'Redis Port', value: 'redis_port', sortable: false, type: 'number' },
  { text: 'Redis Host', value: 'redis_host', sortable: false, type: 'text' },
  { text: 'Redis Database', value: 'redis_database', sortable: false, type: 'number' },
  { text: 'Redis Is SSL', value: 'redis_is_ssl', sortable: false, type: 'boolean' },
  { text: 'Redis Is TLS', value: 'redis_is_tls', sortable: false, type: 'boolean' }
]
