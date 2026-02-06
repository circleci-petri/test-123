import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  name?: string;
  price?: number;
  stock?: number;
}

interface User {
  id: number;
  username: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
}

interface Notification {
  id: number;
  message: string;
  type: string;
}

interface CartState {
  items: CartItem[];
  user: User | null;
  token: string | null;
  products: Product[];
  notifications: Notification[];
  loading: boolean;
}

type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { productId: number; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: CartState = {
  items: [],
  user: null,
  token: localStorage.getItem('token'),
  products: [],
  notifications: [],
  loading: false,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.product_id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.product_id !== action.payload),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_USER':
      localStorage.setItem('token', action.payload.token);
      return { ...state, user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { ...state, user: null, token: null, items: [] };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    if (state.token) {
      loadCartItems();
    }
  }, [state.token]);

  const loadCartItems = async () => {
    try {
      const response = await fetch('/api/cart', {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      const data = await response.json();
      dispatch({ type: 'SET_ITEMS', payload: data.items });
    } catch (error) {
      console.error('Failed to load cart', error);
    }
  };

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
