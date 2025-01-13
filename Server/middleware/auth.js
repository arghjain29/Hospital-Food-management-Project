const jwt = require('jsonwebtoken');

const authMiddleware = (role) => {
    return (req, res, next) => {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = decoded;
            // if (role && decoded.role !== role) {
            //     return res.status(403).json({ message: 'Forbidden' });
            // }
            if (!role.includes(req.user.role)) { 
                return res.status(403).json({ message: 'Forbidden' }); 
              }
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid Token' });
        }
    };
};

module.exports = authMiddleware;
