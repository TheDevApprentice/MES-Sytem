import { tenantsData, headersTenants } from './Tenants/mockDataTenants'
import { tenantsAddressesData, tenantsContactsData } from './Tenants/mockDataTenantsInformations'
import {
  headersTenantsAddresses,
  headersTenantsContacts
} from './Tenants/mockDataTenantsInformations'
import { tenantMasterLicenceData, masterLicenceData, headersTenantLicence, headersMasterLicence } from './Licences/mockDataMasterTenantsLicences'
import { revokedTenantMasterLicenceData, headersRevokedTenantMasterLicence } from './Licences/mockDataRevokedMasterLicences'
import { addressData, addressCountryData, headersAddresses } from './Addresses/mockDataAddresses'
import { contactData, headersContacts } from './Contacts/mockDataContacts'
import { emailData, headersEmails } from './Contacts/mockDataEmails'
import { phoneData, headersPhones } from './Contacts/mockDataPhones'
import { productLicenceData, headersProductLicence } from './Billings/Products/mockDataProducts'

export default {
  tenantsData,
  tenantsAddressesData,
  tenantsContactsData,
  tenantMasterLicenceData,
  masterLicenceData,
  addressData,
  addressCountryData,
  contactData,
  emailData,
  phoneData,
  productLicenceData,
  revokedTenantMasterLicenceData,
  headersMasterLicence,
  headersProductLicence,
  headersEmails,
  headersPhones,
  headersTenants,
  headersTenantsAddresses,
  headersTenantsContacts,
  headersTenantLicence,
  headersAddresses,
  headersContacts,
  headersRevokedTenantMasterLicence
}
