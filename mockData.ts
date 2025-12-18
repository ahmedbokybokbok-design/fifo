
import { Drug, Warehouse, MarketItem, RegistrationRequest, UploadHistory, User, UserRole, Order } from '../types';

export const MOCK_WAREHOUSES: Warehouse[] = [
  { id: 'w_raya', name: 'شركة الراية فارم', rating: 4.9, lastUpdated: '02:42 م', integrationType: 'PDF' },
  { id: 'w1', name: 'مخازن المتحدة للأدوية', rating: 4.8, lastUpdated: '10:30 ص', integrationType: 'ORGASOFT' },
  { id: 'w2', name: 'مخزن الشفاء', rating: 4.2, lastUpdated: '09:15 ص', integrationType: 'EXCEL' },
  { id: 'w3', name: 'مجموعة فارما مصر', rating: 4.5, lastUpdated: '10:55 ص', integrationType: 'ORGASOFT' },
];

export const MOCK_USERS: User[] = [
  {
    id: 'admin_1',
    name: 'مدير النظام',
    phone: '01000000000',
    password: 'admin123', 
    role: UserRole.ADMIN,
    status: 'APPROVED'
  },
  {
    id: 'user_pharma_1',
    name: 'صيدلية الحياة',
    phone: '01234567890',
    password: '123456',
    role: UserRole.PHARMACY,
    status: 'APPROVED'
  },
  {
    id: 'user_warehouse_1',
    name: 'مخازن المتحدة',
    phone: '01111111111',
    password: '123456',
    role: UserRole.WAREHOUSE,
    status: 'APPROVED'
  }
];

export const MOCK_ORDERS: Order[] = [
  { 
    id: 'INV-2024-001', 
    pharmacyId: 'user_pharma_1',
    pharmacyName: 'صيدلية الحياة', 
    itemsCount: 15, 
    totalAmount: 3200, 
    status: 'PENDING', 
    orderDate: 'منذ 10 دقيقة',
    invoiceRequested: false,
    details: [
      { name: 'اوجمنتين ١ جم', qty: 10, price: 210 },
      { name: 'بانادول اكسترا', qty: 5, price: 108 }
    ]
  },
  { 
    id: 'INV-2024-002', 
    pharmacyId: 'other_pharma',
    pharmacyName: 'صيدلية النور', 
    itemsCount: 8, 
    totalAmount: 1450, 
    status: 'COMPLETED', 
    orderDate: 'منذ 45 دقيقة',
    invoiceRequested: true,
    details: [
      { name: 'كونكور ٥ مجم', qty: 20, price: 72 }
    ]
  },
  { 
    id: 'INV-2024-003', 
    pharmacyId: 'other_pharma_2',
    pharmacyName: 'صيدلية الشفاء', 
    itemsCount: 22, 
    totalAmount: 8900, 
    status: 'PROCESSING', 
    orderDate: 'منذ 1 ساعة',
    invoiceRequested: false,
    details: [
      { name: 'لانتوس سوليستار', qty: 5, price: 1244 },
      { name: 'نكسيوم ٤٠', qty: 10, price: 294 }
    ]
  },
  { 
    id: 'INV-2024-004', 
    pharmacyId: 'user_pharma_1',
    pharmacyName: 'صيدلية الحياة', 
    itemsCount: 5, 
    totalAmount: 650, 
    status: 'COMPLETED', 
    orderDate: 'منذ 2 ساعة',
    invoiceRequested: false,
    details: [
      { name: 'فلاجيل ٥٠٠', qty: 20, price: 34 }
    ]
  },
  { 
    id: 'INV-2024-005', 
    pharmacyId: 'other_pharma_3',
    pharmacyName: 'صيدلية الروضة', 
    itemsCount: 12, 
    totalAmount: 2100, 
    status: 'CANCELLED', 
    orderDate: 'أمس',
    invoiceRequested: false,
    details: []
  },
];

