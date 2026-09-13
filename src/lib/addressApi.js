/* ============================================================================
   addressApi.js — the user's saved shipping addresses ("Alamat Pengiriman"
   form + prefill). The backend returns the primary address first.
   ============================================================================ */

import { request } from './apiClient.js';

/* GET /api/auth/address/ — the current user's saved addresses, paginated
   ({count, next, previous, results}), primary address first. Requires the
   Bearer token. */
export function listAddresses() {
  return request('GET', '/api/auth/address/');
}

/* POST /api/auth/address/ — save a new address for the current user.
   is_primary=true unsets the previous primary (backend behavior). */
export function createAddress({ recipientName, phoneNumber, addressDetails, houseNumber, isPrimary }) {
  return request('POST', '/api/auth/address/', {
    recipient_name: recipientName,
    phone_number: phoneNumber,
    address_details: addressDetails,
    house_number: houseNumber || '',
    is_primary: Boolean(isPrimary),
  });
}
