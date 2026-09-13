import { request } from './apiClient.js';

/* GET /api/news/ — public paginated news feed, newest first.
   The backend returns { count, next, previous, results }. */
export function listNews() {
  return request('GET', '/api/news/');
}

/* GET /api/news/{id}/ — full article (used by the detail page). */
export function getNews(id) {
  return request('GET', `/api/news/${id}/`);
}
