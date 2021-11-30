import request from 'supertest';
import jestSupertestMatchers from 'jest-supertest-matchers';
import getApp from '../server/index.js';
import signIn from './helpers/signIn.js';

const { default: matchers } = jestSupertestMatchers;

describe('requests', () => {
  beforeAll(() => {
    expect.extend(matchers);
  });

  it('GET /topics', async () => {
    const res = await request(getApp()).get('/topics');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET /topics/new', async () => {
    const app = getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    const res = await request(app)
      .get('/topics/new')
      .set('Cookie', authCookie);
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET /topics/new (unauthorized)', async () => {
    const res = await request(getApp())
      .get('/topics/new');
    expect(res).toHaveHTTPStatus(403);
  });

  it('POST /topics', async () => {
    const app = getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    const res = await request(app)
      .post('/topics')
      .type('form')
      .set('Cookie', authCookie)
      .send({ title: 'topic title', body: 'topic body' });
    expect(res).toHaveHTTPStatus(302);
  });

  it('POST /topics (errors)', async () => {
    const app = getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    const res = await request(app)
      .post('/topics')
      .set('Cookie', authCookie);
    expect(res).toHaveHTTPStatus(422);
  });

  it('GET topics/:id', async () => {
    const app = getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    const res1 = await request(app)
      .post('/topics')
      .type('form')
      .set('Cookie', authCookie)
      .send({ title: 'topic title', body: 'topic body' });
    expect(res1).toHaveHTTPStatus(302);
    const url = res1.headers.location;
    const res2 = await request(app)
      .get(url);
    expect(res2).toHaveHTTPStatus(200);
  });

  it('PATCH topics/:id', async () => {
    const app = getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    const res1 = await request(app)
      .post('/topics')
      .type('form')
      .set('Cookie', authCookie)
      .send({ title: 'topic title', body: 'topic body' });
    const url = res1.headers.location.match(/\/topics\/\d+/)[0];
    const res2 = await request(app)
      .patch(url)
      .type('form')
      .set('Cookie', authCookie)
      .send({ title: 'new topic title', body: 'new topic body' });
    expect(res2).toHaveHTTPStatus(302);
  });

  it('PATCH topics/:id (unproccessable entity)', async () => {
    const app = getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    const res1 = await request(app)
      .post('/topics')
      .type('form')
      .set('Cookie', authCookie)
      .send({ title: 'post title', body: 'post body' });
    const url = res1.headers.location.match(/\/topics\/\d+/)[0];
    const res2 = await request(app)
      .patch(url)
      .set('Cookie', authCookie);
    expect(res2).toHaveHTTPStatus(422);
  });

  it('DELETE topics/:id', async () => {
    const app = getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    const res1 = await request(app)
      .post('/topics')
      .type('form')
      .set('Cookie', authCookie)
      .send({ title: 'post title', body: 'post body' });
    const url = res1.headers.location.match(/\/topics\/\d+/)[0];
    const res2 = await request(app)
      .delete(url)
      .set('Cookie', authCookie);
    expect(res2).toHaveHTTPStatus(302);
  });

  it('DELETE topics/:id (unauthorized)', async () => {
    const app = getApp();
    const authCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    const res1 = await request(app)
      .post('/topics')
      .type('form')
      .set('Cookie', authCookie)
      .send({ title: 'post title', body: 'post body' });
    const url = res1.headers.location.match(/\/topics\/\d+/)[0];
    const res2 = await request(app)
      .delete(url);
    expect(res2).toHaveHTTPStatus(403);
  });
});
