import React, { useState, useMemo, useEffect } from 'react';
import { Search, ShoppingCart, TrendingDown, Award, Check, Plus, Minus, Store, Hash } from 'lucide-react';
import { MOCK_DRUGS, MOCK_WAREHOUSES } from '../services/mockData';
import { suggestDrugCorrections } from '../services/geminiService';
import { Drug, DrugOffer, User } from '../types';

interface DrugSearchProps {
  user: User; // Added user prop to display pharmacy info
  addToCart: (drug: Drug, offer: DrugOffer, warehouseName: string, quantity: number) => void;
}

export const DrugSearch: React.FC<DrugSearchProps> = ({ user, addToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [expandedDrugId, setExpandedDrugId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  
  // State to track quantity for each offer individually
  // Key format: `${drugId}-${warehouseId}`
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Filter drugs based on local mock data using the debounced query
  const filteredDrugs = useMemo(() => {
    if (!debouncedQuery) return [];
    const lowerQ = debouncedQuery.toLowerCase();
    return MOCK_DRUGS.filter(d => 
      d.tradeName.toLowerCase().includes(lowerQ) || 
      d.scientificName.toLowerCase().includes(lowerQ)
    );
  }, [debouncedQuery]);

  const handleAISearch = async () => {
    if (!searchQuery) return;
    setIsSearchingAI(true);
    try {
      const results = await suggestDrugCorrections(searchQuery);
      setSuggestions(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingAI(false);
    }
  };

  const getWarehouseDetails = (id: string) => MOCK_WAREHOUSES.find(w => w.id === id);

  // Helper to find the best deal for a drug
  const getBestDeal = (offers: any[]) => {
    if (!offers || offers.length === 0) return null;
    return offers.reduce((prev, current) => (prev.discount > current.discount ? prev : current));
  };

  const handleQuantityChange = (key: string, val: number) => {
    if (val < 1) return;
    setQuantities(prev => ({ ...prev, [key]: val }));
  };

  const handleAddToCart = (drug: Drug, offer: DrugOffer) => {
    const warehouse = getWarehouseDetails(offer.warehouseId);
    const key = `${drug.id}-${offer.warehouseId}`;
    const qty = quantities[key] || 1;

    if (warehouse) {
      addToCart(drug, offer, warehouse.name, qty);
      
      // Visual Feedback
      setAddedItems(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setAddedItems(prev => ({ ...prev, [key]: false }));
        // Reset quantity after adding
        setQuantities(prev => ({ ...prev, [key]: 1 }));
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pharmacy Dashboard Header */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-10 -mt-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal-500/20 rounded-full -mr-10 -mb-10 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
              <Store className="w-8 h-8 text-teal-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">واجهة الصيدلية</h2>
              <p className="text-teal-100 opacity-90 text-lg">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 shadow-inner w-full md:w-auto justify-between md:justify-start gap-4">
            <div className="flex items-center gap-2 text-teal-200">
              <Hash size={18} />
              <span className="text-sm font-medium">كود الصيدلية:</span>
            </div>
            <span className="text-xl font-mono font-bold tracking-wider text-white">{user.id.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-teal-600" />
          البحث ومقارنة الأسعار
        </h2>
        <div className="relative">
          <input
            type="text"
            dir="rtl"
            className="w-full pr-12 pl-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-lg"
            placeholder="ابحث عن اسم الصنف (مثال: كونكور، بانادول)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
        </div>
        
        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-3 flex gap-2 items-center text-sm text-gray-600">
            <span className="font-semibold text-teal-600">اقتراحات الذكاء الاصطناعي:</span>
            {suggestions.map((s, idx) => (
              <button 
                key={idx} 
                onClick={() => setSearchQuery(s)}
                className="bg-teal-50 hover:bg-teal-100 text-teal-700 px-3 py-1 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        
        {isSearchingAI && <p className="text-xs text-gray-400 mt-2">جاري تحليل البحث...</p>}
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredDrugs.length === 0 && searchQuery && (
          <div className="text-center py-12 bg-white rounded-xl text-gray-500 border border-dashed border-gray-200">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>{debouncedQuery !== searchQuery ? 'جاري البحث...' : 'لا توجد نتائج مطابقة. جرب البحث باسم آخر.'}</p>
          </div>
        )}

        {filteredDrugs.map(drug => {
          const bestOffer = getBestDeal(drug.offers);
          const bestWarehouse = bestOffer ? getWarehouseDetails(bestOffer.warehouseId) : null;

          return (
            <div key={drug.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
              {/* Drug Summary Header */}
              <div 
                onClick={() => setExpandedDrugId(expandedDrugId === drug.id ? null : drug.id)}
                className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  
                  {/* Icon & Name */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-teal-100 p-4 rounded-xl">
                      <span className="font-bold text-teal-700 text-2xl">{drug.tradeName.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">{drug.tradeName}</h3>
                      <p className="text-sm text-gray-500 mb-1">{drug.scientificName}</p>
                      <p className="text-xs text-gray-400 bg-gray-100 inline-block px-2 py-0.5 rounded">{drug.type}</p>
                    </div>
                  </div>

                  {/* Best Offer Highlight (Comparison Front & Center) */}
                  {bestOffer && (
                    <div className="flex-1 w-full md:w-auto bg-green-50 border border-green-100 rounded-lg p-3 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xs text-green-700 font-bold flex items-center gap-1">
                           <Award className="w-3 h-3" />
                           أفضل عرض
                        </span>
                        <span className="text-xs text-gray-500 mt-1">{bestWarehouse?.name}</span>
                      </div>
                      <div className="text-left">
                         <div className="text-xl font-black text-green-700">{bestOffer.discount}% خصم</div>
                         <div className="text-xs text-gray-500">السعر: {bestOffer.price} جم</div>
                      </div>
                    </div>
                  )}

                  {/* Expand Action */}
                  <div className="flex items-center gap-3">
                     <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                       <span className="block text-xs text-gray-500">متاح في</span>
                       <span className="font-bold text-gray-800">{drug.offers.length} مخازن</span>
                     </div>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 transition-transform duration-300 ${expandedDrugId === drug.id ? 'rotate-180 bg-teal-100 text-teal-600' : 'text-gray-400'}`}>
                       <TrendingDown size={18} />
                     </div>
                  </div>

                </div>
              </div>

              {/* Expanded Offers Table */}
              {expandedDrugId === drug.id && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 animate-in slide-in-from-top-2 duration-200">
                  <h4 className="font-bold text-gray-700 mb-3 px-1">جميع العروض المتاحة:</h4>
                  <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                    <table className="w-full text-sm text-right">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="py-3 px-4">المخزن</th>
                          <th className="py-3 px-4">السعر الأساسي</th>
                          <th className="py-3 px-4">الخصم</th>
                          <th className="py-3 px-4">بعد الخصم</th>
                          <th className="py-3 px-4">البونص</th>
                          <th className="py-3 px-4">الحالة</th>
                          <th className="py-3 px-4 w-40 text-center">الكمية والشراء</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {drug.offers.map((offer, idx) => {
                          const warehouse = getWarehouseDetails(offer.warehouseId);
                          const isBest = offer === bestOffer;
                          const priceAfter = (offer.price * (1 - offer.discount / 100)).toFixed(2);
                          const key = `${drug.id}-${offer.warehouseId}`;
                          const qty = quantities[key] || 1;
                          
                          return (
                            <tr key={idx} className={`hover:bg-blue-50/50 transition-colors ${isBest ? 'bg-green-50/30' : ''}`}>
                              <td className="py-3 px-4 font-medium text-gray-800">
                                {warehouse?.name}
                                {warehouse?.integrationType === 'ORGASOFT' && (
                                  <span className="mr-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-100 text-indigo-800">
                                    OrgaSoft
                                  </span>
                                )}
                                {isBest && <span className="mr-2 text-xs text-green-600 font-bold">(الأفضل)</span>}
                              </td>
                              <td className="py-3 px-4 text-gray-500">{offer.price} جم</td>
                              <td className="py-3 px-4">
                                <span className={`font-bold ${isBest ? 'text-green-600 text-lg' : 'text-gray-700'}`}>
                                  {offer.discount}%
                                </span>
                              </td>
                              <td className="py-3 px-4 font-bold text-gray-800">{priceAfter} جم</td>
                              <td className="py-3 px-4 text-teal-600 font-medium">{offer.bonus || '-'}</td>
                              <td className="py-3 px-4">
                                {offer.stockStatus === 'AVAILABLE' && <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded">متاح</span>}
                                {offer.stockStatus === 'LOW' && <span className="text-yellow-600 text-xs font-bold bg-yellow-100 px-2 py-1 rounded">محدود</span>}
                                {offer.stockStatus === 'OUT_OF_STOCK' && <span className="text-red-500 text-xs font-bold bg-red-100 px-2 py-1 rounded">نواقص</span>}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2 justify-center">
                                  <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden h-9">
                                    <button 
                                      className="px-2 text-gray-500 hover:bg-gray-100 transition-colors h-full"
                                      onClick={() => handleQuantityChange(key, qty + 1)}
                                    >
                                      <Plus size={14} />
                                    </button>
                                    <input 
                                      type="number"
                                      min="1"
                                      value={qty}
                                      onChange={(e) => handleQuantityChange(key, parseInt(e.target.value) || 1)}
                                      className="w-10 text-center text-gray-700 font-bold outline-none text-sm h-full appearance-none"
                                    />
                                    <button 
                                      className="px-2 text-gray-500 hover:bg-gray-100 transition-colors h-full"
                                      onClick={() => handleQuantityChange(key, Math.max(1, qty - 1))}
                                    >
                                      <Minus size={14} />
                                    </button>
                                  </div>

                                  <button 
                                    onClick={() => handleAddToCart(drug, offer)}
                                    disabled={offer.stockStatus === 'OUT_OF_STOCK'}
                                    className={`h-9 w-9 rounded-lg shadow-sm transition-all flex items-center justify-center ${
                                      addedItems[key] 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-300'
                                    }`}
                                    title="إضافة للسلة"
                                  >
                                    {addedItems[key] ? <Check size={18} /> : <ShoppingCart size={18} />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};