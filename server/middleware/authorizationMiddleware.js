module.exports = (privilege) => {
    return (req, res, next) => {
        console.log(privilege);
        console.log("REQ.User", req.user.role);
        console.log("Privilege", privilege);
        console.log("REQ>USER>Prevligies", req.user.role.privileges.ADD_NEW_USER);
        if (req.user.role && req.user.role.privileges[privilege]) {
            next();
        } else {
            res.status(403).json({ status: 403, data: null, error: true, message: "Forbidden" });
        }
    }
}