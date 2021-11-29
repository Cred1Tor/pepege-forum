export default (app) => {
  app.get('/', (_req, res) => {
    res.render('welcome/index');
  });
};
