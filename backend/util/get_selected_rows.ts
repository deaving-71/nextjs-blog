export function getSelectedRows({
  count,
  limit,
  page,
}: {
  count: number;
  limit: number;
  page: number;
}) {
  const pages = [];
  let totalPages = count / limit;
  const pagesCount = Math.floor(totalPages);

  for (let i = 1; i <= pagesCount; i++) {
    pages.push(i * limit);
  }

  const leftOver = totalPages - pagesCount;

  if (leftOver > 0) pages.push(totalPages * limit);

  const rowsSelected = pages[page - 1];
  return Math.floor(rowsSelected);
}
