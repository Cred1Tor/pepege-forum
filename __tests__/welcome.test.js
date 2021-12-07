import request from 'supertest';
import getApp from '../server/index.js';

it('GET /', async () => {
  await request(await getApp())
    .get('/')
    .expect(200, /Welcome/);
});
