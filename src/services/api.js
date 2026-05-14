const API_URL = 'http://localhost:3001';

export async function getProducts() {

  const res = await fetch(`${API_URL}/products`);

  if (!res.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  const data = await res.json();

  return data.map((p) => ({
    ...p,

    // converte preço
    price: parseFloat(p.price),

    // mapeia estoque
    stock: Number(p.stock_quantity),

    // opcional
    estoque: Number(p.stock_quantity),
  }));
}

export async function getCategories() {

  const res = await fetch(`${API_URL}/categories`);

  if (!res.ok) {
    throw new Error("Erro ao buscar categorias");
  }

  return res.json();
}