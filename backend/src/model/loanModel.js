import {pool} from "../connection/db.js";

export const createLoan = async (id_peminjam) => {
  const result = await pool.query(
    `INSERT INTO peminjaman (id_peminjam)
     VALUES ($1)
     RETURNING kode_pinjam`,
    [id_peminjam]
  );

  return result.rows[0].kode_pinjam;
};

export const linkBookToLoan = async (id_buku, kode_pinjam) => {
  await pool.query(
    `UPDATE buku 
     SET kode_pinjam = $1
     WHERE id_buku = $2`,
    [kode_pinjam, id_buku]
  );
};
