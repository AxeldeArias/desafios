import passport from "passport";

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false },
      function (err, user, info) {
        if (err) return next(err);
        if (!user)
          return res.status(401).send({
            status: "error",
            error: info.message ? info.message : info.toString(),
          });
        req.user = user;
        next();
      }
    )(req, res, next);
  };
};

export const JWTStrategy = passportCall("jwt");

export const authorization = (roles) => {
  return async (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ status: "error", error: "Unauthorired" });
    if (!roles.includes(req.user.role))
      return res
        .status(401)
        .json({ status: "error", error: "Not permissions" });
    next();
  };
};
