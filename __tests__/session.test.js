import request from 'supertest';
import jestSupertestMatchers from 'jest-supertest-matchers';

import getApp from '../server/index.js';

const { default: matchers } = jestSupertestMatchers;

describe('requests', () => {
  beforeAll(() => {
    expect.extend(matchers);
  });
  it('GET /session/new', async () => {
    const res = await request(getApp())
      .get('/session/new');
    expect(res).toHaveHTTPStatus(200);
  });

  it('POST /session', async () => {
    const res = await request(getApp())
      .post('/session')
      .type('form')
      .send({ email: 'admin@admin', password: 'qwerty' });
    expect(res).toHaveHTTPStatus(302);
  });

  it('POST /session (errors)', async () => {
    const res = await request(getApp())
      .post('/session')
      .type('form')
      .send({ email: 'admin@admin', password: 'wrongpassword' });
    expect(res).toHaveHTTPStatus(422);
  });

  it('DELETE /session', async () => {
    const app = getApp();
    const authRes = await request(app)
      .post('/session')
      .type('form')
      .send({ email: 'admin@admin', password: 'qwerty' });
    expect(authRes).toHaveHTTPStatus(302);
    const cookie = authRes.headers['set-cookie'];

    const res = await request(app)
      .delete('/session')
      .set('Cookie', cookie);
    expect(res).toHaveHTTPStatus(302);
  });

  it('GET /', async () => {
    const res = await request(getApp())
      .get('/');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET /users/new', async () => {
    const res = await request(getApp())
      .get('/users/new');
    expect(res).toHaveHTTPStatus(200);
  });

  it('POST /users', async () => {
    const query = request(getApp());
    const data = { email: 'email', password: 'qwer' };

    const res = await query
      .post('/users')
      .type('form')
      .send(data);
    expect(res).toHaveHTTPStatus(302);

    const res2 = await query
      .post('/session')
      .type('form')
      .send(data);
    expect(res2).toHaveHTTPStatus(302);

    const res3 = await query
      .post('/session')
      .type('form')
      .send({});
    expect(res3).toHaveHTTPStatus(422);
  });
});
