import { useState, useEffect, useMemo } from 'react';
import { Product } from './types/product';
import { Category } from './types/category';
import { CartItem } from './types/cart';
import { getProducts, getCategories } from './services/api';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import LoginModal from './components/LoginModal';
import MyOrders from './components/MyOrders';

const API = 'http://localhost:3001';

function App() {
  const { user, token, logout, isLogged } = useAuth();

  const [products,          setProducts]          = useState<Product[]>([]);
  const [categories,        setCategories]        = useState<Category[]>([]);
  const [selectedCategory,  setSelectedCategory]  = useState<string | null>(null);
  const [searchQuery,       setSearchQuery]        = useState('');
  const [cartItems,         setCartItems]          = useState<CartItem[]>([]);
  const [isCartOpen,        setIsCartOpen]         = useState(false);
  const [isLoginOpen,       setIsLoginOpen]        = useState(false);
  const [isOrdersOpen,      setIsOrdersOpen]       = useState(false);
  const [loading,           setLoading]            = useState(true);

  // Frete
  const [freteInfo, setFreteInfo] = useState<{ valor: number; prazo_dias: number; nome: string } | null>(null);
  const [estadoFrete, setEstadoFrete] = useState('');

  // Carrega dados
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    const savedCart = localStorage.getItem('@OrdenhaParts:cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));

    loadData();
  }, []);

  // Se usuário logado tem estado, carrega frete automaticamente
  useEffect(() => {
    if (user?.estado) {
      calcularFrete(user.estado);
    }
  }, [user]);

  // Salva carrinho
  useEffect(() => {
    localStorage.setItem('@OrdenhaParts:cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Retorno do Mercado Pago
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setCartItems([]);
      localStorage.removeItem('@OrdenhaParts:cart');
      alert('✅ Pagamento confirmado! Obrigado pela compra.');
      window.history.replaceState({}, document.title, '/');
    }
    if (query.get('canceled')) {
      alert('⚠️ Pagamento cancelado. Seus itens ainda estão no carrinho.');
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  // Calcular frete por estado
  async function calcularFrete(estado: string) {
    if (!estado) return;
    try {
      const res = await fetch(`${API}/shipping/${estado}`);
      if (!res.ok) return;
      const data = await res.json();
      setFreteInfo({ valor: data.valor, prazo_dias: data.prazo_dias, nome: data.nome });
      setEstadoFrete(estado);
    } catch (err) {
      console.error('Erro ao calcular frete:', err);
    }
  }

  // Filtro de produtos
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = !selectedCategory || p.category_id === selectedCategory;
      const matchesSearch   = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Carrinho
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock_quantity) return prev;
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, qnt: number) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, qnt) } : item).filter(i => i.quantity > 0));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // WhatsApp
  const handleWhatsAppCheckout = () => {
    const phone = '5551985642953';
    const msg   = cartItems.map(i => `*${i.quantity}x* ${i.name} - R$${(i.price * i.quantity).toFixed(2)}`).join('\n');
    const total = cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const frete = freteInfo ? `\n*Frete (${freteInfo.nome}): R$ ${freteInfo.valor.toFixed(2)}*` : '';
    const text  = encodeURIComponent(`*Novo Pedido - OrdenhaParts*\n\n${msg}${frete}\n\n*Total: R$ ${(total + (freteInfo?.valor ?? 0)).toFixed(2)}*`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  // Mercado Pago
  const handleMercadoPagoCheckout = async () => {
    if (!isLogged) {
      setIsCartOpen(false);
      setIsLoginOpen(true);
      return;
    }
    try {
      const response = await fetch(`${API}/payment/create-payment`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ items: cartItems }),
      });
      const data = await response.json();
      if (data.init_point) {
        // Salva o pedido antes de redirecionar
        await fetch(`${API}/orders`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            cliente:     user!.nome,
            pagamento:   'Mercado Pago',
            frete:       'Transportadora',
            status:      'Pendente',
            user_id:     user!.id,
            estado:      estadoFrete || user!.estado,
            frete_valor: freteInfo?.valor ?? null,
            itens:       cartItems.map(i => ({ pecaId: i.id, qty: i.quantity, preco: i.price })),
          }),
        });
        window.location.href = data.init_point;
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao iniciar pagamento');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        cartItemCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onOrdersClick={() => setIsOrdersOpen(true)}
        onLogout={logout}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </aside>

          <section className="flex-1">
            {loading ? (
              <div className="text-center py-10">Carregando...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onWhatsApp={handleWhatsAppCheckout}
        onCheckout={handleMercadoPagoCheckout}
        freteInfo={freteInfo}
        estadoFrete={estadoFrete}
        onCalcularFrete={calcularFrete}
      />

      {isLoginOpen  && <LoginModal  onClose={() => setIsLoginOpen(false)} />}
      {isOrdersOpen && <MyOrders    onClose={() => setIsOrdersOpen(false)} />}
    </div>
  );
}

export default App;
