import { useContext, useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets.js";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false)
  const [product, setProduct] = useState([])
  const [searchQuery, setsearchQuery] = useState([])

  const [cartItems , setCartItems] = useState({})

  const fetchProducts = async() => {
     setProduct(dummyProducts)
  }

  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems)
    if(cartData[itemId]){
      cartData[itemId] += 1;
    }else{
      cartData[itemId] =1;
    }
    setCartItems(cartData);
    toast.success("Added to Cart")
  }

  const updateCartItem = (itemId,quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData)
    toast.success("Cart Updated")
  }

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if(cartData[itemId])
    {
      cartData[itemId] -= 1;
      if(cartData[itemId] === 0)
        delete cartData[itemId];
    }
    toast.success("Removed from cart");
    setCartItems(cartData)
  }

  const getCartCount = () => {
    let totalcount=0;
    for(const item in cartItems){
      totalcount += cartItems[item];
    }
    return totalcount;
  }

  const getCartAmount = () => {
    let totalAmount=0;
    for(const item in cartItems){
      let iteminfo = product.find((product) => product._id == item);
      if(cartItems[item]>0){
        totalAmount += iteminfo.offerPrice * cartItems[item];
      }
    }
    return totalAmount;
  }

  useEffect(() => {
    fetchProducts()
  },[])

  const value = {
    user,
    setUser,
    isSeller,
    setIsSeller,
    navigate,
    showUserLogin,
    setShowUserLogin,
    product,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setsearchQuery,
    getCartCount,
    getCartAmount
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
