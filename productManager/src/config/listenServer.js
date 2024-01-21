const PORT = 8080;

export const listenServer = (app) => {
  return app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};
