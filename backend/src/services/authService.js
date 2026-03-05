const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const userRepository = require('../repositories/userRepository');

const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin_master_key";
const MENTOR_SECRET = process.env.MENTOR_SECRET || "mentor_master_key";

const register = async ({ name, email, password, role, sector, secretKey }) => {

  if (!name || !email || !password || !role) {
    throw new Error("Campos obrigatórios não enviados");
  }

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("Usuário já existe");
  }

  if (role === "admin" && secretKey !== ADMIN_SECRET) {
    throw new Error("Chave de admin inválida");
  }

  if (role === "mentor" && secretKey !== MENTOR_SECRET) {
    throw new Error("Chave de mentor inválida");
  }

  const password_hash = await bcrypt.hash(password, 10);

  const newUser = await userRepository.createUser({
    id: uuidv4(),
    name,
    email,
    password_hash,
    role,
    sector,
  });

  return newUser;
};

const login = async ({ email, password }) => {

  if (!email || !password) {
    throw new Error("Email e senha obrigatórios");
  }

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    throw new Error("Senha inválida");
  }

  const token = jwt.sign(
    { id: newUser.id, role: nemUser.role },
    process.env.JWT_SECRET || "minhaChaveSecreta123",
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      sector: newUser.sector,
    },
  };
};

module.exports = {
  register,
  login,
};