import { combineClassNames } from '.';

it('combines multiple class names', () => {
  expect(combineClassNames('class1', 'class2', 'class3 class4')).toBe(
    'class1 class2 class3 class4',
  );
});

it('combines a single class name', () => {
  expect(combineClassNames('class1')).toBe('class1');
});

it('returns undefined when given no class name', () => {
  expect(combineClassNames()).toBe(undefined);
});

it('handles empty class names', () => {
  expect(combineClassNames('class1', '', 'class2', '')).toBe('class1 class2');
  expect(combineClassNames('', '')).toBe(undefined);
});

it('handles null, undefined, and false', () => {
  expect(combineClassNames('class1', null, 'class2', undefined, false)).toBe('class1 class2');
  expect(combineClassNames(null, undefined, false)).toBe(undefined);
});
