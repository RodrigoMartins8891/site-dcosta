import { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API = 'http://localhost:3001';

const STATUS_COLORS: Record<string, string> = {
  'Pendente': 'bg-amber-100 text-amber-700',
  'Concluída': 'bg-green-100 text-green-700',
  'Cancelado': 'bg-red-100 text-red-700',
};

interface OrderItem {
  pecaId: number;
  qty: number;
  preco: number;
  nome: string;
  image_url?: string;
}

interface Order {
  id: number;
  cliente: string;
  data: string;
  pagamento: string;
  frete: string;
  status: string;
  nf: string | null;
  frete_valor: number | null;
  itens: OrderItem[];
}

interface Props {
  onClose: () => void;
}

export default function MyOrders({ onClose }: Props) {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const fmtData = (d: string) => new Date(d).toLocaleDateString('pt-BR');
  const fmtBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const total = (order: Order) =>
  order.itens.reduce(
    (s, i) => s + Number(i.qty) * Number(i.preco),
    0
  ) + Number(order.frete_valor || 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">Meus Pedidos</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {loading ? (
            <div className="text-center py-10 text-gray-400">Carregando pedidos...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10">
              <Package size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">Você ainda não fez nenhum pedido.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Cabeçalho do pedido */}
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div>
                        <p className="text-sm font-medium text-gray-800">Pedido #{order.id}</p>
                        <p className="text-xs text-gray-400">{fmtData(order.data)}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-800">{fmtBRL(total(order))}</span>
                      {expanded === order.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </button>

                  {/* Detalhes expandidos */}
                  {expanded === order.id && (

                    <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-500">
                        <span>Pagamento: <strong className="text-gray-700">{order.pagamento}</strong></span>
                        <span>Frete: <strong className="text-gray-700">{order.frete}</strong></span>
                        {order.nf && <span>NF: <strong className="text-gray-700">{order.nf}</strong></span>}
                        {order.frete_valor && (
                          <span>Valor do frete: <strong className="text-gray-700">{fmtBRL(order.frete_valor)}</strong></span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {order.itens.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 bg-white rounded-lg p-2"
                          >
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.nome}
                                className="w-10 h-10 object-cover rounded-lg"
                              />
                            )}

                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">
                                {item.nome}
                              </p>

                              <p className="text-xs text-gray-400">
                                {item.qty}x {fmtBRL(item.preco)}
                              </p>
                            </div>

                            <span className="text-sm font-medium text-gray-700">
                              {fmtBRL(item.qty * item.preco)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.status === 'Pendente' && (
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch(
                                `${API}/orders/${order.id}/retry-payment`,
                                {
                                  method: 'POST',
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              );

                              const data = await res.json();

                              if (data.init_point) {
                                window.location.href = data.init_point;
                              }

                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition"
                        >
                          Pagar novamente
                        </button>
                      )}

                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-sm font-semibold">
                        <span>Total</span>

                        <span className="text-green-600">
                          {fmtBRL(total(order))}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
