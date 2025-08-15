import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

    return (
        <div className="flex items-center justify-between py-4 px-4 sm:px-8 font-medium relative">

            {/* Logo */}
            <Link to="/">
                <img
                    src={assets.logo}
                    alt="Logo"
                    className="w-28 sm:w-36 object-contain"
                />
            </Link>

            {/* Desktop Nav Links */}
            <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
                <NavLink to="/" className="flex flex-col items-center gap-1">
                    <p>HOME</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                </NavLink>
                <NavLink to="/collection" className="flex flex-col items-center gap-1">
                    <p>COLLECTION</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                </NavLink>
                <NavLink to="/about" className="flex flex-col items-center gap-1">
                    <p>ABOUT</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                </NavLink>
                <NavLink to="/contact" className="flex flex-col items-center gap-1">
                    <p>CONTACT</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                </NavLink>
            </ul>

            {/* Icons */}
            <div className="flex items-center gap-5 sm:gap-6">
                <img
                    onClick={() => {
                        setShowSearch(true)
                        navigate('/collection')
                    }}
                    src={assets.search_icon}
                    className="w-5 cursor-pointer"
                    alt="Search"
                />

                {/* Profile Icon Dropdown */}
                <div className="group relative">
                    <img
                        onClick={() => token ? null : navigate('/login')}
                        className="w-5 cursor-pointer"
                        src={assets.profile_icon}
                        alt="Profile"
                    />

                    {/* dropdown menu  */}

                    {
                        token ? (
                            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-10">
                                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                                    <p onClick={() => navigate('/profile')} className="cursor-pointer hover:text-black">My Profile</p>
                                    <p onClick={() => navigate('/wishlist')} className="cursor-pointer hover:text-black">My Wishlist</p>
                                    <p onClick={() => navigate('/orders')} className="cursor-pointer hover:text-black">Orders</p>
                                    <p onClick={logout} className="cursor-pointer hover:text-black">Logout</p>
                                </div>
                            </div>
                        ) : (
                            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-10">
                                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                                    <p onClick={() => navigate('/login')} className="cursor-pointer hover:text-black">Login</p>
                                </div>
                            </div>
                        )
                    }
                </div>

                {/* Cart Icon */}
                <Link to="/cart" className="relative">
                    <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
                    <div className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                        {getCartCount()}
                    </div>
                </Link>

                {/* Mobile Menu Icon */}
                <img
                    onClick={() => setVisible(true)}
                    src={assets.menu_icon}
                    className="w-5 cursor-pointer sm:hidden"
                    alt="Menu"
                />
            </div>

            {/* Sidebar Menu (Mobile Only) */}
            <div
                className={`fixed top-0 right-0 bottom-0 z-20 bg-white transition-all duration-300 shadow-lg ${visible ? 'w-3/4 max-w-xs p-4' : 'w-0 p-0'
                    } overflow-hidden`}
            >
                <div className="flex flex-col text-gray-600">
                    <div
                        onClick={() => setVisible(false)}
                        className="flex items-center gap-4 p-3 cursor-pointer"
                    >
                        <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
                        <p>Back</p>
                    </div>
                    <NavLink
                        className="py-2 pl-4 border"
                        onClick={() => setVisible(false)}
                        to="/"
                    >
                        HOME
                    </NavLink>
                    <NavLink
                        className="py-2 pl-4 border"
                        onClick={() => setVisible(false)}
                        to="/collection"
                    >
                        COLLECTION
                    </NavLink>
                    <NavLink
                        className="py-2 pl-4 border"
                        onClick={() => setVisible(false)}
                        to="/about"
                    >
                        ABOUT
                    </NavLink>
                    <NavLink
                        className="py-2 pl-4 border"
                        onClick={() => setVisible(false)}
                        to="/contact"
                    >
                        CONTACT
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
