"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen } from "lucide-react"

import { loaning, showBook } from "@/lib/api";
import { ApiResponse, BookPayload, LoanPayload } from "@/types/user"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter()
  const [books, setBooks] = useState<any[]>([]) 
  const [selectedBooks, setSelectedBooks] = useState<number[]>([])
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    async function getBook() {
      const role = localStorage.getItem("role");
      if( !isAuthenticated || (role=="admin")){
        router.push("/login")
      }
      try {
        const payload: BookPayload = { role };

        const resBook: ApiResponse = await showBook(payload);

        console.log("Hasil API Buku:", resBook);

        if (resBook?.data) {
          const formatted = resBook.data.map((b: any) => ({
            id: b.id_buku,
            title: b.judul_buku,
            writer: b.nama_pengarang,
            publisher: b.nama_penerbit,
            createdAt: b.tgl_terbit,
          }));

          setBooks(formatted);
        }
      } catch (e) {
        console.log("Failed to load books", e);
      }
    }
    getBook();
  }, []);

  const handleSelectBook = (bookId: number) => {
    setSelectedBooks(prev => 
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    )
  }

  const handleBorrowClick = () => {
    if (selectedBooks.length > 0) {
      setShowDialog(true)
    }
  }

  const handleConfirmBorrow = async () => {
    try {
      const id_peminjam = localStorage.getItem("userId");

      const payload = {
        id_peminjam,
        books: selectedBooks,
      };

      const result = await loaning(payload);
      console.log("Loan result:", result);

      alert(`Berhasil meminjam ${selectedBooks.length} buku.`);

      setSelectedBooks([]);
      setShowDialog(false);
    } catch (e) {
      console.log(e);
      alert("Gagal meminjam buku!");
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Perpustakaan Digital</h1>
          <p className="text-gray-600">Pilih buku yang ingin Anda pinjam</p>
        </div>

        {/* LIST BUKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(book => (
            <Card 
              key={book.id} 
              className={`cursor-pointer transition-all ${
                selectedBooks.includes(book.id) ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{book.title}</CardTitle>
                    <CardDescription>oleh {book.writer}</CardDescription>
                  </div>
                  <Checkbox
                    checked={selectedBooks.includes(book.id)}
                    onCheckedChange={() => handleSelectBook(book.id)}
                  />
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Penerbit: {book.publisher}</span>
                  </div>
                  <div className="text-gray-500">
                    Diterbitkan: {formatDate(book.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* BUTTON PINJAM */}
        <div className="fixed bottom-6 right-6">
          <Button 
            size="lg"
            onClick={handleBorrowClick}
            disabled={selectedBooks.length === 0}
            className="shadow-lg"
          >
            Pinjam ({selectedBooks.length})
          </Button>
        </div>

        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Peminjaman</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin meminjam {selectedBooks.length} buku?
                <div className="mt-4 space-y-2">
                  {books
                    .filter(book => selectedBooks.includes(book.id))
                    .map(book => (
                      <p key={book.id} className="text-sm font-medium text-gray-900">
                        • {book.title} - {book.writer}
                      </p>
                    ))}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmBorrow}>
                Ya, Pinjam
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  )
}
