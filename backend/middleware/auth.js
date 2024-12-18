const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function checkRole(roles) {
  return function (req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      if (!roles.includes(req.user.role)) return res.status(403).send('Access denied');
      next();
    } catch (error) {
      res.status(400).send('Invalid token');
    }
  };
}

module.exports = { checkRole };
