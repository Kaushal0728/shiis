export class PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;

  static of<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit) || 1;
    const res = new PaginatedResponse<T>();
    res.data = data;
    res.total = total;
    res.page = page;
    res.limit = limit;
    res.totalPages = totalPages;
    res.hasNext = page < totalPages;
    res.hasPrev = page > 1;
    return res;
  }
}
