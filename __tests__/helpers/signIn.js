import request from 'supertest';

export default async (app, userData) => {
  const response = await request(app)
    .post('/session/new')
    .type('form')
    .send(userData);
  return response.headers['set-cookie'];
};
