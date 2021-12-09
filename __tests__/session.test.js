import request from 'supertest';
import getApp from '../server/index.js';
import dbHandler from './helpers/db-handler.js';
import User from '../server/models/User.js';
import users from '../__fixtures__/users.json';

beforeAll(async () => dbHandler.connect());

beforeEach(async () => User.insertMany(users));

afterEach(async () => dbHandler.clearDatabase());

afterAll(async () => dbHandler.closeDatabase());

describe('requests', () => {
  it('GET /session/new', async () => {
    await request(await getApp())
      .get('/session/new')
      .expect(200, /authentication/);
  });

  it('POST /session', async () => {
    await request(await getApp())
      .post('/session')
      .type('form')
      .send({ email: 'admin@admin.com', password: 'qwerty' })
      .expect(302);
  });

  it('POST /session (errors)', async () => {
    await request(await getApp())
      .post('/session')
      .type('form')
      .send({ email: 'admin@admin.com', password: 'wrongpassword' })
      .expect(422);
  });

  it('DELETE /session', async () => {
    const app = await getApp();
    const authRes = await request(app)
      .post('/session')
      .type('form')
      .send({ email: 'admin@admin.com', password: 'qwerty' })
      .expect(302);

    const cookie = authRes.headers['set-cookie'];

    await request(app)
      .delete('/session')
      .set('Cookie', cookie)
      .expect(302);
  });

  it('GET /users/new', async () => {
    await request(await getApp())
      .get('/users/new')
      .expect(200, /registration/);
  });

  it('POST /users', async () => {
    const app = await getApp();
    const data = { email: 'email@email.org', name: 'name', password: 'qwer' };

    await request(app)
      .post('/users')
      .type('form')
      .send(data)
      .expect(302);

    await request(app)
      .post('/session')
      .type('form')
      .send(data)
      .expect(302);

    await request(app)
      .post('/session')
      .type('form')
      .send({})
      .expect(422);
  });
});
