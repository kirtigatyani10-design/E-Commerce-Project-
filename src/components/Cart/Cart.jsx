import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { getHeaders } from "../../utils/utils";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  console.log("CART COMPONENT RENDERED");
  const { setCartCount } = useCart();

  const [cartData, setCartData] = useState({
    itemCount: 0,
    subtotal: 0,
    data: { items: [] },
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/carts/`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await res.json();
      console.log("CART DATA:", data);

      if (data.isSuccess) {
        setCartData(data);
        setCartCount(data.itemCount);
      }
    } catch (err) {
      console.log("GET CART ERROR:", err);
    }
  };

  useEffect(() => {
    console.log("items:", cartData.data.items);
    cartData.data.items.map((item) => {
      if (item.productId) {
        console.log("item name:", item.productId.name);
      }
    });
  }, [cartData]);

  // ✅ UPDATE QTY 
  const updateQty = async (index, type) => {
    const item = cartData.data.items[index];
    if (!item.productId) return;

    let qty = item.quantity;
    if (type === "inc") qty++;
    if (type === "dec" && qty > 1) qty--;

    console.log("UPDATE CLICKED");
    console.log("PRODUCT ID:", item.productId._id);
    console.log("OLD QTY:", item.quantity);
    console.log("NEW QTY:", qty);
    console.log("HEADERS:", getHeaders());

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/carts/update`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            productId: item.productId._id,
            quantity: qty,
          }),
        }
      );

      console.log("UPDATE STATUS:", res.status);
      const data = await res.json();
      console.log("UPDATE RESPONSE:", data);

      if (data.isSuccess) {
        setCartData(data);
        setCartCount(data.itemCount);
        loadCart();
      }
    } catch (err) {
      console.log("UPDATE CART ERROR:", err);
    }
  };

  // ✅ REMOVE ITEM 
  const removeItem = async (index) => {
    const item = cartData.data.items[index];

    console.log("REMOVE CLICKED");
    console.log("PRODUCT ID:", item.productId._id);
    console.log("HEADERS:", getHeaders());

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/carts/remove`,
        {
          method: "DELETE",
          headers: getHeaders(),
          body: JSON.stringify({
            productId: item.productId._id,
          }),
        }
      );

      console.log("REMOVE STATUS:", res.status);
      const data = await res.json();
      console.log("REMOVE RESPONSE:", data);

      if (data.isSuccess) {
        setCartData(data);
        setCartCount(data.itemCount);

        localStorage.setItem("cartCount", data.itemCount);
        loadCart();
      }
    } catch (err) {
      console.log("REMOVE CART ERROR:", err);
    }
  };

  return (
    <div className="mt-26 max-w-6xl mx-auto px-4 mb-20">
      <h1 className="text-center text-3xl font-bold mb-10">
        Your Cart ({cartData.itemCount} items)
      </h1>

      <div className="grid md:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          {cartData.data.items.map((item, index) => {
            if (!item.productId) return null;

            return (
              <div key={index} className="border-b pb-6 flex gap-5">
                <Link to={`/product/${item.productId._id}`}>
                  <img
                    src={item.productId.image}
                    className="w-28 h-28 object-cover rounded-lg cursor-pointer"
                  />
                </Link>

                <div className="flex-1">
                  <Link to={`/product/${item.productId._id}`}>
                    <h2 className="font-bold text-lg hover:text-primary cursor-pointer">
                      {item.productId.name}
                    </h2>
                  </Link>
                  <p className="font-semibold text-primary text-lg mt-2">
                    ₹{item.productId.price}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center border rounded-full px-3 py-1 gap-3">
                    <button onClick={() => updateQty(index, "dec")}>
                      <FaMinus className="text-sm" />
                    </button>

                    <span className="font-medium">{item.quantity}</span>

                    <button onClick={() => updateQty(index, "inc")}>
                      <FaPlus className="text-sm" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 text-xl hover:text-red-700"
                  >
                    <IoClose />
                  </button>

                  <p className="font-semibold mt-1">
                    ₹{item.productId.price * item.quantity}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT */}
        <div className="border p-6 rounded-lg shadow max-h-[350px]">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between py-2">
            <span className="font-semibold">
              ₹{cartData.subtotal.toFixed(2)}
            </span>
          </div>

          <button className="w-full bg-primary text-white mt-5 py-2 rounded-md hover:opacity-90">
            <Link to="/checkout">Check out</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
