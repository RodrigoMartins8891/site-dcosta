import { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO'
];

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  const { login, register } = useAuth();
  const [tab,     setTab]     = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [erro,    setErro]    = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');

  // Register form
  const [reg, setReg] = useState({
    nome: '', email: '', senha: '', cpf: '',
    telefone: '', cep: '', endereco: '', numero: '',
    bairro: '', cidade: '', estado: '',
  });
  const setR = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setReg(prev => ({ ...prev, [k]: e.target.value }));

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await login(loginEmail, loginSenha);
      onClose();
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await register(reg);
      onClose();
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {tab === 'login' ? 'Entrar na conta' : 'Criar conta'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'login' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
            onClick={() => { setTab('login'); setErro(''); }}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'register' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
            onClick={() => { setTab('register'); setErro(''); }}
          >
            Cadastro
          </button>
        </div>

        <div className="px-6 py-5">
          {erro && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {erro}
            </div>
          )}

          {/* ── Login ─────────────────────────────────────── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Email</label>
                <input
                  type="email" required value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Senha</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'} required value={loginSenha}
                    onChange={e => setLoginSenha(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                Entrar
              </button>
            </form>
          )}

          {/* ── Cadastro ───────────────────────────────────── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-500 block mb-1">Nome completo *</label>
                  <input required value={reg.nome} onChange={setR('nome')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder="Seu nome" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-500 block mb-1">Email *</label>
                  <input type="email" required value={reg.email} onChange={setR('email')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder="seu@email.com" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-500 block mb-1">Senha *</label>
                  <input type="password" required value={reg.senha} onChange={setR('senha')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder="Mínimo 6 caracteres" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">CPF</label>
                  <input value={reg.cpf} onChange={setR('cpf')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Telefone</label>
                  <input value={reg.telefone} onChange={setR('telefone')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder="(51) 99999-9999" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">CEP</label>
                  <input value={reg.cep} onChange={setR('cep')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder="00000-000" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Estado</label>
                  <select value={reg.estado} onChange={setR('estado')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500">
                    <option value="">Selecione</option>
                    {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-500 block mb-1">Endereço</label>
                  <input value={reg.endereco} onChange={setR('endereco')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder="Rua, Avenida..." />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Número</label>
                  <input value={reg.numero} onChange={setR('numero')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder="123" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Bairro</label>
                  <input value={reg.bairro} onChange={setR('bairro')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder="Bairro" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-500 block mb-1">Cidade</label>
                  <input value={reg.cidade} onChange={setR('cidade')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder="Cidade" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                Criar conta
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
