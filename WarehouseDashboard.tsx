
import React, { useState } from 'react';
import { Upload, RefreshCw, CheckCircle, FileText, Server, FileSpreadsheet, History, AlertCircle, Clock, Database, Sun, Moon, DollarSign, ShoppingBag, FileCheck, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { parsePriceList, parseDocumentPriceList } from '../services/geminiService';
import { MOCK_UPLOAD_HISTORY, MOCK_ORDERS } from '../services/mockData';
import { DailyStatus } from '../types';

export const WarehouseDashboard: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SYNCING' | 'CONNECTED'>('IDLE');
  const [dailyStatus, setDailyStatus] = useState<DailyStatus>({ morning: true, evening: false });
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadHistory, setUploadHistory] = useState(MOCK_UPLOAD_HISTORY);
  const [activeTab, setActiveTab] = useState<'SALES' | 'UPLOAD'>('SALES');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Convert File to Base64 helper
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleOrgaSoftSync = () => {
    setSyncStatus('SYNCING');
    setTimeout(() => {
      setSyncStatus('CONNECTED');
    }, 2500);
  };

  const handleParseText = async () => {
    if (!rawText) return;
    setIsParsing(true);
    try {
      const data = await parsePriceList(rawText);
      setParsedData(data);
    } catch (error) {
      alert("حدث خطأ أثناء المعالجة النصية");
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsParsing(true);
      
      try {
        const base64 = await fileToBase64(file);
        let mimeType = file.type;
        if (!mimeType) {
           if (file.name.endsWith('.pdf')) mimeType = 'application/pdf';
           else if (file.name.endsWith('.csv')) mimeType = 'text/csv';
           else mimeType = 'image/jpeg';
        }

        const data = await parseDocumentPriceList(base64, mimeType);
        setParsedData(data);
        
        setUploadHistory(prev => [{
          id: Date.now().toString(),
          fileName: file.name,
          uploadTime: new Date().toLocaleTimeString('ar-EG'),
          status: 'PROCESSED',
          itemsCount: data.length
        }, ...prev]);

        const hour = new Date().getHours();
        if (hour < 14) setDailyStatus(prev => ({ ...prev, morning: true }));
        else setDailyStatus(prev => ({ ...prev, evening: true }));

      } catch (error) {
        console.error(error);
        alert("فشل في قراءة الملف، يرجى التأكد من الصيغة");
      } finally {
        setIsParsing(false);
      }
    }
  };

  // Mock Sales Data
  const SALES_STATS = [
    { label: 'مبيعات اليوم', value: '45,200 ج.م', icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'طلبات جديدة', value: '12 طلب', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
    { label: 'فواتير مستحقة', value: '8 فواتير', icon: FileCheck, color: 'bg-orange-100 text-orange-600' },
    { label: 'نسبة النمو', value: '+15%', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
  ];

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
        <button
          onClick={() => setActiveTab('SALES')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'SALES' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          المبيعات والفواتير
        </button>
        <button
          onClick={() => setActiveTab('UPLOAD')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'UPLOAD' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          إدارة المخزون والرفع
        </button>
      </div>

      {activeTab === 'SALES' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Sales Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SALES_STATS.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">آخر الطلبات والفواتير</h3>
              <button className="text-sm text-teal-600 font-bold hover:underline">عرض الكل</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="py-4 px-6">رقم الفاتورة</th>
                    <th className="py-4 px-6">الصيدلية</th>
                    <th className="py-4 px-6">عدد الأصناف</th>
                    <th className="py-4 px-6">الإجمالي</th>
                    <th className="py-4 px-6">الحالة</th>
                    <th className="py-4 px-6">التوقيت</th>
                    <th className="py-4 px-6">تفاصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_ORDERS.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr 
                        className={`transition-colors cursor-pointer ${expandedOrderId === order.id ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <td className="py-4 px-6 font-medium text-gray-800">{order.id}</td>
                        <td className="py-4 px-6">{order.pharmacyName}</td>
                        <td className="py-4 px-6">{order.itemsCount}</td>
                        <td className="py-4 px-6 font-bold">{order.totalAmount} ج.م</td>
                        <td className="py-4 px-6">
                          {order.status === 'PENDING' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">قيد الانتظار</span>}
                          {order.status === 'PROCESSING' && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">جاري التجهيز</span>}
                          {order.status === 'COMPLETED' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">مكتمل</span>}
                          {order.status === 'CANCELLED' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">ملغي</span>}
                        </td>
                        <td className="py-4 px-6 text-gray-500">{order.orderDate}</td>
                        <td className="py-4 px-6">
                          <button className="text-gray-400 hover:text-teal-600">
                            {expandedOrderId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </td>
                      </tr>
                      {expandedOrderId === order.id && (
                        <tr className="bg-gray-50/50">
                          <td colSpan={7} className="p-4">
                            <div className="bg-white rounded-lg border border-gray-200 p-4 mx-4">
                              <h4 className="font-bold text-gray-700 mb-3 text-sm">محتويات الطلب:</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs text-right">
                                  <thead className="bg-gray-100 text-gray-600">
                                    <tr>
                                      <th className="p-2">الصنف</th>
                                      <th className="p-2">الكمية</th>
                                      <th className="p-2">سعر الجمهور</th>
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
          </div>
        </div>
      )}

      {activeTab === 'UPLOAD' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Daily Compliance Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${dailyStatus.morning ? 'bg-green-50 border-green-200' : 'bg-white border-orange-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${dailyStatus.morning ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-500'}`}>
                  <Sun size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">قائمة الصباح</h3>
                  <p className="text-sm text-gray-500">موعد الرفع: 10:00 ص</p>
                </div>
              </div>
              {dailyStatus.morning ? (
                <div className="flex items-center gap-1 text-green-600 font-bold bg-white px-3 py-1 rounded-full shadow-sm">
                  <CheckCircle size={16} /> تم الرفع
                </div>
              ) : (
                <div className="flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-3 py-1 rounded-full">
                  <AlertCircle size={16} /> مطلوب
                </div>
              )}
            </div>

            <div className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${dailyStatus.evening ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${dailyStatus.evening ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <Moon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">قائمة المساء</h3>
                  <p className="text-sm text-gray-500">موعد الرفع: 06:00 م</p>
                </div>
              </div>
              {dailyStatus.evening ? (
                <div className="flex items-center gap-1 text-green-600 font-bold bg-white px-3 py-1 rounded-full shadow-sm">
                  <CheckCircle size={16} /> تم الرفع
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-400 font-bold bg-gray-50 px-3 py-1 rounded-full">
                  <Clock size={16} /> في الانتظار
                </div>
              )}
            </div>
          </div>

          {/* OrgaSoft Integration */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Database className="text-teal-400" />
                  <h2 className="text-2xl font-bold">الربط المباشر (OrgaSoft)</h2>
                </div>
                <p className="text-slate-300 max-w-lg">
                  قم بتفعيل الربط المباشر لحل مشكلة تغير الأسعار اللحظية. يتم سحب الكميات والأسعار كل 15 دقيقة تلقائياً.
                </p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10 w-full md:w-auto">
                <div className="flex items-center justify-between gap-8 mb-3">
                  <span className="text-sm font-medium text-slate-300">حالة الاتصال:</span>
                  {syncStatus === 'CONNECTED' ? (
                    <span className="flex items-center gap-1.5 text-green-400 text-sm font-bold animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      متصل الآن
                    </span>
                  ) : (
                    <span className="text-slate-500 text-sm font-bold">غير متصل</span>
                  )}
                </div>
                <button 
                  onClick={handleOrgaSoftSync}
                  disabled={syncStatus === 'SYNCING' || syncStatus === 'CONNECTED'}
                  className={`w-full py-2 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                    syncStatus === 'CONNECTED' 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-teal-500 hover:bg-teal-600 text-white'
                  }`}
                >
                  {syncStatus === 'SYNCING' && <RefreshCw className="animate-spin w-4 h-4" />}
                  {syncStatus === 'IDLE' && "تفعيل الربط"}
                  {syncStatus === 'SYNCING' && "جاري الاتصال..."}
                  {syncStatus === 'CONNECTED' && "تم التفعيل"}
                </button>
              </div>
            </div>
            {/* Background Decorations */}
            <div className="absolute left-0 bottom-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
            <div className="absolute right-10 top-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Manual Upload Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileSpreadsheet className="text-teal-600" />
                تحديث يدوي (Excel / PDF)
              </h3>
              
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  accept=".pdf,.xlsx,.xls,.csv,.jpg,.png"
                  onChange={handleFileUpload}
                />
                <div className="bg-teal-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  {isParsing ? <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" /> : <Upload className="w-8 h-8 text-teal-600" />}
                </div>
                <p className="font-bold text-gray-700 mb-1">
                  {isParsing ? 'جاري قراءة الملف وتحليل البيانات...' : 'اضغط لرفع ملف القائمة اليومية'}
                </p>
                <p className="text-sm text-gray-500">يدعم PDF, Excel, صور</p>
              </div>

              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">أو لصق نصي</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <textarea
                className="w-full h-24 p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none resize-none text-sm transition-shadow"
                placeholder="لصق بيانات القائمة هنا..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
              ></textarea>
              <button 
                onClick={handleParseText}
                disabled={isParsing || !rawText}
                className="mt-4 w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-bold transition-colors"
              >
                معالجة النص
              </button>
            </div>

            {/* Preview & History */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">المعاينة الحية</h3>
                  {parsedData.length > 0 && <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-bold">{parsedData.length} صنف</span>}
                </div>
                
                {parsedData.length > 0 ? (
                  <div className="flex-1 overflow-auto border rounded-xl border-gray-100 relative">
                    <table className="w-full text-sm text-right">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="p-3 text-gray-600">الصنف</th>
                          <th className="p-3 text-gray-600">الخصم</th>
                          <th className="p-3 text-gray-600">السعر</th>
                          <th className="p-3 text-gray-600">بونص</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {parsedData.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-800">{item.tradeName}</td>
                            <td className="p-3 text-red-600 font-bold">{item.discount}%</td>
                            <td className="p-3 text-gray-600">{item.price}</td>
                            <td className="p-3 text-teal-600 text-xs">{item.bonus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-300 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <FileText className="w-12 h-12 mb-2 opacity-20" />
                    <p>لا توجد بيانات للمعاينه حالياً</p>
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2">
                  <History size={16} /> آخر العمليات
                </h4>
                <div className="space-y-2 max-h-40 overflow-auto pr-1">
                  {uploadHistory.slice(0,3).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs">
                      <span className="truncate max-w-[150px]">{item.fileName}</span>
                      <span className="text-gray-400">{item.uploadTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
