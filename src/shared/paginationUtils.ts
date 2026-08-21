export const getPaginationOptions = (
  pageQuery: any,
  limitQuery: any,
  defaultLimit = 10
) => {
  const page = Math.max(1, parseInt(pageQuery as string) || 1);
  const limit = Math.max(1, parseInt(limitQuery as string) || defaultLimit);
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};
