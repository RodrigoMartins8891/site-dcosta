import { CartItem } from '../types/cart';
import { X, Trash2, ShoppingBag, Truck } from 'lucide-react';
import { useState } from 'react';

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO'
];

interface FreteInfo {
  valor: number;
  prazo_dias: number;
  nome: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, qnt: number) => void;
  onRemoveItem: (id: string) => void;
  onWhatsApp: () => void;
  onCheckout: () => void;
  freteInfo: FreteInfo | null;
  estadoFrete: string;
  onCalcularFrete: (estado: string) => void;
}

export default function Cart({
  isOpen, onClose, items, onUpdateQuantity, onRemoveItem,
  onWhatsApp, onCheckout, freteInfo, estadoFrete, onCalcularFrete,
}: CartProps) {
  const [estadoSel, setEstadoSel] = useState(estadoFrete || '');

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total    = subtotal + (freteInfo?.valor ?? 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShoppingBag /> Seu Carrinho
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
          </div>

          {/* Itens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">Carrinho vazio</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <p className="text-green-600 font-bold">R$ {Number(item.price).toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
                        className="w-12 border rounded px-1 text-center"
                      />
                      <button onClick={() => onRemoveItem(item.id)} className="text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50 space-y-3">

            {/* Cálculo de frete */}
            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Truck size={16} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">Calcular frete</span>
              </div>
              <div className="flex gap-2">
                <select
                  value={estadoSel}
                  onChange={(e) => setEstadoSel(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-green-500"
                >
                  <option value="">Selecione o estado</option>
                  {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <button
                  onClick={() => onCalcularFrete(estadoSel)}
                  disabled={!estadoSel}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Calcular
                </button>
              </div>
              {freteInfo && (
                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                  <span>Frete para {freteInfo.nome}</span>
                  <span className="font-medium text-green-600">
                    R$ {freteInfo.valor.toFixed(2)} — {freteInfo.prazo_dias} dias úteis
                  </span>
                </div>
              )}
            </div>

            {/* Resumo */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              {freteInfo && (
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span>R$ {freteInfo.valor.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold pt-1 border-t">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              disabled={items.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Pagar com Cartão / PIX
            </button>
            <button
              onClick={onWhatsApp}
              disabled={items.length === 0}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              Pedir via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}