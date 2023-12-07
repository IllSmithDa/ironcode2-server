
//https://stackoverflow.com/questions/65767024/express-session-not-working-in-production-deployment
const checkSession = (req, res, next) => {
  console.log(`session: ${req.session.user}`)
  if(req.session.user) {
   res.locals.user = req.session.user;
   next();
  } else {
   res.status(403).json({ login: false })
  }
}

module.exports = {
  checkSession,
}