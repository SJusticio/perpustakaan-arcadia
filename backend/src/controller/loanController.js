import { createLoan, linkBookToLoan } from "../model/loanModel.js";

export const loanBooks = async (req, res) => {
  try {
    const { id_peminjam, books } = req.body;

    if (!books || books.length === 0) {
      return res.status(400).json({ message: "No books selected" });
    }

    const results = [];

    for (const id_buku of books) {
      const kode_pinjam = await createLoan(id_peminjam);

      await linkBookToLoan(id_buku, kode_pinjam);

      results.push({ id_buku, kode_pinjam });
    }

    return res.json({
      message: "Loan success",
      data: {
        total: books.length,
        detail: results 
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
