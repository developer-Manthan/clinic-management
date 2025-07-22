exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.clearanceLevel)) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
        next();
    };
};
