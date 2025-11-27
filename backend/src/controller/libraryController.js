import {
    findAllBook,
    saveLoan,
    updateBookLoanCode
} from "../model/libraryModel.js";


export const getAllBook = async (req, res) => {
    try {
        const { role } = req.body;
        if(role !== "peminjam"){
            return res.status(404).json({
                message: "You didn't have authorization for this!"
            })
        }
        const books = await findAllBook();
        res.status(200).json({
            message: "Success",
            data: books
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching books",
            error: error.message
        });
    }
};

export const Loaning = async (req, res) => {
  try {

    const createdAt = new Date();
    const pickUpAt = new Date();
    const returnAt = new Date();
    returnAt.setDate(returnAt.getDate() + 7);

    const loanStatus = 0;

    const loanData = await saveLoan({
      createdAt,
      pickUpAt,
      returnAt,
      loanStatus
    });

    const books = await findAllBook();

    console.log("resBooks:", books);

    const availableBooks = books.filter(b => b.kode_pinjam === null);

    console.log("Buku tersedia:", availableBooks);

    const selectedBook = availableBooks[0];

    const updatedBook = await updateBookLoanCode({
      bookId: selectedBook.id_buku,
      kode_pinjam: loanData.kode_pinjam
    });

    res.status(201).json({
      message: "Loan saved successfully",
      data: {
        loan: loanData,
        selectedBook,
        updatedBook
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message
    });
  }
};


export const updateBookLoan = async (req, res) => {
    try {
        const { bookId, kode_pinjam } = req.body;

        const updated = await updateBookLoanCode({ bookId, kode_pinjam });

        res.status(200).json({
            message: "Book loan code updated",
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating book loan",
            error: error.message
        });
    }
};
