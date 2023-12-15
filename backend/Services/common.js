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
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2IyMjAyYzBmZDZlZGQ2ZmJhZTVmYyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzAyNTY4NDUwfQ.xifBMDErrGvL48v1O-f9g7hts3FAv6zC5Q6Jhwuagl0";
  return token;
};
