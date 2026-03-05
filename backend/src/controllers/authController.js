const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
};