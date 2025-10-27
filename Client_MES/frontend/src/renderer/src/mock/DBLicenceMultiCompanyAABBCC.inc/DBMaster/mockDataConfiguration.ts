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
    domainName: 'companyAA.inc',
    dns: 'companyAA.inc',
    // General
    timezone: 'companyAA.inc',
    db_timezone: 'companyAA.inc',
    hashDriver: 'companyAA.inc',
    // Database
    db_name: 'companyAA.inc',
    db_user: 'companyAA.inc',
    db_password: 'companyAA.inc',
    db_host: 'companyAA.inc',
    db_port: 25,
    // Mail
    mail_from: 'companyAA.inc',
    mail_from_name: 'companyAA.inc',
    mail_smtp: 'companyAA.inc',
    mail_port: 25,
    mail_user: 'companyAA.inc',
    mail_password: 'companyAA.inc',
    mail_is_ssl: true,
    mail_is_tls: true,
    // Redis
    redis_connection: 'companyAA.inc',
    redis_password: 'companyAA.inc',
    redis_port: 6379,
    redis_host: 'companyAA.inc',
    redis_database: 0,
    redis_is_ssl: true,
    redis_is_tls: true
  },
  {
    companyId: 2,
    domainName: 'companyBB.inc',
    dns: 'companyBB.inc',
    // General
    timezone: 'companyBB.inc',
    db_timezone: 'companyBB.inc',
    hashDriver: 'companyBB.inc',
    // Database
    db_name: 'companyBB.inc',
    db_user: 'companyBB.inc',
    db_password: 'companyBB.inc',
    db_host: 'companyBB.inc',
    db_port: 25,
    // Mail
    mail_from: 'companyBB.inc',
    mail_from_name: 'companyBB.inc',
    mail_smtp: 'companyBB.inc',
    mail_port: 25,
    mail_user: 'companyBB.inc',
    mail_password: 'companyBB.inc',
    mail_is_ssl: true,
    mail_is_tls: true,
    // Redis
    redis_connection: 'companyBB.inc',
    redis_password: 'companyBB.inc',
    redis_port: 6379,
    redis_host: 'companyBB.inc',
    redis_database: 0,
    redis_is_ssl: true,
    redis_is_tls: true
  },
  {
    companyId: 3,
    domainName: 'companyCC.inc',
    dns: 'companyCC.inc',
    // General
    timezone: 'companyCC.inc',
    db_timezone: 'companyCC.inc',
    hashDriver: 'companyCC.inc',
    // Database
    db_name: 'companyCC.inc',
    db_user: 'companyCC.inc',
    db_password: 'companyCC.inc',
    db_host: 'companyCC.inc',
    db_port: 25,
    // Mail
    mail_from: 'companyCC.inc',
    mail_from_name: 'companyCC.inc',
    mail_smtp: 'companyCC.inc',
    mail_port: 25,
    mail_user: 'companyCC.inc',
    mail_password: 'companyCC.inc',
    mail_is_ssl: true,
    mail_is_tls: true,
    // Redis
    redis_connection: 'companyCC.inc',
    redis_password: 'companyCC.inc',
    redis_port: 6379,
    redis_host: 'companyCC.inc',
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
