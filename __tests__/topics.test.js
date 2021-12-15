import request from 'supertest';
import getApp from '../server/index.js';
import dbHandler from './helpers/db-handler.js';
import User from '../server/models/User.js';
import users from '../__fixtures__/users.json';
import issueToken from './helpers/issueToken.js';

let adminAuthLine;

beforeAll(async () => {
  await dbHandler.connect();
  await User.insertMany(users);
  const { id: adminId } = await User.findOne({ email: users[0].email });
  adminAuthLine = `Bearer ${issueToken({ id: adminId }, process.env.JWT_SECRET)}`;
});

afterEach(async () => dbHandler.clearCollection('topics'));

afterAll(async () => dbHandler.closeDatabase());

describe('requests', () => {
  it('GET /topics', async () => {
    await request(await getApp())
      .get('/topics')
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveLength(0);
      });
  });

  it('POST /topics', async () => {
    const app = await getApp();
    await request(app)
      .post('/topics')
      .type('json')
      .set('Authorization', adminAuthLine)
      .send({ title: 'topic title', body: 'topic body' })
      .expect(200);

    await request(app)
      .get('/topics')
      .expect(200, /topic title/);
  });

  it('POST /topics (errors)', async () => {
    await request(await getApp())
      .post('/topics')
      .set('Authorization', adminAuthLine)
      .expect(422);
  });

  it('GET topics/:id', async () => {
    const app = await getApp();
    const res = await request(app)
      .post('/topics')
      .type('json')
      .set('Authorization', adminAuthLine)
      .send({ title: 'topic title', body: 'topic body' })
      .expect(200);

    // eslint-disable-next-line no-underscore-dangle
    const topicId = res.body._id;

    await request(app)
      .get(`/topics/${topicId}`)
      .expect(200, /topic body/);
  });

  it('PATCH topics/:id', async () => {
    const app = await getApp();
    const res = await request(app)
      .post('/topics')
      .type('json')
      .set('Authorization', adminAuthLine)
      .send({ title: 'topic title', body: 'topic body' });

    // eslint-disable-next-line no-underscore-dangle
    const topicId = res.body._id;
    const newTopic = { title: 'new topic title', body: 'new topic body' };

    await request(app)
      .patch(`/topics/${topicId}`)
      .type('json')
      .set('Authorization', adminAuthLine)
      .send(newTopic)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject(newTopic);
      });
  });

  it('PATCH topics/:id (unproccessable entity)', async () => {
    const app = await getApp();
    const res = await request(app)
      .post('/topics')
      .type('json')
      .set('Authorization', adminAuthLine)
      .send({ title: 'post title', body: 'post body' });

    // eslint-disable-next-line no-underscore-dangle
    const topicId = res.body._id;

    await request(app)
      .patch(`/topics/${topicId}`)
      .set('Authorization', adminAuthLine)
      .expect(422);
  });

  it('DELETE topics/:id', async () => {
    const app = await getApp();
    const res = await request(app)
      .post('/topics')
      .type('json')
      .set('Authorization', adminAuthLine)
      .send({ title: 'post title', body: 'post body' });

    // eslint-disable-next-line no-underscore-dangle
    const topicId = res.body._id;

    await request(app)
      .delete(`/topics/${topicId}`)
      .set('Authorization', adminAuthLine)
      .expect(200);
  });

  it('DELETE topics/:id (unauthorized)', async () => {
    const app = await getApp();
    const res = await request(app)
      .post('/topics')
      .type('json')
      .set('Authorization', adminAuthLine)
      .send({ title: 'post title', body: 'post body' });

    // eslint-disable-next-line no-underscore-dangle
    const topicId = res.body._id;

    await request(app)
      .delete(`/topics/${topicId}`)
      .expect(401);
  });
});
