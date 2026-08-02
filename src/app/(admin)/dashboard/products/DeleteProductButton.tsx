"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProductAction } from "@/app/actions/product";

export default function DeleteProductButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) return;
    setIsDeleting(true);
    const result = await deleteProductAction(id);
    if (result?.error) {
      alert(result.error);
    }
    setIsDeleting(false);
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm disabled:opacity-50"
      title="Xoá sản phẩm"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