export const MOCK_DRUGS: Drug[] = [
  {
    id: 'd_atrovent',
    tradeName: 'اتروفنت ٥٠٠ مجم ٢٠ فيال',
    scientificName: 'Ipratropium Bromide',
    manufacturer: 'Boehringer',
    type: 'استنشاق',
    offers: [
      { warehouseId: 'w_raya', price: 286, discount: 10, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
      { warehouseId: 'w1', price: 286, discount: 8, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '10:30 ص' },
    ]
  },
  {
    id: 'd_augmentin_1g',
    tradeName: 'اوجمنتین اقراص ١ جم',
    scientificName: 'Amoxicillin + Clavulanic Acid',
    manufacturer: 'GSK',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 210, discount: 25, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
      { warehouseId: 'w1', price: 210, discount: 20, bonus: '', stockStatus: 'LOW', lastUpdated: '10:30 ص' },
    ]
  },
  {
    id: 'd_augmentin_625',
    tradeName: 'اوجمنتین اقراص ٦٢٥ مجم',
    scientificName: 'Amoxicillin + Clavulanic Acid',
    manufacturer: 'GSK',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 117, discount: 29, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_augmentin_susp_457',
    tradeName: 'اوجمنتین شراب ٤٥٧ مجم',
    scientificName: 'Amoxicillin + Clavulanic Acid',
    manufacturer: 'GSK',
    type: 'شراب',
    offers: [
      { warehouseId: 'w_raya', price: 67, discount: 32, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_ator_10',
    tradeName: 'اتور ١٠ مجم',
    scientificName: 'Atorvastatin',
    manufacturer: 'EIPICO',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 45, discount: 33, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_ator_20',
    tradeName: 'اتور ٢٠ مجم',
    scientificName: 'Atorvastatin',
    manufacturer: 'EIPICO',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 79, discount: 32, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_ator_40',
    tradeName: 'اتور ٤٠ مجم',
    scientificName: 'Atorvastatin',
    manufacturer: 'EIPICO',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 106, discount: 31, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_epimol_500',
    tradeName: 'ابیمول ٥٠٠ مجم',
    scientificName: 'Paracetamol',
    manufacturer: 'Glaxo',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 33, discount: 24, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_adol_500',
    tradeName: 'ادول ٥٠٠ مجم',
    scientificName: 'Paracetamol',
    manufacturer: 'Jubilant',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 34, discount: 32, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_alphaintern',
    tradeName: 'الفينترن ٣٠ قرص',
    scientificName: 'Trypsin + Chymotrypsin',
    manufacturer: 'Amoun',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 87, discount: 30, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
      { warehouseId: 'w2', price: 87, discount: 28, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '09:15 ص' },
    ]
  },
  {
    id: 'd_amaryl_1',
    tradeName: 'اماریل ١ مجم',
    scientificName: 'Glimepiride',
    manufacturer: 'Sanofi',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 40, discount: 27, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_amaryl_2',
    tradeName: 'اماریل ٢ مجم',
    scientificName: 'Glimepiride',
    manufacturer: 'Sanofi',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 78, discount: 28, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_amaryl_3',
    tradeName: 'اماریل ٣ مجم',
    scientificName: 'Glimepiride',
    manufacturer: 'Sanofi',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 87, discount: 28, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_antinal_syrup',
    tradeName: 'انتینال شراب ٦٠ مل',
    scientificName: 'Nifuroxazide',
    manufacturer: 'Amoun',
    type: 'شراب',
    offers: [
      { warehouseId: 'w_raya', price: 24, discount: 34, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_omega3_plus',
    tradeName: 'اومیجا ٣ بلس',
    scientificName: 'Omega 3',
    manufacturer: 'Sedico',
    type: 'كبسولات',
    offers: [
      { warehouseId: 'w_raya', price: 135, discount: 19, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_panadol_adv',
    tradeName: 'بانادول ادفانس',
    scientificName: 'Paracetamol',
    manufacturer: 'GSK',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 92, discount: 30, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
      { warehouseId: 'w1', price: 92, discount: 25, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '10:00 ص' },
    ]
  },
  {
    id: 'd_panadol_extra',
    tradeName: 'بانادول اكسترا',
    scientificName: 'Paracetamol + Caffeine',
    manufacturer: 'GSK',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 108, discount: 24, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
      { warehouseId: 'w1', price: 108, discount: 22, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '10:00 ص' },
    ]
  },
  {
    id: 'd_betacor_80',
    tradeName: 'بیتاكور ٨٠ مجم',
    scientificName: 'Sotalol',
    manufacturer: 'Amoun',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 75, discount: 36, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_betadine_shampoo',
    tradeName: 'بیتادین شامبو',
    scientificName: 'Povidone Iodine',
    manufacturer: 'Nile',
    type: 'شامبو',
    offers: [
      { warehouseId: 'w_raya', price: 90, discount: 20, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_brufen_400',
    tradeName: 'بروفين ٤٠٠ مجم',
    scientificName: 'Ibuprofen',
    manufacturer: 'Abbott',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 78, discount: 32, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_brufen_600',
    tradeName: 'بروفين ٦٠٠ مجم',
    scientificName: 'Ibuprofen',
    manufacturer: 'Abbott',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 99, discount: 38, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_bisolvon_tab',
    tradeName: 'بیسلفون اقراص',
    scientificName: 'Bromhexine',
    manufacturer: 'Sanofi',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 25, discount: 36, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_telfast_120',
    tradeName: 'تلفاست ١٢٠ مجم',
    scientificName: 'Fexofenadine',
    manufacturer: 'Sanofi',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 116, discount: 30, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_telfast_180',
    tradeName: 'تلفاست ١٨٠ مجم',
    scientificName: 'Fexofenadine',
    manufacturer: 'Sanofi',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 160, discount: 38, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_trental_400',
    tradeName: 'ترنتال ٤٠٠ مجم',
    scientificName: 'Pentoxifylline',
    manufacturer: 'Sanofi',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 86, discount: 27, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_tritace_1_25',
    tradeName: 'تریتاس ١.٢٥ مجم',
    scientificName: 'Ramipril',
    manufacturer: 'Sanofi',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 44, discount: 30, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_tritace_5',
    tradeName: 'تریتاس ٥ مجم',
    scientificName: 'Ramipril',
    manufacturer: 'Sanofi',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 76, discount: 32, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  },
  {
    id: 'd_glucophage_500',
    tradeName: 'جلوكوفاج ٥٠٠ مجم',
    scientificName: 'Metformin',
    manufacturer: 'Merck',
    type: 'اقراص',
    offers: [
      { warehouseId: 'w_raya', price: 27.5, discount: 0, bonus: '', stockStatus: 'AVAILABLE', lastUpdated: '02:42 م' },
    ]
  }
];

export const MOCK_MARKET_ITEMS: MarketItem[] = [
    {
        id: 'm1',
        sellerName: 'صيدلية النور',
        tradeName: 'أوجمانتين 1 جم',
        quantity: 10,
        expiryDate: '12/2025',
        originalPrice: 210,
        sellingPrice: 180,
        description: 'متوفر 10 علب بحالة ممتازة - انتهاء بعيد',
        location: 'مدينة نصر',
        imageUrl: 'https://placehold.co/400x300?text=Augmentin',
        postedAt: 'منذ 2 ساعة'
    },
    {
        id: 'm2',
        sellerName: 'صيدلية الحمد',
        tradeName: 'باندول اكسترا',
        quantity: 50,
        expiryDate: '10/2024',
        originalPrice: 108,
        sellingPrice: 90,
        description: 'حرق اسعار لعدم الحاجة',
        location: 'المعادي',
        imageUrl: 'https://placehold.co/400x300?text=Panadol',
        postedAt: 'منذ 5 ساعات'
    },
    {
        id: 'm3',
        sellerName: 'صيدلية الشفاء',
        tradeName: 'كونكور 5 بلس',
        quantity: 20,
        expiryDate: '01/2025',
        originalPrice: 65,
        sellingPrice: 50,
        description: 'متوفر كمية محدودة',
        location: 'المهندسين',
        imageUrl: 'https://placehold.co/400x300?text=Concor',
        postedAt: 'منذ يوم'
    }
];

export const MOCK_UPLOAD_HISTORY: UploadHistory[] = [
    {
        id: 'up_1',
        fileName: 'daily_list_oct_10.pdf',
        uploadTime: '10:00 ص',
        status: 'PROCESSED',
        itemsCount: 150
    },
    {
        id: 'up_2',
        fileName: 'extra_bonus.xlsx',
        uploadTime: '02:30 م',
        status: 'PROCESSED',
        itemsCount: 45
    },
    {
        id: 'up_3',
        fileName: 'insulins.pdf',
        uploadTime: '09:00 ص',
        status: 'FAILED',
        itemsCount: 0
    }
];

export const MOCK_REGISTRATION_REQUESTS: RegistrationRequest[] = [
    {
        id: 'req_1',
        name: 'صيدلية المستقبل',
        type: 'PHARMACY',
        licenseNumber: '123456',
        location: 'الجيزة - الدقي',
        requestDate: '2023-10-25',
        status: 'PENDING',
        contactPhone: '01010101010',
        password: 'password123'
    },
    {
        id: 'req_2',
        name: 'مخازن الأمل',
        type: 'WAREHOUSE',
        licenseNumber: '654321',
        location: 'القاهرة - مدينة نصر',
        requestDate: '2023-10-24',
        status: 'PENDING',
        contactPhone: '01122334455',
        password: 'password123'
    },
    {
        id: 'req_3',
        name: 'صيدلية الشعب',
        type: 'PHARMACY',
        licenseNumber: '987654',
        location: 'الاسكندرية',
        requestDate: '2023-10-20',
        status: 'APPROVED',
        contactPhone: '01222222222',
        password: 'password123'
    },
    {
        id: 'req_4',
        name: 'مخزن الشروق',
        type: 'WAREHOUSE',
        licenseNumber: '456789',
        location: 'المنصورة',
        requestDate: '2023-10-18',
        status: 'REJECTED',
        contactPhone: '01555555555',
        password: 'password123'
    }
];
