import request from 'supertest';
import getApp from '../server/index.js';
import signIn from './helpers/signIn.js';

describe('requests', () => {
  it('GET /topics', async () => {
    await request(await getApp())
      .get('/topics')
      .expect(200, /Topics/);
  });

  it('GET /topics/new', async () => {
    const app = await getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    await request(app)
      .get('/topics/new')
      .set('Cookie', authCookie)
      .expect(200, /new topic/);
  });

  it('GET /topics/new (unauthorized)', async () => {
    await request(await getApp())
      .get('/topics/new')
      .expect(403);
  });

  it('POST /topics', async () => {
    const app = await getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    await request(app)
      .post('/topics')
      .type('form')
      .set('Cookie', authCookie)
      .send({ title: 'topic title', body: 'topic body' })
      .expect(302);

    await request(app)
      .get('/topics')
      .expect(200, /topic title/);
  });

  it('POST /topics (errors)', async () => {
    const app = await getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    await request(app)
      .post('/topics')
      .set('Cookie', authCookie)
      .expect(422);
  });

  it('GET topics/:id', async () => {
    const app = await getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    const res = await request(app)
      .post('/topics')
      .type('form')
      .set('Cookie', authCookie)
      .send({ title: 'topic title', body: 'topic body' })
      .expect(302);

    const url = res.headers.location;
    await request(app)
      .get(url)
      .expect(200, /topic body/);
  });

  it('PATCH topics/:id', async () => {
    const app = await getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    const res = await request(app)
      .post('/topics')
      .type('form')
      .set('Cookie', authCookie)
      .send({ title: 'topic title', body: 'topic body' });

    const url = res.headers.location;
    await request(app)
      .patch(url)
      .type('form')
      .set('Cookie', authCookie)
      .send({ title: 'new topic title', body: 'new topic body' })
      .expect(302);
  });

  it('PATCH topics/:id (unproccessable entity)', async () => {
    const app = await getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    const res = await request(app)
      .post('/topics')
      .type('form')
      .set('Cookie', authCookie)
      .send({ title: 'post title', body: 'post body' });

    const url = res.headers.location;
    await request(app)
      .patch(url)
      .set('Cookie', authCookie)
      .expect(422);
  });

  it('DELETE topics/:id', async () => {
    const app = await getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    const res = await request(app)
      .post('/topics')
      .type('form')
      .set('Cookie', authCookie)
      .send({ title: 'post title', body: 'post body' });

    const url = res.headers.location;
    await request(app)
      .delete(url)
      .set('Cookie', authCookie)
      .expect(302);
  });

  it('DELETE topics/:id (unauthorized)', async () => {
    const app = await getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    const res = await request(app)
      .post('/topics')
      .type('form')
      .set('Cookie', authCookie)
      .send({ title: 'post title', body: 'post body' });

    const url = res.headers.location;
    await request(app)
      .delete(url)
      .expect(403);
  });
});
