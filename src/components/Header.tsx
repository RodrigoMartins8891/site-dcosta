import { ShoppingCart, Search, User, LogOut, Package, LogIn } from 'lucide-react';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  user: { nome: string } | null;
  onLoginClick: () => void;
  onOrdersClick: () => void;
  onLogout: () => void;
}

export default function Header({
  cartItemCount, onCartClick, onSearchChange, searchQuery,
  user, onLoginClick, onOrdersClick, onLogout,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex flex-col items-center font-sans select-none w-fit">
            <div className="bg-[#008233] px-8 py-1.5 rounded-[10px] flex flex-col items-center shadow-sm">
              <h1 className="text-[#FFEA5C] text-xl font-black italic tracking-tighter leading-tight">
                D&quot;Costa
              </h1>
              <p className="text-white text-[6px] font-bold tracking-[0.1em] whitespace-nowrap -mt-0.5">
                PEÇAS PARA ORDENHADEIRAS
              </p>
            </div>
            <div className="w-full max-w-[120px] mt-1 flex flex-col gap-0.5">
              <div className="h-[1px] bg-[#FFEA5C] w-full" />
              <div className="flex items-center gap-1.5">
                <div className="h-[1px] bg-[#008233] flex-grow" />
                <span className="text-gray-400 font-bold text-[6px] tracking-tighter uppercase whitespace-nowrap">
                  Desde 2000
                </span>
                <div className="h-[1px] bg-[#008233] flex-grow" />
              </div>
            </div>
          </div>

          {/* Busca */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar peças..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Nome do usuário */}
                <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600">
                  <User size={16} className="text-green-600" />
                  <span className="font-medium">{user.nome.split(' ')[0]}</span>
                </div>

                {/* Meus pedidos */}
                <button
                  onClick={onOrdersClick}
                  title="Meus pedidos"
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Package size={22} />
                </button>

                {/* Logout */}
                <button
                  onClick={onLogout}
                  title="Sair"
                  className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                >
                  <LogOut size={22} />
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <LogIn size={16} />
                Entrar
              </button>
            )}

            {/* Carrinho */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}