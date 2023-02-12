module.exports = {
  isLoginAdmin: (req, res, next) => {
    if (req.session.admin === null || req.session.admin === undefined) {
      res.redirect("/admin");
    } else {
      next();
    }
  },
};
