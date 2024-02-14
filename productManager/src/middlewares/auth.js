export function userAuth(req, res, next) {
  console.log({ req: req.session });
  if (!req.session?.user) {
    return res.status(401).send("error de autorización");
  }
  return next();
}

export function adminAuth(req, res, next) {
  if (req.session?.user !== "f@gmail.com" || !req.session?.admin) {
    return res.status(401).send("error de autorización");
  }
  return next();
}
