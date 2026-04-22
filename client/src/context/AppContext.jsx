import { useContext, useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false)
  const [product, setProduct] = useState([])
  const [searchQuery, setsearchQuery] = useState([])

  //const [cartItems , setCartItems] = useState({})

   const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  const fetchProducts = async() => {
     try {
      const {data} = await axios.get('/api/product/list')
      if(data.success){
        setProduct(data.products)
      }else{
        console.log(data.message)
      }
     } catch (error) {
      console.log(error.message)
     }
  }

  const fetchSeller = async() => {
    try {
      const {data} = await axios.get('/api/seller/is-auth')
      if(data.success){
        setIsSeller(true)
      }else{
        setIsSeller(false)
      }
    } catch (error) {
      setIsSeller(false)
      console.log(error)
    }
  }

  const fetchUser = async () => {
    try {
      const {data} = await axios.get('/api/user/is-auth');
      if(data.success){
        setUser(data.user)
        // Merge server cart with localStorage cart
        const savedCart = JSON.parse(localStorage.getItem("cart")) || {};
        const mergedCart = { ...data.user.cartItems, ...savedCart };
        setCartItems(mergedCart);
      }
    } catch (error) {
      setUser(null)
    }
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
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    fetchUser()
    fetchSeller()
    fetchProducts()
  },[])


  useEffect(() => {
    const updateCart = async () => {
      try {
        const {data} = await axios.post('/api/cart/update',{cartItems,userId: user?._id})
        
        if(!data.success){
          console.log(data.message)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if(user){
      updateCart();
    }
  },[cartItems,user])

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
    getCartAmount,
    axios,
    fetchProducts,
    setCartItems
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