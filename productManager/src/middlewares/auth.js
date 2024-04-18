import passport from "passport";

export function userAuth(req, res, next) {
  return passport.authenticate("jwt", { session: false })(req, res, next);
}
