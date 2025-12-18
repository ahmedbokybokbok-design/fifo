import React, { useState } from 'react';
import { MarketItem } from '../types';
import { MOCK_MARKET_ITEMS } from '../services/mockData';
import { MapPin, Clock, Tag, Phone } from 'lucide-react';

export const Marketplace: React.FC = () => {
  const [items, setItems] = useState<MarketItem[]>(MOCK_MARKET_ITEMS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">السوق (الرواكد)</h2>
          <p className="text-gray-500 mt-1">بيع وشراء الأصناف الراكدة بين الصيدليات</p>
        </div>
        <button className="mt-4 md:mt-0 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all">
          + أضف صنف للبيع
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-100 relative">
               <img 
                 src={item.imageUrl} 
                 alt={item.tradeName} 
                 className="w-full h-full object-cover"
               />
               <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                 انتهاء: {item.expiryDate}
               </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{item.tradeName}</h3>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                  {Math.round(((item.originalPrice - item.sellingPrice) / item.originalPrice) * 100)}% وفر
                </span>
              </div>
              
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Tag className="w-4 h-4 ml-2 text-teal-500" />
                  <span>الكمية: {item.quantity} علبة</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                   <span className="ml-2 font-bold">السعر:</span>
                   <span className="line-through text-gray-400 ml-2">{item.originalPrice}</span>
                   <span className="text-xl font-bold text-teal-700">{item.sellingPrice} جم</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 ml-2 text-gray-400" />
                  <span>{item.location}</span>
                </div>
              </div>

              <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  <div className="font-semibold text-gray-600">{item.sellerName}</div>
                  <div className="flex items-center mt-1">
                    <Clock className="w-3 h-3 ml-1" />
                    {item.postedAt}
                  </div>
                </div>
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 flex items-center">
                  <Phone className="w-4 h-4 ml-2" />
                  تواصل
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};