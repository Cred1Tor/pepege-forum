import request from 'supertest';
import getApp from '../server/index.js';

describe('requests', () => {
  it('GET /session/new', async () => {
    await request(getApp())
      .get('/session/new')
      .expect(200, /authentication/);
  });

  it('POST /session', async () => {
    await request(getApp())
      .post('/session')
      .type('form')
      .send({ email: 'admin@admin', password: 'qwerty' })
      .expect(302);
  });

  it('POST /session (errors)', async () => {
    await request(getApp())
      .post('/session')
      .type('form')
      .send({ email: 'admin@admin', password: 'wrongpassword' })
      .expect(422);
  });

  it('DELETE /session', async () => {
    const app = getApp();
    const authRes = await request(app)
      .post('/session')
      .type('form')
      .send({ email: 'admin@admin', password: 'qwerty' })
      .expect(302);

    const cookie = authRes.headers['set-cookie'];

    await request(app)
      .delete('/session')
      .set('Cookie', cookie)
      .expect(302);
  });

  it('GET /users/new', async () => {
    await request(getApp())
      .get('/users/new')
      .expect(200, /registration/);
  });

  it('POST /users', async () => {
    const app = getApp();
    const data = { email: 'email@email', name: 'name', password: 'qwer' };

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
