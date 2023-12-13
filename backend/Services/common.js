import passport from "passport";

export const isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

export const sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Nzg4MjFhNzgyZjY0NWM0NmE5OGVjMiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzAyNDc5MTA3fQ.RLA97MoL8tUORGJ_2cZvQ4fRqUvSAoNUQV5vZXwSljI";
  return token;
};
