import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaPhoneAlt, FaBars, FaTimes } from "react-icons/fa";

export default function RestaurantMenu() {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    axios
      .get(
        "https://www.foodchow.com/api/FoodChowWD/GetRestaurantMenuWDWidget_multi?ShopId=3161&locale_id=null"
      )
      .then((response) => {
        if (response.status === 200 && response.data && response.data.data) {
          const parsedData = JSON.parse(response.data.data);
          const categories = parsedData.CategoryList || [];
          setMenuData(categories);
          if (categories.length > 0) {
            setSelectedCategory(categories[0].CategryId);
          }
        } else {
          setError("Invalid data format received");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery("");
    setShowSidebar(false); // Close sidebar on mobile after selecting category
  };

  const addToCart = (item) => setCart((prevCart) => [...prevCart, item]);

  const removeFromCart = (index) =>
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));

  if (loading) return <div className="text-center text-xl p-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

  const selectedItems =
    menuData.find((category) => category.CategryId === selectedCategory)
      ?.ItemListWidget || [];

  const filteredItems = selectedItems.filter((item) =>
    item.ItemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md border-b">
        <div className="flex items-center space-x-4">
          <img
            src="https://www.foodchow.com/LogoImages/3161_2024-05-21_22-25-2808b048ff6-b83f-4815-9176-fcc616a77ac8.jpg"
            alt="Restaurant Logo"
            className="w-12 h-12 rounded-md"
          />
          <div>
            <h2 className="text-lg font-semibold">FoodChow Demo India</h2>
            <p className="text-sm text-gray-600">📍 Valsad, Gujarat, India</p>
          </div>
        </div>
        <div className="hidden sm:block text-center">
          <p className="text-green-600 font-semibold">Restaurant Is Open</p>
          <p className="text-sm text-gray-600">Timing: 07:00 AM - 11:00 PM ℹ️</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50">
            Choose Service
          </button>
          <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50">
            Book Now
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full">
            <FaPhoneAlt />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row p-4">
        {/* Categories Sidebar */}
        <button
          className="sm:hidden flex items-center px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <FaTimes /> : <FaBars />} Categories
        </button>

        <div
          className={`fixed inset-0 bg-white w-64 p-4 border-r sm:relative sm:block transition-transform ${
            showSidebar ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
          }`}
        >
          <h2 className="text-lg font-bold text-gray-700 mb-4">CATEGORIES</h2>
          <ul>
            {menuData.map((category) => (
              <li
                key={category.CategryId}
                className={`p-2 cursor-pointer hover:bg-gray-100 rounded-md transition ${
                  selectedCategory === category.CategryId
                    ? "bg-blue-100 font-bold"
                    : ""
                }`}
                onClick={() => handleCategoryClick(category.CategryId)}
              >
                {category.CategryName}
              </li>
            ))}
          </ul>
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-4">
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search for dishes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded-l-md focus:outline-none"
            />
            <button className="p-2 bg-blue-500 text-white rounded-r-md">
              <FaSearch />
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {selectedCategory
              ? menuData.find((c) => c.CategryId === selectedCategory)?.CategryName
              : "Menu Items"}
          </h2>
          <div>
            {filteredItems.map((item) => (
              <div
                key={item.ItemId}
                className="p-4 border-b flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{item.ItemName}</h4>
                  <p className="text-blue-600">Rs. {item.Price}</p>
                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => addToCart(item)}
                >
                  Add ➕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-full sm:w-1/4 p-4 border-t sm:border-l">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Your Cart</h2>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png"
                alt="Empty Cart"
                className="w-24 mb-2"
              />
              <p className="text-center text-gray-500">
                Your Cart Is Empty! 🍽️😋
              </p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={index}
                className="flex justify-between p-2 border-b items-center"
              >
                <span>{item.ItemName}</span>
                <button
                  onClick={() => removeFromCart(index)}
                  className="text-red-500"
                >
                  ❌
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
