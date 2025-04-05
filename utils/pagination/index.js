const pagination = (length, currentPage) => {
  const start = (currentPage - 1) * 20;
  const end = currentPage * 20;
  const numberOfPages = Math.round(length / 20);
  return { numberOfPages, start, end };
};

module.exports = pagination;
