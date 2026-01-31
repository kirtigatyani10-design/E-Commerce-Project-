import React, { useEffect, useState } from "react";
import { getHeaders } from "../../utils/utils";
import { Link } from "react-router-dom";

const Checkout = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user = storedUser?.data || null;
  const isGuestCheckout = !user?._id;
  const guestCartId = localStorage.getItem("guestCartId");

  console.log("USER:", user);
  console.log("IS GUEST:", isGuestCheckout);
  console.log("GUEST CART ID:", guestCartId);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState("COD");
  const [delivery, setDelivery] = useState("standard");
  const stored = JSON.parse(localStorage.getItem("user"));
  
  // CART STATE 
  const [cart, setCart] = useState(null);

  const [shipping, setShipping] = useState({
    country: "",
    city: "",
    street: "",
    postalCode: "",
    state: "",
  });

  const SHIPPING_OPTIONS = {
    standard: {
      label: "Standard Delivery",
      days: "7 days",
      cost: 0,
    },
    express: {
      label: "Express Delivery",
      days: "4 days",
      cost: 40,
    },
  };

  const handlePlaceOrder = async () => {
    console.log("PLACE ORDER CLICKED");

    if (!acceptTerms) {
      alert("Please accept Terms & Conditions");
      return;
    }

    if (!cart?.data?.items?.length) {
      alert("Cart is empty");
      return;
    }

    // USER CHECK
    console.log("USER TYPE:", isGuestCheckout ? "GUEST" : "LOGGED IN");

    // ITEMS FORMAT (POSTMAN ke exact according)
    const items = cart.data.items.map(item => ({
      product: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity
    }));

    console.log("ORDER ITEMS:", items);

    // FINAL PAYLOAD
    const payload = {
      user: stored?.data?._id || null,
      isGuestCheckout: !stored?.data?._id,

      userData: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone
      },

      isGuestCheckout,
      guestCartId: isGuestCheckout ? guestCartId : null,

      items,

      shippingAddress: {
        fullName: `${form.firstName} ${form.lastName}`,
        phone: form.phone,
        houseNumber: "",
        addressLine1: form.shippingStreet,
        addressLine2: "",
        city: form.shippingCity,
        state: form.shippingState,
        postcode: form.shippingZip,
        country: "India"
      },

      shippingMethod: {
        code: "standard",
        label: "Free Shipping",
        estimatedDays: 7,
        fee: 0
      },

      payment: {
        method: "COD"
      }
    };

    console.log("FINAL PAYLOAD:", payload);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/orders/create`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();
      console.log("ORDER API RESPONSE:", data);

      // SUCCESS CHECK (MOST IMPORTANT)
      if (data.isSuccess) {
        alert("Order placed successfully");

        // guest cart cleanup
        if (isGuestCheckout) {
          localStorage.removeItem("guestCartId");
        }

        // REDIRECT
        window.location.href = "/account?tab=orders";
      } else {
        alert(data.message || "Order failed");
      }

    } catch (err) {
      console.error("ORDER ERROR:", err);
      alert("Something went wrong");
    }
  };

  // FORM STATE
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",

    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingZip: "",

    shippingStreet: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",

    pickupNote: "",
    shipperNote: "",
  });

  // LOAD CART ON PAGE LOAD
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/carts/`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );
      const data = await res.json();
      if (data.isSuccess) {
        setCart(data);
      }
    } catch (err) {
      console.log("CHECKOUT CART ERROR:", err);
    }
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // UPDATE QUANTITY
  const updateQty = async (index, type) => {
    const item = cart.data.items[index];
    let qty = item.quantity;

    if (type === "inc") qty++;
    if (type === "dec" && qty > 1) qty--;

    await fetch(
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

    loadCart();
  };

  // REMOVE ITEM
  const removeItem = async (index) => {
    const item = cart.data.items[index];

    await fetch(
      `${import.meta.env.VITE_API_URL}/carts/remove`,
      {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({
          productId: item.productId._id,
        }),
      }
    );

    loadCart();
  };

  // SAFE GUARD
  if (!cart || !cart.data || !cart.data.items) {
    return (
      <p className="mt-24 text-center text-lg font-semibold">
        Loading checkout...
      </p>
    );
  }

  return (
    <div className="mt-0 mb-20 max-w-7xl mx-auto px-6">
      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold text-center mb-2">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-10">

          {/* CONTACT INFO */}
          <section>
            <h2 className="text-xl font-bold mb-4">
              Contact Information
              <p className="text-gray-500 mb-6 text-sm ">
                Fields marked with * are mandatory.
              </p>
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="input"
                placeholder="First name *"
              />

              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="input"
                placeholder="Last name *"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input"
                placeholder="Email address *"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input"
                placeholder="Phone number *"
              />
            </div>
          </section>

          {/* PAYMENT INFORMATION */}
          <section className="border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">
              Payment Method
            </h2>

            <label className="payment-box">
              <input
                type="radio"
                checked={payment === "visa"}
                onChange={() => setPayment("visa")}
              />
              <span>CARD</span>
            </label>

            {payment === "visa" && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input className="input" placeholder="Card number" />
                <input className="input" placeholder="Expiry date (MM/YY)" />
                <input className="input" placeholder="Expiry month" />
                <input className="input" placeholder="CVV" />
              </div>
            )}

            <label className="payment-box mt-4">
              <input
                type="radio"
                checked={payment === "cashondelivery"}
                onChange={() => setPayment("cashondelivery")}
              />
              <span>Cash on Delivery</span>
            </label>

            <label className="payment-box">
              <input
                type="radio"
                checked={payment === "UPI"}
                onChange={() => setPayment("UPI")}
              />
              <span>UPI</span>
            </label>
          </section>

          {/* DELIVERY METHOD */}
          <section >
            <h2 className="text-xl font-bold mb-4">
              Delivery Method
            </h2>

            <label className="delivery-box">
              <input
                type="radio"
                checked={delivery === "standard"}
                onChange={() => setDelivery("standard")}
              />
              <span>
                Standard delivery ({SHIPPING_OPTIONS.standard.days})
                <b className="ml-2 text-primary">FREE</b>
              </span>
            </label>

            <label className="delivery-box">
              <input
                type="radio"
                checked={delivery === "express"}
                onChange={() => setDelivery("express")}
              />
              <span>
                Express delivery ({SHIPPING_OPTIONS.express.days})
                <b className="ml-2">₹40</b>
              </span>
            </label>
          </section>

          {/* BILLING INFORMATION */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-1">Billing Information</h2>
            <p className="text-xs text-gray-500 mb-4">
              Fields marked with * are mandatory
            </p>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="billingStreet"
                placeholder="Street Number *"
                className="input"
                onChange={handleChange}
              />

              <input
                placeholder="Street Name *"
                className="input"
              />

              <input
                placeholder="Other Address"
                className="input col-span-2"
              />

              <input
                name="billingCity"
                placeholder="City *"
                className="input "
                onChange={handleChange}
              />

              <input
                name="billingState"
                placeholder="State/Province *"
                className="input"
                onChange={handleChange}
              />

              <input
                name="billingZip"
                placeholder="Zip/Postal Code *"
                className="input"
                onChange={handleChange}
              />

              <input
                value="India"
                disabled
                className="input"
              />
            </div>
          </section>

          {/* SHIPPING INFORMATION */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-1">Shipping Information</h2>
            <p className="text-xs text-gray-500 mb-4">
              Fields marked with * are mandatory
            </p>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="shippingStreet"
                placeholder="Street Number *"
                className="input bg-yellow-50"
                onChange={handleChange}
              />

              <input
                placeholder="Street Name *"
                className="input bg-yellow-50"
              />

              <input
                placeholder="Other Address"
                className="input bg-yellow-50 col-span-2"
              />

              <input
                name="shippingCity"
                placeholder="City *"
                className="input bg-yellow-50"
                onChange={handleChange}
              />

              <input
                name="shippingState"
                placeholder="State/Province *"
                className="input bg-yellow-50"
                onChange={handleChange}
              />

              <input
                name="shippingZip"
                placeholder="Zip/Postal Code *"
                className="input bg-yellow-50"
                onChange={handleChange}
              />

              <input
                value="India"
                disabled
                className="input bg-yellow-50"
              />
            </div>
          </section>

          {/* PICK UP INFORMATION */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-1">Pick Up Information</h2>
            <p className="text-xs text-gray-500 mb-4">
              These are times are convenient for the seller estate sale
            </p>

            <textarea
              className="input bg-yellow-50"
              placeholder="Custom Text"
              rows={3}
            />
          </section>

          {/* SHIPPER */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-1">Shipper</h2>
            <p className="text-xs text-gray-500 mb-4">
              Assign a shipper for this sale
            </p>

            <textarea
              className="input bg-yellow-50"
              placeholder="Custom Text"
              rows={3}
            />

            {/* TERMS */}
            <div className="flex items-start gap-2 mt-10 text-sm">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1"
              />
              <p className="text-gray-600">
                I accept the{" "}
                <Link to="/terms" className="underline text-primary">
                  Terms & Conditions
                </Link>
              </p>
            </div>

            {/* PLACE ORDER */}
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-primary text-white py-3 rounded font-semibold"
            >
              PLACE ORDER NOW
            </button>
          </section>
        </div>

        {/* RIGHT SIDE – ORDER SUMMARY */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold mb-6 border-b pb-3">
            Order Summary
          </h2>

          {/* CART ITEMS */}
          <div className="space-y-6">
            {cart?.data?.items?.map((item, index) => {
              if (!item.productId) return null;

              return (
                <div
                  key={index}
                  className="flex gap-4 pb-6 border-b"
                >
                  {/* IMAGE */}
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="w-20 h-24 object-cover rounded"
                  />

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">
                      {item.productId.name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Art: {item.productId._id?.slice(-6)}
                    </p>

                    <p className="text-xs text-gray-500">
                      Size: M
                    </p>

                    <p className="text-xs text-gray-500 mb-3">
                      Colour: Default
                    </p>

                    {/* QTY CONTROLS */}
                    <div className="flex items-center gap-2 border rounded w-fit px-2 py-1">
                      <button
                        onClick={() => updateQty(index, "dec")}
                        className="px-2 text-sm"
                      >
                        −
                      </button>

                      <span className="text-sm font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQty(index, "inc")}
                        className="px-2 text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* PRICE + REMOVE */}
                  <div className="flex flex-col items-end justify-between">
                    <p className="font-semibold text-sm">
                      ₹{item.productId.price * item.quantity}
                    </p>

                    <button
                      onClick={() => removeItem(index)}
                      className="bg-primary text-white text-xs px-4 py-1 rounded hover:opacity-90"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {/* TOTALS */}
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cart.subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery cost</span>
                <span className="text-green-600">FREE</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <span>₹0</span>
              </div>

              <div className="flex justify-between font-bold text-base mt-3">
                <span>Total to pay</span>
                <span>₹{cart.subtotal}</span>
              </div>
            </div>

            {/* TERMS */}
            <div className="flex items-start gap-2 mt-10 text-sm">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1"
              />
              <p className="text-gray-600">
                By proceeding I accept the{" "}
                <Link to="/terms" className="underline text-primary">
                  Terms & Conditions
                </Link>
              </p>
            </div>

            {/* PAY BUTTON */}
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-primary text-white py-3 rounded font-semibold mt-4"
            >
              Pay Now
            </button>
          </div>
        </div>

        {/* TAILWIND HELPERS */}
        <style>{`
        .input {
          border: 1px solid #ddd;
          padding: 10px 12px;
          border-radius: 6px;
          width: 100%;
        }
        .delivery-box,
        .payment-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 10px;
          cursor: pointer;
        }
        .qty-btn {
          border: 1px solid #ccc;
          padding: 2px 8px;
          border-radius: 4px;
        }
      `}</style>
      </div>
    </div>
  );
};

export default Checkout;