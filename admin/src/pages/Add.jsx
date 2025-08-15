import { useState } from "react";
import { assets } from "../assets/assets";
import axios from 'axios'
import { backendURL } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
    const [image1, setImage1] = useState(false);
    const [image2, setImage2] = useState(false);
    const [image3, setImage3] = useState(false);
    const [image4, setImage4] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [actualPrice, setActualPrice] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory, setSubCategory] = useState("Topwear");
    const [bestSeller, setBestSeller] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("salePrice", salePrice);
            formData.append("actualPrice", actualPrice);
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("bestSeller", bestSeller);
            formData.append("sizes", JSON.stringify(sizes));

            image1 && formData.append("image1", image1);
            image2 && formData.append("image2", image2);
            image3 && formData.append("image3", image3);
            image4 && formData.append("image4", image4);

            const response = await axios.post(backendURL + '/api/product/add', formData, { headers: { token } });

            if (response.data.success) {
                toast.success(response.data.message);
                setName('');
                setDescription('');
                setImage1(false);
                setImage2(false);
                setImage3(false);
                setImage4(false);
                setSalePrice('');
                setActualPrice('');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleSize = (size) => {
        setSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="max-w-4xl mx-auto p-6 sm:p-10 flex flex-col gap-8"
        >
            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800 text-center sm:text-left">
                Add New Product
            </h2>

            {/* Image Upload */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="mb-3 font-semibold text-gray-700">Upload Images</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[image1, image2, image3, image4].map((img, index) => (
                        <label
                            key={index}
                            htmlFor={`image${index + 1}`}
                            className="border-2 border-dashed border-gray-300 hover:border-pink-400 rounded-lg overflow-hidden cursor-pointer relative transition group"
                        >
                            <img
                                className="w-full h-32 object-contain bg-gray-100"
                                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                                alt=""
                            />
                            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition text-white font-medium">
                                Click to Upload
                            </div>
                            <input
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (index === 0) setImage1(file);
                                    if (index === 1) setImage2(file);
                                    if (index === 2) setImage3(file);
                                    if (index === 3) setImage4(file);
                                }}
                                type="file"
                                id={`image${index + 1}`}
                                hidden
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Product Name & Description */}
            <div className="flex flex-col gap-6 sm:gap-4">
                <div>
                    <p className="mb-2 font-medium text-gray-700">Product Name</p>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none shadow-sm"
                        type="text"
                        placeholder="Type here"
                        required
                    />
                </div>

                <div>
                    <p className="mb-2 font-medium text-gray-700">Product Description</p>
                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none shadow-sm min-h-[100px]"
                        placeholder="Write content here"
                        required
                    />
                </div>
            </div>

            {/* Category & Prices */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Category", value: category, setter: setCategory, options: ["Men", "Women", "Kids"] },
                    { label: "Sub Category", value: subCategory, setter: setSubCategory, options: ["Topwear", "Bottomwear", "Winterwear"] },
                    { label: "Actual Price", value: actualPrice, setter: setActualPrice, type: "number" },
                    { label: "Sale Price", value: salePrice, setter: setSalePrice, type: "number" },
                ].map((field, idx) => (
                    <div key={idx}>
                        <p className="mb-2 font-medium text-gray-700">{field.label}</p>
                        {field.options ? (
                            <select
                                onChange={(e) => field.setter(e.target.value)}
                                value={field.value}
                                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none shadow-sm"
                            >
                                {field.options.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                onChange={(e) => field.setter(e.target.value)}
                                value={field.value}
                                type={field.type}
                                placeholder={field.label === "Actual Price" ? "$25" : "$20"}
                                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none shadow-sm"
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Sizes */}
            <div>
                <p className="mb-3 font-semibold text-gray-700">Available Sizes</p>
                <div className="flex flex-wrap gap-3">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                        <div
                            key={size}
                            onClick={() => toggleSize(size)}
                            className={`px-4 py-2 rounded-full cursor-pointer border text-sm font-medium transition
                                ${sizes.includes(size)
                                    ? "bg-pink-100 border-pink-400 text-pink-600"
                                    : "bg-gray-100 border-gray-300 text-gray-700"
                                }`}
                        >
                            {size}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bestseller */}
            <div className="flex items-center gap-3">
                <input
                    onChange={() => setBestSeller((prev) => !prev)}
                    type="checkbox"
                    id="bestseller"
                    checked={bestSeller}
                    className="w-5 h-5 text-pink-500"
                />
                <label htmlFor="bestseller" className="cursor-pointer text-gray-700 font-medium">
                    Add to Bestseller
                </label>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 font-medium rounded-xl shadow-md transition w-fit self-center sm:self-start
                    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 cursor-pointer'} text-white`}
            >
                {loading ? 'Adding Product...' : 'Add Product'}
            </button>
        </form>
    );
};

export default Add;
