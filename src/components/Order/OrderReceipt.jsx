import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHeaders } from "../../utils/utils";

const OrderReceipt = () => {
  const { orderId } = useParams(); // ORDxxxx
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
        { headers: getHeaders() }
      );
      const data = await res.json();

      if (data.isSuccess) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error("ORDER FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print(); // Google / browser print
  };

  if (loading) {
    return <p className="text-center mt-20">Loading order...</p>;
  }

  if (!order) {
    return <p className="text-center mt-20 text-red-500">Order not found</p>;
  }

  return (
    <div className="max-w-5xl mx-auto my-10 bg-white p-8 text-sm border">

      {/* HEADER */}
      <div className="mb-6 relative">
        <div>
          {/* CENTER TITLE */}
          <h1 className="text-xl font-semibold text-center">
            Order Receipt
          </h1>

          {/* CENTER STATUS */}
          <p
            className={`text-center font-medium mt-1 ${order.payment?.status === "FAILED"
                ? "text-red-500"
                : "text-green-600"
              }`}
          >
            Transaction {order.payment?.status === "FAILED" ? "Declined" : order.status}
          </p>
        </div>

        <div className="absolute top-0 right-0 flex gap-2">
          <button className="border px-3 py-1 text-xs">EMAIL</button>
          <button onClick={handlePrint} className="border px-3 py-1 text-xs">
            PRINT
          </button>
        </div>
      </div>

      {/* ORDER DETAILS */}
      <h3 className="font-semibold mb-3">Order Details</h3>

      <div className="grid grid-cols-2 gap-10 mb-6">
        {/* BILL TO */}
        <div>
          <p className="font-medium mb-1">Bill To</p>
          <p>{order.user.firstName} {order.user.lastName}</p>
          <p>{order.user.email}</p>
          <p>{order.user.phone}</p>
        </div>

        {/* ORDER INFO */}
        <div>
          <p><b>Order ID:</b> {order.orderID}</p>
          <p>
            <b>Order Date:</b>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <p><b>Authorization Code:</b> {order.payment?.transactionID || "null"}</p>
        </div>
      </div>

      {/* ADDRESSES */}
      <div className="grid grid-cols-3 gap-8 mb-6">
        {/* BILLING */}
        <div>
          <p className="font-medium mb-1">Billing Address</p>
          <p>{order.shippingAddress.addressLine1}</p>
          <p>{order.shippingAddress.city}</p>
          <p>{order.shippingAddress.state}</p>
          <p>{order.shippingAddress.postcode}</p>
          <p>{order.shippingAddress.country}</p>
        </div>

        {/* SHIPPING */}
        <div>
          <p className="font-medium mb-1">Shipping Address</p>
          <p>{order.shippingAddress.addressLine1}</p>
          <p>{order.shippingAddress.city}</p>
          <p>{order.shippingAddress.state}</p>
          <p>{order.shippingAddress.postcode}</p>
          <p>{order.shippingAddress.country}</p>
        </div>

        {/* SHIPPER */}
        <div>
          <p className="font-medium mb-1">Shipper</p>
          <p>shopsywhk</p>
          <p>Shipper Contact</p>
        </div>
      </div>

      {/* ITEMS */}
      <div className="border-t border-b py-3 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between py-1">
            <span>{item.name}</span>
            <span>Qty: {item.quantity}</span>
            <span>₹{item.price}</span>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="text-right mb-6">
        <p>Subtotal: ₹{order.pricing.subtotal}</p>
        <p>Shipping: ₹{order.pricing.shippingFee}</p>
        <p className="font-semibold border-t mt-2 pt-2">
          Total: ₹{order.pricing.total}
        </p>
      </div>

      {/* PAYMENT DETAILS */}
      <div className="bg-gray-100 p-4 mb-6">
        <h4 className="font-semibold mb-2">Payment Details</h4>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p><b>Type:</b> {order.payment.method}</p>
            <p><b>Amount:</b> ₹{order.pricing.total}</p>
            <p><b>Order ID:</b> {order.orderID}</p>
            <p className="text-red-500">
              Transaction {order.payment.status}
            </p>
            <p className="text-xs">
              Response Message: Cancelled. Transaction not allowed.
            </p>
          </div>

          <div>
            <p><b>Card Number:</b> **** **** 2345</p>
            <p><b>Account:</b> null</p>
            <p><b>Authorization Code:</b> null</p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-center gap-4">
        <button className="border px-6 py-2 text-blue-600 text-sm">
          RETRY
        </button>
        <button
          onClick={() => navigate("/account?tab=orders")}
          className="border px-6 py-2 text-red-600 text-sm"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};

export default OrderReceipt;
