export const combineClassNames = (...classNames: (string | null | undefined | false)[]) =>
  classNames.reduce<string | undefined>((combined, className) => {
    if (!className) {
      return combined;
    }

    if (combined) {
      return `${combined} ${className}`;
    }

    return className;
  }, undefined);
