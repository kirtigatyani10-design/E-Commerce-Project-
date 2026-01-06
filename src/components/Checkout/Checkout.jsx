import React, { useEffect, useState } from "react";
import { getHeaders } from "../../utils/utils";

const Checkout = () => {
    const [delivery, setDelivery] = useState("standard");
    const [payment, setPayment] = useState("visa");

    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errors, setErrors] = useState({});

    // CART STATE 
    const [cart, setCart] = useState(null);

    const [shipping, setShipping] = useState({
        country: "",
        city: "",
        street: "",
        postalCode: "",
        state: "",
    });

    // FORM STATE
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        street: "",
        postal: "",
        state: "",
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: "",
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

    // VALIDATION
    const validateCheckout = () => {
        let temp = {};

        if (!form.firstName.trim()) temp.firstName = "First name is required";
        if (!form.lastName.trim()) temp.lastName = "Last name is required";

        if (!form.email.trim())
            temp.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email))
            temp.email = "Enter valid email";

        if (!form.phone.trim())
            temp.phone = "Phone number is required";
        else if (form.phone.length !== 10)
            temp.phone = "Enter 10 digit phone number";

        if (!form.country.trim()) temp.country = "Country is required";
        if (!form.city.trim()) temp.city = "City is required";
        if (!form.street.trim()) temp.street = "Street address is required";
        if (!form.postal.trim()) temp.postal = "Postal code is required";
        if (!form.state.trim()) temp.state = "State is required";

        if (payment === "visa") {
            if (!form.cardNumber.trim())
                temp.cardNumber = "Card number is required";
            else if (form.cardNumber.length !== 16)
                temp.cardNumber = "Enter 16 digit card number";

            if (!form.cardName.trim())
                temp.cardName = "Cardholder name is required";

            if (!form.expiry.trim())
                temp.expiry = "Expiry date is required";

            if (!form.cvv.trim())
                temp.cvv = "CVV is required";
            else if (form.cvv.length !== 3)
                temp.cvv = "CVV must be 3 digits";
        }

        setErrors(temp);
        return Object.keys(temp).length === 0;
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

    // PLACE ORDER (DUMMY)
    const handlePlaceOrder = () => {
        if (!validateCheckout()) return;
        alert("Order placed successfully (dummy)");
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
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <input className="input" placeholder="First name" />
                            <input className="input" placeholder="Last name" />
                            <input className="input" placeholder="Email address" />
                            <input className="input" placeholder="Phone number" />
                        </div>
                    </section>

                    {/* DELIVERY METHOD */}
                    <section className="border rounded-xl p-6">
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
                                Standard delivery (5–6 days)
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
                                Express delivery (1–2 days)
                                <b className="ml-2">₹50</b>
                            </span>
                        </label>
                    </section>

                    {/* SHIPPING INFO */}
                    <section>
                        <h2 className="text-xl font-bold mb-4">
                            Shipping Information
                        </h2>

                        <div className="grid grid-cols-2 gap-4">

                            {/* COUNTRY */}
                            <select
                                className="input"
                                value={shipping.country}
                                onChange={(e) =>
                                    setShipping({ ...shipping, country: e.target.value })
                                }
                            >
                                <option value="">Select Country</option>
                                <option value="London">London</option>
                                <option value="India">India</option>
                                <option value="USA">USA</option>
                                <option value="UK">UK</option>
                                <option value="Canada">Canada</option>
                                <option value="Australia">Australia</option>
                                <option value="Germany">Germany</option>
                                <option value="France">France</option>
                                <option value="Japan">Japan</option>
                                <option value="China">China</option>
                                <option value="Brazil">Brazil</option>
                                <option value="South Africa">South Africa</option>
                                <option value="Italy">Italy</option>
                                <option value="Spain">Spain</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Russia">Russia</option>
                                <option value="Netherlands">Netherlands</option>
                                <option value="Sweden">Sweden</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Turkey">Turkey</option>
                                <option value="Saudi Arabia">Saudi Arabia</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Nigeria">Nigeria</option>
                                <option value="Egypt">Egypt</option>
                                <option value="UAE">UAE</option>
                                <option value="Indonesia">Indonesia</option>
                                <option value="Thailand">Thailand</option>
                                <option value="Vietnam">Vietnam</option>
                                <option value="Philippines">Philippines</option>
                                <option value="Malaysia">Malaysia</option>
                                <option value="Singapore">Singapore</option>
                                <option value="New Zealand">New Zealand</option>
                                <option value="Ireland">Ireland</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Greece">Greece</option>
                                <option value="Czech Republic">Czech Republic</option>
                                <option value="Hungary">Hungary</option>
                                <option value="Poland">Poland</option>
                                <option value="Romania">Romania</option>
                                <option value="Ukraine">Ukraine</option>
                                <option value="Chile">Chile</option>
                                <option value="Other">Other</option>
                                <option value="N/A">N/A</option>
                            </select>

                            {/* CITY */}
                            <input
                                className="input"
                                placeholder="City"
                                value={shipping.city}
                                onChange={(e) =>
                                    setShipping({ ...shipping, city: e.target.value })
                                }
                            />

                            {/* STREET */}
                            <input
                                className="input col-span-2"
                                placeholder="Street Address"
                                value={shipping.street}
                                onChange={(e) =>
                                    setShipping({ ...shipping, street: e.target.value })
                                }
                            />

                            {/* POSTAL */}
                            <input
                                className="input"
                                placeholder="Postal code"
                                value={shipping.postalCode}
                                onChange={(e) =>
                                    setShipping({ ...shipping, postalCode: e.target.value })
                                }
                            />

                            {/* STATE */}
                            <select
                                className="input"
                                value={shipping.state}
                                onChange={(e) =>
                                    setShipping({ ...shipping, state: e.target.value })
                                }
                            >
                                <option value="">Select State</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Rajasthan">Rajasthan</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                <option value="Bihar">Bihar</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Gujarat">Gujarat</option>
                                <option value="West Bengal">West Bengal</option>
                                <option value="Punjab">Punjab</option>
                                <option value="Haryana">Haryana</option>
                                <option value="Odisha">Odisha</option>
                                <option value="Chhattisgarh">Chhattisgarh</option>
                                <option value="Jharkhand">Jharkhand</option>
                                <option value="Assam">Assam</option>
                                <option value="Goa">Goa</option>
                                <option value="Himachal Pradesh">Himachal Pradesh</option>
                                <option value="Uttarakhand">Uttarakhand</option>
                                <option value="Tripura">Tripura</option>
                                <option value="Meghalaya">Meghalaya</option>
                                <option value="Manipur">Manipur</option>
                                <option value="Nagaland">Nagaland</option>
                                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                <option value="Mizoram">Mizoram</option>
                                <option value="Sikkim">Sikkim</option>
                                <option value="Telangana">Telangana</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Lakshadweep">Lakshadweep</option>
                                <option value="Chandigarh">Chandigarh</option>
                                <option value="Puducherry">Puducherry</option>
                                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                <option value="Ladakh">Ladakh</option>
                                <option value="Other">Other</option>
                                <option value="N/A">N/A</option>

                            </select>

                        </div>
                    </section>

                    {/* PAYMENT */}
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
                            <span>Visa</span>
                        </label>

                        {payment === "visa" && (
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <input className="input" placeholder="Card number" />
                                <input className="input" placeholder="Cardholder full name" />
                                <input className="input" placeholder="Expiry date (MM/YY)" />
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
                                checked={payment === "gpay"}
                                onChange={() => setPayment("gpay")}
                            />
                            <span>Google Pay</span>
                        </label>

                        <label className="payment-box">
                            <input
                                type="radio"
                                checked={payment === "paypal"}
                                onChange={() => setPayment("paypal")}
                            />
                            <span>PayPal</span>
                        </label>
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
                                <span className="underline cursor-pointer">
                                    Terms & Conditions
                                </span>
                            </p>
                        </div>

                        {/* PAY BUTTON */}
                        <button
                            onClick={handlePlaceOrder}
                            className="w-full mt-6 bg-primary text-white py-3 rounded hover:opacity-90"
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

