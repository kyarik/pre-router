/**
 * Creates a path regex from the given parameterized path.
 * @param parameterizedPath Path which may have parameters.
 */
export const createPathRegex = (parameterizedPath: string) => {
  const paramNamesWithColons = parameterizedPath.match(/:\w+/g);
  const paramNames = paramNamesWithColons ? paramNamesWithColons.map(name => name.slice(1)) : [];

  const regexString = parameterizedPath.replace(
    new RegExp(`:(?:${paramNames.join('|')})(\\([^)]+?\\))?`, 'g'),
    (_, customRegexSring) => customRegexSring || '([\\w-]+)',
  );

  const regex = new RegExp(`^${regexString}$`);

  return {
    regex,
    paramNames,
  };
};
