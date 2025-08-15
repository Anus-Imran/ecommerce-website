// import axios from "axios";
// import { useEffect, useState } from "react";
// import { backendURL, currency } from "../App";
// import { toast } from "react-toastify";

// const List = ({ token }) => {
//     const [list, setList] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const fetchList = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(backendURL + "/api/product/list");
//             if (response.data.success) {
//                 setList(response.data.products);
//             } else {
//                 toast.error(response.data.message);
//             }
//         } catch (error) {
//             console.error(error);
//             toast.error(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const removeProduct = async (id) => {
//         try {
//             const response = await axios.post(backendURL + "/api/product/remove", { id }, { headers: { token } });

//             if (response.data.success) {
//                 toast.success(response.data.message)
//                 await fetchList();
//             } else {
//                 toast.error(response.data.message);
//             }
//         } catch (error) {
//             console.error(error)
//             toast.error(error.message)
//         }
//     }

//     useEffect(() => {
//         fetchList();
//     }, []);

//     return (
//         <>
//             <p className="mb-2 text-lg font-semibold">All Products List</p>

//             {loading ? (
//                 <div className='flex justify-center items-center py-20'>
//                     <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
//                 </div>
//             ) : (
//                 <div className="flex flex-col gap-2">

//                     {/* Header for medium+ screens */}
//                     <div className="hidden md:grid grid-cols-[80px_2fr_1fr_1fr_1fr_1fr_auto] bg-gray-100 text-gray-700 text-sm font-semibold py-2 px-3 rounded-t-lg border border-gray-300">
//                         <b>Image</b>
//                         <b>Name</b>
//                         <b>Category</b>
//                         <b>Sub Category</b>
//                         <b>Sale Price</b>
//                         <b>Actual Price</b>
//                         <b className="text-center">Action</b>
//                     </div>

//                     {/* Products */}
//                     {list.map((item, index) => (
//                     <div
//                         key={index}
//                         className="grid grid-cols-1 md:grid-cols-[80px_2fr_1fr_1fr_1fr_1fr_auto] items-center gap-3 p-3 border border-gray-300 rounded-lg bg-white shadow-sm"
//                     >
//                         {/* Image */}
//                         <img className="w-16 h-16 object-cover rounded-md mx-auto md:mx-0" src={item.image[0]} alt={item.name} />

//                         {/* Name */}
//                         <p className="text-sm font-medium text-gray-800">{item.name}</p>

//                         {/* Category */}
//                         <p className="text-gray-600">{item.category}</p>

//                         {/* Sub Category */}
//                         <p className="text-gray-600">{item.subCategory}</p>

//                         {/* Sale Price */}
//                         <p className="text-green-600 font-semibold">{currency}{item.salePrice}</p>

//                         {/* Actual Price */}
//                         <p className="text-gray-500 line-through">{currency}{item.actualPrice}</p>

//                         {/* Action */}
//                         <p onClick={() => removeProduct(item._id)} className="text-red-500 font-bold text-center cursor-pointer">X</p>
//                     </div>
//                 ))}
//                 </div>
//             )}
//         </>
//     );
// };

// export default List;




import axios from "axios";
import { useEffect, useState } from "react";
import { backendURL, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(backendURL + "/api/product/list");
            if (response.data.success) {
                setList(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const removeProduct = async (id) => {
        try {
            const response = await axios.post(backendURL + "/api/product/remove", { id }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                await fetchList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <>
            <p className="mb-2 text-lg font-semibold">All Products List</p>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <div className="flex flex-col gap-2">

                    {/* Table Header (only for medium+ screens) */}
                    <div className="hidden md:grid grid-cols-[80px_2fr_1fr_1fr_1fr_1fr_auto] bg-gray-100 text-gray-700 text-sm font-semibold py-2 px-3 rounded-t-lg border border-gray-300">
                        <b>Image</b>
                        <b>Name</b>
                        <b>Category</b>
                        <b>Sub Category</b>
                        <b>Sale Price</b>
                        <b>Actual Price</b>
                        <b className="text-center">Action</b>
                    </div>

                    {/* Products List */}
                    {list.map((item, index) => (
                        <div
                            key={index}
                            className="
                                border border-gray-300 rounded-lg bg-white shadow-sm 
                                grid md:grid-cols-[80px_2fr_1fr_1fr_1fr_1fr_auto] 
                                items-center gap-3 p-3
                            "
                        >
                            {/* Mobile Layout */}
                            <div className="md:hidden flex flex-col gap-3 w-full">
                                {/* Image */}
                                <img
                                    className="w-full h-auto object-contain rounded-md"
                                    src={item.image[0]}
                                    alt={item.name}
                                />

                                {/* Info */}
                                <div className="flex flex-col gap-1">
                                    <p className="text-base font-semibold text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-600">Category: {item.category}</p>
                                    <p className="text-sm text-gray-600">Type: {item.subCategory}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-green-600 font-semibold">{currency}{item.salePrice}</p>
                                        <p className="text-gray-500 line-through text-sm">{currency}{item.actualPrice}</p>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeProduct(item._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md w-full"
                                >
                                    Remove
                                </button>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden md:block">
                                <img
                                    className="w-16 h-16 object-contain rounded-md mx-auto md:mx-0"
                                    src={item.image[0]}
                                    alt={item.name}
                                />
                            </div>
                            <p className="hidden md:block text-sm font-medium text-gray-800">{item.name}</p>
                            <p className="hidden md:block text-gray-600">{item.category}</p>
                            <p className="hidden md:block text-gray-600">{item.subCategory}</p>
                            <p className="hidden md:block text-green-600 font-semibold">{currency}{item.salePrice}</p>
                            <p className="hidden md:block text-gray-500 line-through">{currency}{item.actualPrice}</p>
                            <p
                                onClick={() => removeProduct(item._id)}
                                className="hidden md:block text-red-500 font-bold text-center cursor-pointer"
                            >
                                X
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default List;
