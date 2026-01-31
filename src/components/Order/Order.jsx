import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHeaders } from "../../utils/utils";

const MyOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyOrders();
  }, []);

  const loadMyOrders = async () => {
  try {
    const stored = JSON.parse(localStorage.getItem("user"));
    const userId = stored?.data?._id || stored?._id;

    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/orders/myorder/${userId}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    const data = await res.json();
    console.log("MY ORDERS API RESPONSE:", data);

    if (data.isSuccess && data.order) {
      // 🔥 KEY FIX
      setOrders([data.order]);
    } else {
      setOrders([]);
    }
  } catch (err) {
    console.error("MY ORDERS ERROR:", err);
    setOrders([]);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-5 gap-4 font-semibold text-sm text-gray-600 border-b pb-3">
        <div>Order ID</div>
        <div>Order Date</div>
        <div>Status</div>
        <div>Amount</div>
        <div>Action</div>
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 && (
        <p className="text-gray-500 text-sm mt-6">No orders found</p>
      )}

      {/* TABLE ROWS */}
      {orders.map((order) => (
        <div
          key={order._id}
          className="grid grid-cols-5 gap-4 items-center py-4 border-b text-sm"
        >
          {/* Order ID */}
          <div className="font-medium">{order.orderID}</div>

          {/* Date */}
          <div className="text-gray-600">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>

          {/* Status */}
          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold
                ${order.status === "DELIVERED"
                  ? "bg-green-100 text-green-700"
                  : order.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }
              `}
            >
              {order.status}
            </span>
          </div>

          {/* Amount */}
          <div className="font-semibold">₹{order.pricing?.total}</div>

          {/* View Details */}
          <div>
            <button
              onClick={() =>
                navigate(`/order-receipt/${order.orderID}`)
              }
              className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded text-xs"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
