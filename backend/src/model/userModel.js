import { pool } from  "../connection/db.js"

export const createUser = async (name, username, passwordHash, status) => {
    const result = await pool.query(
        `INSERT INTO peminjam (nama_peminjam, user_peminjam, pass_peminjam, status_peminjam) 
        VALUES($1, $2, $3, $4) 
        RETURNING id_peminjam, nama_peminjam, user_peminjam, status_peminjam`,
        [name, username, passwordHash, status]
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
        `SELECT * FROM admin
        WHERE user_admin = $1`,
        [username]
    )
    return result.rows[0]
}
