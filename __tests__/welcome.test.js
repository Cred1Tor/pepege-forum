import request from 'supertest';
import jestSupertestMatchers from 'jest-supertest-matchers';

import getApp from '../server/index';

const { default: matchers } = jestSupertestMatchers;

beforeAll(() => {
  expect.extend(matchers);
});

it('GET /', async () => {
  const res = await request(getApp())
    .get('/');
  expect(res).toHaveHTTPStatus(200);
});
