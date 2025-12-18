
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Building2, Store, Clock, MapPin, Phone, RefreshCcw, Users, UserX, Eye, EyeOff, Trash2 } from 'lucide-react';
import { RegistrationRequest, User, UserRole } from '../types';
import { api } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'USERS'>('REQUESTS');
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State to track which passwords are visible (by user ID)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    setLoading(true);
    const requestsData = await api.admin.getRequests();
    const usersData = await api.admin.getUsers();
    
    setRequests(requestsData);
    setUsers(usersData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    // Optimistic update for requests
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));

    await api.admin.processRequest(id, newStatus);
    fetchData(); // Reload to sync users list if approved
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟ سيتم فقدان صلاحية الدخول فوراً.')) {
      setUsers(prev => prev.filter(u => u.id !== userId)); // Optimistic
      await api.admin.deleteUser(userId);
      fetchData();
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const historyRequests = requests.filter(r => r.status !== 'PENDING');

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">لوحة تحكم المدير</h2>
          <p className="text-gray-500">إدارة التسجيلات والمستخدمين النشطين</p>
        </div>
        <button 
          onClick={fetchData} 
          className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          title="تحديث البيانات"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="text-blue-600 font-bold text-lg flex items-center gap-2">
            <Clock size={18} /> طلبات الانتظار
          </div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{pendingRequests.length}</div>
        </div>
        <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
          <div className="text-teal-600 font-bold text-lg flex items-center gap-2">
            <Store size={18} /> الصيدليات النشطة
          </div>
          <div className="text-3xl font-bold text-gray-800 mt-2">
            {users.filter(u => u.role === UserRole.PHARMACY).length}
          </div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          <div className="text-indigo-600 font-bold text-lg flex items-center gap-2">
            <Building2 size={18} /> المخازن النشطة
          </div>
          <div className="text-3xl font-bold text-gray-800 mt-2">
            {users.filter(u => u.role === UserRole.WAREHOUSE).length}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
          <div className="text-purple-600 font-bold text-lg flex items-center gap-2">
            <Users size={18} /> إجمالي المستخدمين
          </div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{users.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl border border-gray-100 w-fit mb-6">
        <button
          onClick={() => setActiveTab('REQUESTS')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'REQUESTS' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          طلبات التسجيل الجديدة
        </button>
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'USERS' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          إدارة المستخدمين والحسابات
        </button>
      </div>

      {/* Tab Content: REQUESTS */}
      {activeTab === 'REQUESTS' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700">
              قائمة الانتظار ({pendingRequests.length})
            </div>
            
            {loading ? (
               <div className="p-8 text-center text-gray-400">جاري تحميل البيانات...</div>
            ) : pendingRequests.length === 0 ? (
              <div className="p-8 text-center text-gray-400">لا توجد طلبات معلقة حالياً</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pendingRequests.map(req => (
                  <div key={req.id} className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${req.type === 'PHARMACY' ? 'bg-teal-100 text-teal-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        {req.type === 'PHARMACY' ? <Store size={24} /> : <Building2 size={24} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{req.name}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><MapPin size={14} /> {req.location}</span>
                          <span className="flex items-center gap-1"><Phone size={14} /> {req.contactPhone}</span>
                          <span className="flex items-center gap-1">رخصة: {req.licenseNumber}</span>
                          <span className="flex items-center gap-1"><Clock size={14} /> {req.requestDate}</span>
                        </div>
                         {/* Show password for admin review if needed */}
                         <div className="mt-2 text-xs bg-gray-100 px-2 py-1 rounded inline-block text-gray-500">
                            كلمة المرور المقترحة: {req.password}
                         </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto">
                      <button 
                        onClick={() => handleStatusChange(req.id, 'APPROVED')}
                        className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />
                        موافق
                      </button>
                      <button 
                        onClick={() => handleStatusChange(req.id, 'REJECTED')}
                        className="flex-1 md:flex-none bg-red-100 hover:bg-red-200 text-red-600 px-6 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle size={18} />
                        رفض
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* History Section */}
          {historyRequests.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-4">سجل العمليات السابقة</h3>
              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="p-3">الاسم</th>
                      <th className="p-3">النوع</th>
                      <th className="p-3">التاريخ</th>
                      <th className="p-3">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {historyRequests.map(req => (
                      <tr key={req.id}>
                        <td className="p-3 font-medium">{req.name}</td>
                        <td className="p-3">{req.type === 'PHARMACY' ? 'صيدلية' : 'مخزن'}</td>
                        <td className="p-3 text-gray-500">{req.requestDate}</td>
                        <td className="p-3">
                          {req.status === 'APPROVED' ? (
                            <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-bold">مقبول</span>
                          ) : (
                            <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-xs font-bold">مرفوض</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: USERS MANAGEMENT */}
      {activeTab === 'USERS' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700 flex justify-between">
              <span>جميع المستخدمين النشطين</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">{users.length} مستخدم</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="py-3 px-4">المستخدم / المنشأة</th>
                    <th className="py-3 px-4">الصلاحية</th>
                    <th className="py-3 px-4">رقم الهاتف (الدخول)</th>
                    <th className="py-3 px-4">كلمة المرور</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            user.role === UserRole.ADMIN ? 'bg-purple-500' :
                            user.role === UserRole.WAREHOUSE ? 'bg-indigo-500' : 'bg-teal-500'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">{user.name}</div>
                            <div className="text-xs text-gray-400">{user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {user.role === UserRole.ADMIN && <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs font-bold">مدير نظام</span>}
                        {user.role === UserRole.WAREHOUSE && <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs font-bold">مخزن</span>}
                        {user.role === UserRole.PHARMACY && <span className="text-teal-600 bg-teal-50 px-2 py-1 rounded text-xs font-bold">صيدلية</span>}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-600">{user.phone}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded border border-gray-200 w-fit">
                          <span className="font-mono text-gray-700 min-w-[80px]">
                            {visiblePasswords[user.id] ? user.password : '••••••••'}
                          </span>
                          <button 
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            title={visiblePasswords[user.id] ? "إخفاء" : "إظهار"}
                          >
                            {visiblePasswords[user.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {user.role !== UserRole.ADMIN ? (
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            title="حذف الحساب"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
