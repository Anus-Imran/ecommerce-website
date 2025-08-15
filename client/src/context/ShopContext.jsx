import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : {};
    });
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [productsLoading, setProductsLoading] = useState(false);
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);
        localStorage.setItem('cartItems', JSON.stringify(cartData));

        if (token) {
            try {

                await axios.post(backendURL + '/api/cart/add', { itemId, size }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        } else {
            toast.error('Please login to add items to cart')
            navigate('/login')
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const size in cartItems[items]) {
                try {
                    if (cartItems[items][size] > 0) {
                        totalCount += cartItems[items][size];
                    }
                } catch (error) {

                }
            }
        }

        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId] && cartData[itemId][size]) {
            cartData[itemId][size] = quantity;
        }

        setCartItems(cartData);
        localStorage.setItem('cartItems', JSON.stringify(cartData));

        if (token) {
            try {

                await axios.post(backendURL + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {

                console.log(error)
                toast.error(error.message)

            }
        } else {
            toast.error('Please login to update cart')
            navigate('/login')
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;

        if (!products || products.length === 0) {
            return 0;
        }

        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);

            if (itemInfo && itemInfo.salePrice !== undefined) {
                for (const size in cartItems[items]) {
                    try {
                        const quantity = cartItems[items][size];
                        if (quantity > 0) {
                            const itemTotal = itemInfo.salePrice * quantity;
                            totalAmount += itemTotal;
                        }
                    } catch (error) {
                        console.log('Error calculating item total:', error);
                    }
                }
            }
        }

        return totalAmount;
    }


    const getProductsData = async () => {
        setProductsLoading(true);
        try {
            const response = await axios.get(backendURL + "/api/product/list")
            if (response.data.success) {
                setProducts(response.data.products)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setProductsLoading(false);
        }
    }

    const getUserCart = async (token) => {
        setLoading(true);
        try {

            const response = await axios.post(backendURL + '/api/cart/get', {}, { headers: { token } })
            console.log(response.data)

            if (response.data.success) {
                setCartItems(response.data.cartData)
                localStorage.setItem('cartItems', JSON.stringify(response.data.cartData))
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProductsData();
    }, [])

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!token && storedToken) {
            setToken(storedToken);
            getUserCart(storedToken);
        }
    }, [])

    useEffect(() => {
        if (token) {
            getUserCart(token);
        }
    }, [token])

    const value = {
        products, currency,
        delivery_fee, search,
        setSearch, showSearch,
        setShowSearch, setCartItems,
        cartItems, addToCart,
        getCartCount, updateQuantity,
        getCartAmount, navigate,
        backendURL, token,
        setToken, getUserCart, loading,
        productsLoading
    }

    return (
        <ShopContext.Provider value={value}>
            {
                props.children
            }
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;