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
    domainName: 'holdingCompanyA.inc',
    dns: 'holdingCompanyA.inc',
    // General
    timezone: 'holdingCompanyA.inc',
    db_timezone: 'holdingCompanyA.inc',
    hashDriver: 'holdingCompanyA.inc',
    // Database
    db_name: 'holdingCompanyA.inc',
    db_user: 'holdingCompanyA.inc',
    db_password: 'holdingCompanyA.inc',
    db_host: 'holdingCompanyA.inc',
    db_port: 25,
    // Mail
    mail_from: 'holdingCompanyA.inc',
    mail_from_name: 'holdingCompanyA.inc',
    mail_smtp: 'holdingCompanyA.inc',
    mail_port: 25,
    mail_user: 'holdingCompanyA.inc',
    mail_password: 'holdingCompanyA.inc',
    mail_is_ssl: true,
    mail_is_tls: true,
    // Redis
    redis_connection: 'holdingCompanyA.inc',
    redis_password: 'holdingCompanyA.inc',
    redis_port: 6379,
    redis_host: 'holdingCompanyA.inc',
    redis_database: 0,
    redis_is_ssl: true,
    redis_is_tls: true
  },
  {
    companyId: 2,
    domainName: 'holdingCompanyB.inc',
    dns: 'holdingCompanyB.inc',
    // General
    timezone: 'holdingCompanyB.inc',
    db_timezone: 'holdingCompanyB.inc',
    hashDriver: 'holdingCompanyB.inc',
    // Database
    db_name: 'holdingCompanyB.inc',
    db_user: 'holdingCompanyB.inc',
    db_password: 'holdingCompanyB.inc',
    db_host: 'holdingCompanyB.inc',
    db_port: 25,
    // Mail
    mail_from: 'holdingCompanyB.inc',
    mail_from_name: 'holdingCompanyB.inc',
    mail_smtp: 'holdingCompanyB.inc',
    mail_port: 25,
    mail_user: 'holdingCompanyB.inc',
    mail_password: 'holdingCompanyB.inc',
    mail_is_ssl: true,
    mail_is_tls: true,
    // Redis
    redis_connection: 'holdingCompanyB.inc',
    redis_password: 'holdingCompanyB.inc',
    redis_port: 6379,
    redis_host: 'holdingCompanyB.inc',
    redis_database: 0,
    redis_is_ssl: true,
    redis_is_tls: true
  },
  {
    companyId: 3,
    domainName: 'holdingCompanyC.inc',
    dns: 'holdingCompanyC.inc',
    // General
    timezone: 'holdingCompanyC.inc',
    db_timezone: 'holdingCompanyC.inc',
    hashDriver: 'holdingCompanyC.inc',
    // Database
    db_name: 'holdingCompanyC.inc',
    db_user: 'holdingCompanyC.inc',
    db_password: 'holdingCompanyC.inc',
    db_host: 'holdingCompanyC.inc',
    db_port: 25,
    // Mail
    mail_from: 'holdingCompanyC.inc',
    mail_from_name: 'holdingCompanyC.inc',
    mail_smtp: 'holdingCompanyC.inc',
    mail_port: 25,
    mail_user: 'holdingCompanyC.inc',
    mail_password: 'holdingCompanyC.inc',
    mail_is_ssl: true,
    mail_is_tls: true,
    // Redis
    redis_connection: 'holdingCompanyC.inc',
    redis_password: 'holdingCompanyC.inc',
    redis_port: 6379,
    redis_host: 'holdingCompanyC.inc',
    redis_database: 0,
    redis_is_ssl: true,
    redis_is_tls: true
  }
]

export const headersConfiguration: TableHeader[] = [
  { text: 'Company ID', value: 'companyId', sortable: false, type: 'number' },
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
