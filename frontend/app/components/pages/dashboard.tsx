"use client"

import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

type Loan = {
  id: string; // kode pinjam
  nama_peminjam: string;
  tgl_pesan: string; // ISO
  tgl_ambil: string | null;
  tgl_wajibkembali: string;
  tgl_kembali: string | null;
  status: "dipinjam" | "dikembalikan" | "overdue" | "dipesan";
};

const sampleData: Loan[] = [
  {
    id: "PINJ-001",
    nama_peminjam: "Budi Santoso",
    tgl_pesan: "2025-11-20",
    tgl_ambil: "2025-11-21",
    tgl_wajibkembali: "2025-12-05",
    tgl_kembali: null,
    status: "dipinjam",
  },
  {
    id: "PINJ-002",
    nama_peminjam: "Siti Aminah",
    tgl_pesan: "2025-11-10",
    tgl_ambil: "2025-11-11",
    tgl_wajibkembali: "2025-11-20",
    tgl_kembali: "2025-11-19",
    status: "dikembalikan",
  },
  {
    id: "PINJ-003",
    nama_peminjam: "Andi Pratama",
    tgl_pesan: "2025-11-01",
    tgl_ambil: null,
    tgl_wajibkembali: "2025-11-10",
    tgl_kembali: null,
    status: "dipesan",
  },
  {
    id: "PINJ-004",
    nama_peminjam: "Rina Oktaviani",
    tgl_pesan: "2025-10-15",
    tgl_ambil: "2025-10-16",
    tgl_wajibkembali: "2025-10-30",
    tgl_kembali: null,
    status: "overdue",
  },
];

function formatDate(d: string | null) {
  if (!d) return "-";
  try {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString();
  } catch {
    return d;
  }
}

function StatusBadge({ status }: { status: Loan["status"] }) {
  switch (status) {
    case "dipinjam":
      return <Badge variant="secondary">Dipinjam</Badge>;
    case "dikembalikan":
      return <Badge variant="outline">Dikembalikan</Badge>;
    case "overdue":
      return <Badge variant="destructive">Overdue</Badge>;
    case "dipesan":
      return <Badge>Pesan</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function TablePage() {
  const [query, setQuery] = useState("");
  const [data] = useState<Loan[]>(sampleData);
  const { isAuthenticated } = useAuth();
  const route = useRouter();

  useEffect(()=>{
    const role = localStorage.getItem("role");
    if( !isAuthenticated || role === "peminjam"){
        route.push("/login")
    }
  }, [])

  const filtered = useMemo(() => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.nama_peminjam.toLowerCase().includes(q) ||
        (r.status && r.status.toLowerCase().includes(q))
    );
  }, [data, query]);

  return (
    <div className="p-6">
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Daftar Peminjaman</CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                placeholder="Cari kode, nama, atau status..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-10"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search size={16} />
              </div>
            </div>
            <Button onClick={() => setQuery("")}>Reset</Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode Pinjam</TableHead>
                  <TableHead>Nama Peminjam</TableHead>
                  <TableHead>Tgl Pesan</TableHead>
                  <TableHead>Tgl Ambil</TableHead>
                  <TableHead>Tgl Wajib Kembali</TableHead>
                  <TableHead>Tgl Kembali</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.id}</TableCell>
                    <TableCell>{row.nama_peminjam}</TableCell>
                    <TableCell>{formatDate(row.tgl_pesan)}</TableCell>
                    <TableCell>{formatDate(row.tgl_ambil)}</TableCell>
                    <TableCell>{formatDate(row.tgl_wajibkembali)}</TableCell>
                    <TableCell>{formatDate(row.tgl_kembali)}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm">Detail</Button>
                        <Button size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filtered.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Tidak ada data yang cocok.
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <div className="text-sm">Menampilkan {filtered.length} entri</div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              Export
            </Button>
            <Button size="sm">Tambah Pinjaman</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
