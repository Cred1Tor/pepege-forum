import request from 'supertest';
import getApp from '../server/index.js';
import signIn from './helpers/signIn.js';

describe('requests', () => {
  let app;
  let adminAuthCookie;
  let userAuthCookie;
  let topicId;

  beforeEach(async () => {
    app = await getApp();
    adminAuthCookie = await signIn(app, { email: 'admin@admin', password: 'qwerty' });
    userAuthCookie = await signIn(app, { email: 'user@user', password: '123' });
    const res = await request(app)
      .post('/topics')
      .type('form')
      .set('Cookie', adminAuthCookie)
      .send({ title: 'topic title', body: 'topic body' });

    topicId = res.get('Topic-Id');
  });

  it('POST /topics/:id/comments', async () => {
    await request(app)
      .post(`/topics/${topicId}/comments`)
      .type('form')
      .send({ body: 'comment body' })
      .set('Cookie', adminAuthCookie)
      .expect(201, /comment body/);
  });

  it('POST /topics/:id/comments (errors)', async () => {
    await request(app)
      .post(`/topics/${topicId}/comments`)
      .set('Cookie', userAuthCookie)
      .expect(422);

    await request(app)
      .post(`/topics/${topicId}/comments`)
      .type('form')
      .send({ body: 'comment body' })
      .expect(403);
  });

  it('PATCH topics/:id/comments/:commentId', async () => {
    const res = await request(app)
      .post(`/topics/${topicId}/comments`)
      .type('form')
      .set('Cookie', userAuthCookie)
      .send({ body: 'old comment body' });

    const commentId = res.get('Comment-Id');

    await request(app)
      .patch(`/topics/${topicId}/comments/${commentId}`)
      .type('form')
      .send({ body: 'new comment body' })
      .set('Cookie', userAuthCookie)
      .expect(200, /new comment body/)
      .expect((response) => {
        expect(response.text).not.toMatch('old comment body');
      });
  });

  it('PATCH topics/:id/comments/:commentId (unproccessable entity)', async () => {
    const res = await request(app)
      .post(`/topics/${topicId}/comments`)
      .type('form')
      .set('Cookie', userAuthCookie)
      .send({ body: 'comment body' });

    const commentId = res.get('Comment-Id');

    await request(app)
      .patch(`/topics/${topicId}/comments/${commentId}`)
      .set('Cookie', userAuthCookie)
      .expect(422);
  });

  it('DELETE topics/:id/comments/:commentId', async () => {
    const res = await request(app)
      .post(`/topics/${topicId}/comments`)
      .type('form')
      .set('Cookie', userAuthCookie)
      .send({ body: 'comment body' });

    const commentId = res.get('Comment-Id');

    await request(app)
      .delete(`/topics/${topicId}/comments/${commentId}`)
      .set('Cookie', userAuthCookie)
      .expect(200)
      .expect((response) => {
        expect(response.text).not.toMatch('comment body');
      });
  });

  it('DELETE topics/:id/comments/:commentId (unauthorized)', async () => {
    const res = await request(app)
      .post(`/topics/${topicId}/comments`)
      .type('form')
      .set('Cookie', adminAuthCookie)
      .send({ body: 'comment body' });

    const commentId = res.get('Comment-Id');

    await request(app)
      .delete(`/topics/${topicId}/comments/${commentId}`)
      .expect(403);
  });

  it('test admin rights', async () => {
    const res = await request(app)
      .post(`/topics/${topicId}/comments`)
      .type('form')
      .set('Cookie', userAuthCookie)
      .send({ body: 'old comment body' });

    const commentId = res.get('Comment-Id');

    await request(app)
      .patch(`/topics/${topicId}/comments/${commentId}`)
      .type('form')
      .send({ body: 'new comment body' })
      .set('Cookie', adminAuthCookie)
      .expect(200, /new comment body/)
      .expect((response) => {
        expect(response.text).not.toMatch('old comment body');
      });

    await request(app)
      .delete(`/topics/${topicId}/comments/${commentId}`)
      .set('Cookie', adminAuthCookie)
      .expect(200)
      .expect((response) => {
        expect(response.text).not.toMatch('comment body');
      });
  });
});
