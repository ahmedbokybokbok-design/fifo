import React, { useState } from 'react';
import { Pill, LayoutGrid, Store, Menu, X, LogOut, ShieldCheck, ShoppingCart, FileText } from 'lucide-react';
import { DrugSearch } from './components/DrugSearch';
import { Marketplace } from './components/Marketplace';
import { WarehouseDashboard } from './components/WarehouseDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Cart } from './components/Cart';
import { AuthPage } from './components/AuthPage';
import { PharmacyInvoices } from './components/PharmacyInvoices';
import { ViewState, UserRole, CartItem, Drug, DrugOffer, User, RegistrationRequest } from './types';
import { api } from './services/api';

function App() {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string>('');
  const [authSuccess, setAuthSuccess] = useState<string>('');
  
  // App State
  const [currentView, setCurrentView] = useState<ViewState>('SEARCH');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // --- Auth Handlers ---

  const handleLogin = async (phone: string, pass: string) => {
    setAuthError('');
    setAuthSuccess('');
    
    try {
      const result = await api.auth.login(phone, pass);
      if (result.error) {
        setAuthError(result.error);
      } else if (result.user) {
        setCurrentUser(result.user);
        // Redirect based on role
        if (result.user.role === UserRole.ADMIN) setCurrentView('ADMIN_DASHBOARD');
        else if (result.user.role === UserRole.WAREHOUSE) setCurrentView('WAREHOUSE_DASHBOARD');
        else setCurrentView('SEARCH');
      }
    } catch (err) {
      setAuthError('حدث خطأ غير متوقع');
    }
  };

  const handleRegister = async (data: Partial<RegistrationRequest>) => {
    setAuthError('');
    setAuthSuccess('');

    const newRequest: RegistrationRequest = {
      id: Date.now().toString(),
      name: data.name!,
      type: data.type!,
      licenseNumber: data.licenseNumber!,
      location: data.location!,
      requestDate: new Date().toLocaleDateString('ar-EG'),
      status: 'PENDING',
      contactPhone: data.contactPhone!,
      password: data.password!
    };

    try {
      const result = await api.auth.register(newRequest);
      if (result.success) {
        setAuthSuccess('تم إرسال طلب التسجيل بنجاح. سيتم تفعيل الحساب بعد مراجعة الإدارة.');
      } else {
        setAuthError(result.error || 'فشل التسجيل');
      }
    } catch (err) {
      setAuthError('حدث خطأ أثناء الاتصال بالخادم');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCartItems([]);
    setCurrentView('SEARCH');
  };

  // --- Cart Handlers ---

  const addToCart = (drug: Drug, offer: DrugOffer, warehouseName: string, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.drugId === drug.id && item.warehouseId === offer.warehouseId);
      if (existing) {
        return prev.map(item => 
          item.drugId === drug.id && item.warehouseId === offer.warehouseId
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, {
        id: Date.now().toString(),
        drugId: drug.id,
        tradeName: drug.tradeName,
        warehouseId: offer.warehouseId,
        warehouseName: warehouseName,
        price: offer.price,
        discount: offer.discount,
        bonus: offer.bonus,
        quantity: quantity
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmitOrder = (warehouseId: string) => {
    alert("تم إرسال الطلب بنجاح إلى المخزن!");
    setCartItems(prev => prev.filter(item => item.warehouseId !== warehouseId));
  };

  // --- Navigation Component ---
  const NavItem = ({ view, icon: Icon, label, roleRequired, badgeCount }: any) => {
    const userRole = currentUser?.role;
    const canView = !roleRequired || userRole === roleRequired || userRole === UserRole.ADMIN;
    
    if (!canView) return null;
    
    const isActive = currentView === view;
    return (
      <button
        onClick={() => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium relative ${
          isActive 
            ? 'bg-teal-600 text-white shadow-lg shadow-teal-200' 
            : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
        }`}
      >
        <Icon size={20} />
        <span>{label}</span>
        {badgeCount > 0 && (
          <span className="absolute left-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {badgeCount}
          </span>
        )}
      </button>
    );
  };

  // --- Main Render ---

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} onRegister={handleRegister} error={authError} successMsg={authSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed lg:sticky top-0 right-0 h-screen w-72 bg-white border-l border-gray-100 shadow-2xl lg:shadow-none z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10 text-teal-700">
            <div className="bg-teal-600 p-2 rounded-lg text-white">
               <Pill size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">Dawaa<span className="text-orange-500">Connect</span></h1>
              <p className="text-xs text-gray-400 font-medium tracking-wider">منصة الدواء الموحدة</p>
            </div>
            <button 
              className="lg:hidden mr-auto text-gray-400"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X />
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            <NavItem 
              view="SEARCH" 
              icon={Store} 
              label="واجهة الصيدلية"
              roleRequired={UserRole.PHARMACY}
            />
            <NavItem 
              view="CART" 
              icon={ShoppingCart} 
              label="عربة التسوق" 
              roleRequired={UserRole.PHARMACY}
              badgeCount={cartItems.length}
            />
            <NavItem 
              view="INVOICES" 
              icon={FileText} 
              label="فواتيري" 
              roleRequired={UserRole.PHARMACY}
            />
            <NavItem 
              view="MARKETPLACE" 
              icon={LayoutGrid} 
              label="سوق الرواكد" 
            />
            <NavItem 
              view="WAREHOUSE_DASHBOARD" 
              icon={Store} 
              label="لوحة تحكم المخزن" 
              roleRequired={UserRole.WAREHOUSE}
            />
             <NavItem 
              view="ADMIN_DASHBOARD" 
              icon={ShieldCheck} 
              label="إدارة التسجيلات" 
              roleRequired={UserRole.ADMIN}
            />
          </nav>

          {/* User Profile Snippet */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{currentUser.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser.role === UserRole.ADMIN && 'مدير النظام'}
                  {currentUser.role === UserRole.PHARMACY && 'صيدلية'}
                  {currentUser.role === UserRole.WAREHOUSE && 'مخزن'}
                </p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl transition-colors text-sm font-bold w-full"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="font-bold text-gray-700">DawaaConnect</div>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="text-gray-600" />
          </button>
        </div>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {/* View Routing */}
          {currentView === 'SEARCH' && (currentUser.role === UserRole.PHARMACY || currentUser.role === UserRole.ADMIN) && (
            <DrugSearch addToCart={addToCart} user={currentUser} />
          )}
          
          {currentView === 'CART' && (currentUser.role === UserRole.PHARMACY || currentUser.role === UserRole.ADMIN) && (
            <Cart cartItems={cartItems} removeFromCart={removeFromCart} onSubmitOrder={handleSubmitOrder} />
          )}

          {currentView === 'INVOICES' && (currentUser.role === UserRole.PHARMACY || currentUser.role === UserRole.ADMIN) && (
             <PharmacyInvoices user={currentUser} />
          )}
          
          {currentView === 'MARKETPLACE' && <Marketplace />}
          
          {currentView === 'WAREHOUSE_DASHBOARD' && (currentUser.role === UserRole.WAREHOUSE || currentUser.role === UserRole.ADMIN) && (
            <WarehouseDashboard />
          )}
          
          {currentView === 'ADMIN_DASHBOARD' && currentUser.role === UserRole.ADMIN && (
             <AdminDashboard />
          )}
          
          {/* Access Denied Fallbacks */}
          {currentView === 'SEARCH' && currentUser.role === UserRole.WAREHOUSE && (
             <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <ShieldCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-700">خدمة غير متاحة</h2>
              <p className="text-gray-500 mt-2">خاصية مقارنة الأسعار متاحة للصيدليات فقط.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;