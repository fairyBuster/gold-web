/* ============================================================================
   productsApi.js — investment product catalog endpoints.
   ============================================================================ */

import { request } from './apiClient.js';

/* GET /api/products/ — active products for regular users, cheapest first.
   The backend returns { count, results } (no page `next`/`previous` links). */
export function listProducts() {
  return request('GET', '/api/products/');
}

/* GET /api/products/{id}/ — full product detail (claim settings, balance
   source and the custom info fields included). */
export function getProduct(id) {
  return request('GET', `/api/products/${id}/`);
}

/* POST /api/products/purchase/ — buy a plan: the price is deducted from the
   product's balance source and an investment + INVESTMENTS transaction are
   created. 201 returns the new investment; 400 carries the reason
   (insufficient balance, stock, purchase limit, ...). The withdraw PIN stays
   optional server-side (admin toggle per product). */
export function purchaseProduct(productId, quantity = 1) {
  return request('POST', '/api/products/purchase/', { product_id: productId, quantity });
}
