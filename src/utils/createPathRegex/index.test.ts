import { createPathRegex } from '.';

it('creates a path regex for a path without parameters', () => {
  const path = '/hello';
  const expectedResult = {
    paramNames: [],
    regex: /^\/hello$/,
  };

  expect(createPathRegex(path)).toEqual(expectedResult);
});

it('creates a path regex for a path with parameters', () => {
  const path = '/:param1/:param2';
  const expectedResult = {
    paramNames: ['param1', 'param2'],
    regex: /^\/([\w-]+)\/([\w-]+)$/,
  };

  expect(createPathRegex(path)).toEqual(expectedResult);
});

it('creates a path regex for a path with parameters with custom regex', () => {
  const path = '/:param1([a-z]+)/:param2(\\d+)';
  const expectedResult = {
    paramNames: ['param1', 'param2'],
    regex: /^\/([a-z]+)\/(\d+)$/,
  };

  expect(createPathRegex(path)).toEqual(expectedResult);
});

it('considers only word characters to be part of parameter names', () => {
  const path = '/:param1@:param2/start-:param3-end';
  const expectedResult = {
    paramNames: ['param1', 'param2', 'param3'],
    regex: /^\/([\w-]+)@([\w-]+)\/start-([\w-]+)-end$/,
  };

  expect(createPathRegex(path)).toEqual(expectedResult);
});
