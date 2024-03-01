
const jwt = require('jsonwebtoken');

const authenticateAndAuthorize = (roles) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            const userRole = user.role;
            if (roles.includes(userRole)) {
                next();
            } else {
                return res.status(403).json({ error: 'You dont have permission' });
            }
        });
    };
};

module.exports = authenticateAndAuthorize;
