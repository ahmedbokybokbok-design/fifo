
import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Search, Download, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Order, User } from '../types';
import { MOCK_ORDERS } from '../services/mockData';

interface PharmacyInvoicesProps {
  user: User;
}

export const PharmacyInvoices: React.FC<PharmacyInvoicesProps> = ({ user }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS.filter(o => o.pharmacyId === user.id));
  const [searchTerm, setSearchTerm] = useState('');

  const handleRequestInvoice = (orderId: string) => {
    // In a real app, this would be an API call
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, invoiceRequested: true } : o
    ));
    alert('تم إرسال طلب استخراج الفاتورة إلى المخزن بنجاح.');
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.status.includes(searchTerm)
  );

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             <FileText className="text-teal-600" />
             الفواتير والطلبات
           </h2>
           <p className="text-gray-500 mt-1">سجل طلباتك السابقة وإدارة الفواتير الضريبية</p>
        </div>
        
        <div className="relative w-full md:w-64">
           <input
             type="text"
             placeholder="بحث برقم الفاتورة..."
             className="w-full pr-10 pl-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none text-right"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
           <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
             <FileText className="w-16 h-16 mx-auto mb-4 text-gray-200" />
             <p className="font-medium">لا توجد طلبات سابقة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="py-4 px-6">رقم الفاتورة</th>
                  <th className="py-4 px-6">التاريخ</th>
                  <th className="py-4 px-6">عدد الأصناف</th>
                  <th className="py-4 px-6">الإجمالي</th>
                  <th className="py-4 px-6">حالة الطلب</th>
                  <th className="py-4 px-6">الفاتورة الضريبية</th>
                  <th className="py-4 px-6">تفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr 
                      className={`transition-colors hover:bg-gray-50 ${expandedOrderId === order.id ? 'bg-gray-50' : ''}`}
                    >
                      <td className="py-4 px-6 font-medium text-gray-800">{order.id}</td>
                      <td className="py-4 px-6 text-gray-500">{order.orderDate}</td>
                      <td className="py-4 px-6">{order.itemsCount}</td>
                      <td className="py-4 px-6 font-bold">{order.totalAmount} ج.م</td>
                      <td className="py-4 px-6">
                        {order.status === 'PENDING' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12}/> انتظار</span>}
                        {order.status === 'PROCESSING' && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12}/> تجهيز</span>}
                        {order.status === 'COMPLETED' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={12}/> مكتمل</span>}
                        {order.status === 'CANCELLED' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={12}/> ملغي</span>}
                      </td>
                      <td className="py-4 px-6">
                         {order.status === 'COMPLETED' ? (
                           order.invoiceRequested ? (
                             <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                               <CheckCircle size={14} />
                               تم إرسال الطلب
                             </span>
                           ) : (
                             <button 
                               onClick={() => handleRequestInvoice(order.id)}
                               className="text-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg text-xs font-bold border border-teal-200 transition-colors flex items-center gap-1"
                             >
                               <Download size={14} />
                               طلب فاتورة
                             </button>
                           )
                         ) : (
                           <span className="text-gray-400 text-xs">-</span>
                         )}
                      </td>
                      <td className="py-4 px-6">
                        <button 
                          onClick={() => toggleOrderDetails(order.id)}
                          className="text-gray-400 hover:text-teal-600"
                        >
                          {expandedOrderId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={7} className="p-4">
                          <div className="bg-white rounded-lg border border-gray-200 p-4 mx-4">
                            <h4 className="font-bold text-gray-700 mb-3 text-sm">تفاصيل الطلبية:</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs text-right">
                                <thead className="bg-gray-100 text-gray-600">
                                  <tr>
                                    <th className="p-2">الصنف</th>
                                    <th className="p-2">الكمية</th>
                                    <th className="p-2">السعر</th>
                                    <th className="p-2">الإجمالي</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {order.details.map((item, idx) => (
                                    <tr key={idx}>
                                      <td className="p-2 font-medium">{item.name}</td>
                                      <td className="p-2 font-bold text-teal-700">{item.qty}</td>
                                      <td className="p-2">{item.price} ج.م</td>
                                      <td className="p-2">{item.price * item.qty} ج.م</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
