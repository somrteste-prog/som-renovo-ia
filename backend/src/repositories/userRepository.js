const db = require('../database/db');

const createUser = async (user) => {
  const query = `
    INSERT INTO users (id, name, email, password_hash, role, sector)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, name, email, role, sector, created_at;
  `;

  const values = [
    user.id,
    user.name,
    user.email,
    user.password_hash,
    user.role,
    user.sector || null,
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};

const findByEmail = async (email) => {
  const { rows } = await db.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return rows[0];
};

module.exports = {
  createUser,
  findByEmail,
};