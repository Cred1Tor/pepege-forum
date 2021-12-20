import request from 'supertest';
import getApp from '../server/index';
import dbHandler from './helpers/db-handler';
import User from '../server/models/User';
import users from '../__fixtures__/users.json';
import issueToken from './helpers/issueToken';

beforeAll(async () => dbHandler.connect());

let authLine;

beforeEach(async () => {
  await User.insertMany(users);
  const user = await User.findOne({ email: users[0].email });
  authLine = `Bearer ${issueToken({ user }, process.env.JWT_SECRET)}`;
});

afterEach(async () => dbHandler.clearDatabase());

afterAll(async () => dbHandler.closeDatabase());

describe('requests', () => {
  it('POST /session', async () => {
    await request(await getApp())
      .post('/session')
      .type('json')
      .send({ email: 'admin@admin.com', password: 'qwerty' })
      .expect(200)
      .then((response) => {
        expect(typeof response.body.token).toBe('string');
      });
  });

  it('POST /session (invalid credentials)', async () => {
    await request(await getApp())
      .post('/session')
      .type('json')
      .send({ email: 'admin@admin.com', password: 'wrongpassword' })
      .expect(403);
  });

  it('DELETE /session', async () => {
    await request(await getApp())
      .delete('/session')
      .set('Authorization', authLine)
      .expect(200);
  });

  it('DELETE /session (unauthorized)', async () => {
    await request(await getApp())
      .delete('/session')
      .expect(401);
  });
});
