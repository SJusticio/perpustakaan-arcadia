import { pool } from  "../connection/db.js"

export const createUser = async (fullName, xUsername, phoneNumber, email, passwordHash) => {
    const result = await pool.query(
        `INSERT INTO users (full_name, x_username, phone_number, email, password_hash) 
        VALUES($1, $2, $3, $4, $5) 
        RETURNING user_id, email, full_name, x_username`,
        [fullName, xUsername, phoneNumber, email, passwordHash]
    );
    return result.rows[0]
}

export const findUserByUsn = async (username) => {
    const result = await pool.query(
        `SELECT * FROM peminjam
        WHERE user_peminjam = $1`,
        [username] 
    )
    return result.rows[0]
}

export const findAdminByUsn = async (username) => {
    const result = await pool.query(
        `SELECT * FROM users
        WHERE user_admin = $1`,
        [username]
    )
    return result.rows[0]
}
