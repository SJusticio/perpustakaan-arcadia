import { pool } from "../connection/db.js";

export const findAllBook = async () => {
    const result = await pool.query(`SELECT * FROM buku`);
    return result.rows;
};

export const saveLoan = async ({ createdAt, pickUpAt, returnAt, loanStatus, userId }) => {
    const result = await pool.query(
        `INSERT INTO peminjaman (tgl_pesan, tgl_ambil, tgl_wajibkembali, status_pinjam, id_peminjam)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING kode_pinjam, tgl_pesan, tgl_ambil, tgl_wajibkembali, status_pinjam, id_peminjam`,
        [createdAt, pickUpAt, returnAt, loanStatus, userId]
    );
    return result.rows[0];
};

export const updateBookLoanCode = async ({ bookId, kode_pinjam }) => {
    const result = await pool.query(
        `UPDATE buku
         SET kode_pinjam = $1
         WHERE id_buku = $2
         RETURNING id_buku, kode_pinjam`,
        [kode_pinjam, bookId]
    );
    return result.rows[0];
};
