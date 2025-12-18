
import { User, RegistrationRequest, UserRole } from '../types';
import { MOCK_USERS, MOCK_REGISTRATION_REQUESTS } from './mockData';
import { supabase } from './supabase';

const STORAGE_KEYS = {
  USERS: 'dawaa_users',
  REQUESTS: 'dawaa_requests',
  ORDERS: 'dawaa_orders'
};

// تهيئة البيانات الأولية في LocalStorage إذا لم تكن موجودة
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(MOCK_REGISTRATION_REQUESTS));
  }
};

initializeStorage();

export const api = {
  auth: {
    login: async (phone: string, pass: string): Promise<{ user?: User; error?: string }> => {
      // 1. محاولة استخدام Supabase إذا كان مفعلاً
      if (supabase) {
        // مثال: البحث في جدول المستخدمين
        // const { data, error } = await supabase.from('users').select('*').eq('phone', phone).single();
        // if (error) return { error: 'خطأ في الاتصال' };
        // التحقق من كلمة المرور...
      }

      // 2. استخدام LocalStorage (للعرض التوضيحي والنشر السريع)
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const user = users.find((u: User) => u.phone === phone && u.password === pass);

      if (user) {
        if (user.status !== 'APPROVED') {
          return { error: 'حسابك قيد المراجعة أو معطل.' };
        }
        return { user };
      }

      // البحث في الطلبات المعلقة
      const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
      const pending = requests.find((r: RegistrationRequest) => r.contactPhone === phone && r.password === pass);
      
      if (pending) {
         if (pending.status === 'PENDING') return { error: 'طلبك قيد المراجعة.' };
         if (pending.status === 'REJECTED') return { error: 'تم رفض طلب التسجيل.' };
      }

      return { error: 'بيانات الدخول غير صحيحة' };
    },

    register: async (data: RegistrationRequest): Promise<{ success: boolean; error?: string }> => {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');

      if (users.find((u: User) => u.phone === data.contactPhone) || 
          requests.find((r: RegistrationRequest) => r.contactPhone === data.contactPhone)) {
        return { success: false, error: 'رقم الهاتف مسجل مسبقاً' };
      }

      // إضافة الطلب
      const newRequests = [data, ...requests];
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(newRequests));
      
      // إذا كان هناك Supabase:
      // await supabase.from('registration_requests').insert(data);

      return { success: true };
    }
  },

  admin: {
    getRequests: async (): Promise<RegistrationRequest[]> => {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    },

    processRequest: async (requestId: string, status: 'APPROVED' | 'REJECTED'): Promise<void> => {
      const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');

      const targetIndex = requests.findIndex((r: RegistrationRequest) => r.id === requestId);
      if (targetIndex === -1) return;

      const targetRequest = requests[targetIndex];
      targetRequest.status = status;

      // تحديث قائمة الطلبات
      requests[targetIndex] = targetRequest;
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));

      // إذا تمت الموافقة، ننقله للمستخدمين
      if (status === 'APPROVED') {
        const newUser: User = {
          id: targetRequest.id,
          name: targetRequest.name,
          phone: targetRequest.contactPhone,
          password: targetRequest.password,
          role: targetRequest.type === 'PHARMACY' ? UserRole.PHARMACY : UserRole.WAREHOUSE,
          status: 'APPROVED'
        };
        const newUsers = [...users, newUser];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(newUsers));
      }
    },

    getUsers: async (): Promise<User[]> => {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    },

    deleteUser: async (userId: string): Promise<void> => {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const newUsers = users.filter((u: User) => u.id !== userId);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(newUsers));
    }
  }
};
