/**
 * Standard API response wrapper.
 * All controllers use this to ensure consistent response shape.
 */
class ApiResponse {
  constructor(statusCode, message, data = null, meta = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    if (data !== null) this.data = data;
    if (meta !== null) this.meta = meta;
  }
}

/**
 * Pagination meta helper
 * @param {number} total - total documents
 * @param {number} page  - current page (1-indexed)
 * @param {number} limit - items per page
 */
const paginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});

module.exports = { ApiResponse, paginationMeta };
