const registerUserAdmin = (req, res) => {
    res.json({ message: 'Register User' })
}

const loginUserAdmin = (req, res) => {
    res.json({ message: 'Login User' })
}

const getAdminMe = (req, res) => {
    res.json({ message: 'User Admin Data Display' })
}

module.exports = {
    registerUserAdmin,
    loginUserAdmin,
    getAdminMe,
}