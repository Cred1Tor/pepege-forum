import request from 'supertest';
import getApp from '../server/index';
import dbHandler from './helpers/db-handler';

beforeAll(async () => dbHandler.connect());

afterEach(async () => dbHandler.clearDatabase());

afterAll(async () => dbHandler.closeDatabase());

it('POST /users', async () => {
  const app = await getApp();
  const data = { email: 'email@email.org', name: 'name', password: 'qwer' };

  await request(app)
    .post('/users')
    .type('json')
    .send(data)
    .expect(200);

  await request(app)
    .post('/session')
    .type('json')
    .send(data)
    .expect(200);

  await request(app)
    .post('/session')
    .type('json')
    .send({})
    .expect(403);
});
