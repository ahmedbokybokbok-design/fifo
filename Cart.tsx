import React from 'react';
import { Trash2, Send, ShoppingBag, Store } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  removeFromCart: (id: string) => void;
  onSubmitOrder: (warehouseId: string) => void;
}

export const Cart: React.FC<CartProps> = ({ cartItems, removeFromCart, onSubmitOrder }) => {
  // Group items by Warehouse
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.warehouseId]) {
      acc[item.warehouseId] = {
        name: item.warehouseName,
        items: []
      };
    }
    acc[item.warehouseId].items.push(item);
    return acc;
  }, {} as Record<string, { name: string; items: CartItem[] }>);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
        <ShoppingBag className="w-24 h-24 mb-4 opacity-20" />
        <h2 className="text-2xl font-bold text-gray-600">عربة التسوق فارغة</h2>
        <p className="mt-2">قم بإضافة أصناف من صفحة البحث والمقارنة</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <ShoppingBag className="text-teal-600" />
        مراجعة الطلبات ({cartItems.length} صنف)
      </h2>

      {Object.entries(groupedItems).map(([warehouseId, group]: [string, { name: string; items: CartItem[] }]) => {
        const totalAmount = group.items.reduce((sum, item) => {
          const priceAfterDiscount = item.price * (1 - item.discount / 100);
          return sum + (priceAfterDiscount * item.quantity);
        }, 0);

        return (
          <div key={warehouseId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Warehouse Header */}
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Store className="text-teal-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{group.name}</h3>
                  <p className="text-xs text-gray-500">{group.items.length} أصناف</p>
                </div>
              </div>
              <div className="text-left">
                <span className="text-xs text-gray-500 block">إجمالي الفاتورة</span>
                <span className="text-xl font-bold text-teal-700">{totalAmount.toFixed(2)} ج.م</span>
              </div>
            </div>

            {/* Items List */}
            <div className="divide-y divide-gray-50">
              {group.items.map((item) => {
                const finalPrice = (item.price * (1 - item.discount / 100)).toFixed(2);
                return (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{item.tradeName}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-gray-500">سعر الجمهور: {item.price}</span>
                        <span className="text-red-500 font-bold bg-red-50 px-2 rounded">خصم {item.discount}%</span>
                        {item.bonus && <span className="text-teal-600 font-bold bg-teal-50 px-2 rounded">بونص {item.bonus}</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span className="block text-xs text-gray-400">صافي الصنف</span>
                        <span className="font-bold text-gray-800">{finalPrice} ج.م</span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                        <span className="text-xs text-gray-500 font-bold">الكمية: {item.quantity}</span>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-2"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => onSubmitOrder(warehouseId)}
                className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all flex items-center gap-2"
              >
                <Send size={18} />
                تأكيد وإرسال الطلب
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};