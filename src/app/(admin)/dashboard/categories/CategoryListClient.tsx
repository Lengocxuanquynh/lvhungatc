"use client";

import React, { useState } from "react";
import { deleteCategoryAction, createCategoryAction, updateCategoryAction } from "@/app/actions/product";
import { Trash2, Loader2, Edit, Check, X, Plus } from "lucide-react";

export default function CategoryListClient({ categories }: { categories: any[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  
  const [isAdding, setIsAdding] = useState(false);
  const [addName, setAddName] = useState("");
  const [adding, setAdding] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá danh mục này?")) return;
    
    setDeletingId(id);
    const result = await deleteCategoryAction(id);
    
    if (result.error) {
      alert(result.error);
    }
    setDeletingId(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;
    setAdding(true);
    const formData = new FormData();
    formData.append("name", addName);
    const result = await createCategoryAction(formData);
    if (result.error) alert(result.error);
    else {
      setAddName("");
      setIsAdding(false);
    }
    setAdding(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    const formData = new FormData();
    formData.append("name", editName);
    const result = await updateCategoryAction(id, formData);
    if (result.error) alert(result.error);
    else setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? "Huỷ" : "Thêm danh mục"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên danh mục mới</label>
            <input 
              type="text" 
              required 
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              placeholder="VD: Áo sơ mi"
            />
          </div>
          <button 
            type="submit" 
            disabled={adding}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 h-[42px] flex items-center justify-center min-w-[100px]"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Tên danh mục</th>
            <th className="px-6 py-4">Đường dẫn (Slug)</th>
            <th className="px-6 py-4">Ngày tạo</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {categories.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                Chưa có danh mục nào. Bạn có thể thêm danh mục tự động khi tạo sản phẩm mới.
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  {editingId === category.id ? (
                    <input 
                      type="text"
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-3 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 outline-none w-full"
                    />
                  ) : (
                    <span className="font-medium text-slate-900">{category.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-500">{category.slug}</td>
                <td className="px-6 py-4">{new Date(category.createdAt).toLocaleDateString("vi-VN")}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {editingId === category.id ? (
                      <>
                        <button onClick={() => handleUpdate(category.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Lưu">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors" title="Huỷ">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => { setEditingId(category.id); setEditName(category.name); }} 
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm" 
                        title="Sửa danh mục"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <button
                    onClick={() => handleDelete(category.id)}
                    disabled={deletingId === category.id}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm disabled:opacity-50"
                    title="Xoá danh mục"
                  >
                    {deletingId === category.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}
