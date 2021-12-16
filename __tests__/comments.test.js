import request from 'supertest';
import getApp from '../server/index';
import dbHandler from './helpers/db-handler';
import User from '../server/models/User';
import users from '../__fixtures__/users.json';
import issueToken from './helpers/issueToken';

let app;
let adminAuthLine;
let userAuthLine;
let topicId;

beforeAll(async () => {
  await dbHandler.connect();
  await User.insertMany(users);
  app = await getApp();
  const { id: adminId } = await User.findOne({ email: users[0].email });
  const { id: userId } = await User.findOne({ email: users[1].email });
  adminAuthLine = `Bearer ${issueToken({ id: adminId }, process.env.JWT_SECRET)}`;
  userAuthLine = `Bearer ${issueToken({ id: userId }, process.env.JWT_SECRET)}`;
});

beforeEach(async () => {
  const res = await request(app)
    .post('/topics')
    .type('json')
    .set('Authorization', adminAuthLine)
    .send({ title: 'topic title', body: 'topic body' });

  // eslint-disable-next-line no-underscore-dangle
  topicId = res.body._id;
});

afterEach(async () => dbHandler.clearCollection('topics'));

afterAll(async () => dbHandler.closeDatabase());

it('POST /topics/:id/comments', async () => {
  await request(app)
    .post(`/topics/${topicId}/comments`)
    .type('json')
    .send({ body: 'comment body' })
    .set('Authorization', adminAuthLine)
    .expect(200, /comment body/);
});

it('POST /topics/:id/comments (errors)', async () => {
  await request(app)
    .post(`/topics/${topicId}/comments`)
    .set('Authorization', userAuthLine)
    .expect(422);

  await request(app)
    .post(`/topics/${topicId}/comments`)
    .type('json')
    .send({ body: 'comment body' })
    .expect(401);
});

it('PATCH topics/:id/comments/:commentId', async () => {
  const res = await request(app)
    .post(`/topics/${topicId}/comments`)
    .type('json')
    .set('Authorization', userAuthLine)
    .send({ body: 'old comment body' });

  // eslint-disable-next-line no-underscore-dangle
  const commentId = res.body._id;

  await request(app)
    .patch(`/topics/${topicId}/comments/${commentId}`)
    .type('json')
    .send({ body: 'new comment body' })
    .set('Authorization', userAuthLine)
    .expect(200, /new comment body/)
    .expect((response) => {
      expect(response.text).not.toMatch('old comment body');
    });
});

it('PATCH topics/:id/comments/:commentId (unproccessable entity)', async () => {
  const res = await request(app)
    .post(`/topics/${topicId}/comments`)
    .type('json')
    .set('Authorization', userAuthLine)
    .send({ body: 'comment body' });

  // eslint-disable-next-line no-underscore-dangle
  const commentId = res.body._id;

  await request(app)
    .patch(`/topics/${topicId}/comments/${commentId}`)
    .set('Authorization', userAuthLine)
    .expect(422);
});

it('DELETE topics/:id/comments/:commentId', async () => {
  const res = await request(app)
    .post(`/topics/${topicId}/comments`)
    .type('json')
    .set('Authorization', userAuthLine)
    .send({ body: 'comment body' });

  // eslint-disable-next-line no-underscore-dangle
  const commentId = res.body._id;

  await request(app)
    .delete(`/topics/${topicId}/comments/${commentId}`)
    .set('Authorization', userAuthLine)
    .expect(200);
});

it('DELETE topics/:id/comments/:commentId (unauthorized)', async () => {
  const res = await request(app)
    .post(`/topics/${topicId}/comments`)
    .type('json')
    .set('Authorization', adminAuthLine)
    .send({ body: 'comment body' });

  // eslint-disable-next-line no-underscore-dangle
  const commentId = res.body._id;

  await request(app)
    .delete(`/topics/${topicId}/comments/${commentId}`)
    .expect(401);
});

it('test admin rights', async () => {
  const res = await request(app)
    .post(`/topics/${topicId}/comments`)
    .type('json')
    .set('Authorization', userAuthLine)
    .send({ body: 'old comment body' });

  // eslint-disable-next-line no-underscore-dangle
  const commentId = res.body._id;

  await request(app)
    .patch(`/topics/${topicId}/comments/${commentId}`)
    .type('json')
    .send({ body: 'new comment body' })
    .set('Authorization', adminAuthLine)
    .expect(200, /new comment body/)
    .expect((response) => {
      expect(response.text).not.toMatch('old comment body');
    });

  await request(app)
    .delete(`/topics/${topicId}/comments/${commentId}`)
    .set('Authorization', adminAuthLine)
    .expect(200);
});
