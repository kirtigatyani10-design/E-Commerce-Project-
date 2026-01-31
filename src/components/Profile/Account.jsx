import { useEffect, useState } from "react";
import { getHeaders } from "../../utils/utils";
import { FiLogOut } from "react-icons/fi";
import MyOrders from "../Order/Order";

const Account = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // LOAD USER 
  useEffect(() => {
    const raw = localStorage.getItem("user");
    console.log("RAW USER FROM LS:", raw);

    if (!raw || raw === "undefined") {
      return;
    }

    let stored;
    try {
      stored = JSON.parse(raw);
    } catch (e) {
      console.error("JSON PARSE FAILED:", raw);
      return;
    }

    // handle both cases
    const userData = stored?.data || stored;

    if (!userData) return;

    setUser(userData);
    setFormData({
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      phone: userData.phone || "",
    });
  }, []);

  // UPDATE PROFILE 
  const handleUpdateProfile = async () => {
    if (!formData.firstName.trim()) {
      alert("First name is required");
      return;
    }
    if (!formData.lastName.trim()) {
      alert("Last name is required");
      return;
    }
    if (!formData.email.trim()) {
      alert("Email is required");
      return;
    }
    if (!formData.phone.trim()) {
      alert("Phone number is required");
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      const customerId = stored?.data?._id || stored?._id;

      if (!customerId) {
        alert("Customer ID not found");
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/customers/${customerId}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      console.log("UPDATE RESPONSE:", data);

      if (data.isSuccess) {
        alert("Profile updated successfully");

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...stored,
            data: data.data,
          })
        );

        setUser(data.data);
      } else {
        alert(data.message || "Profile update failed");
      }
    } catch (err) {
      console.log("UPDATE PROFILE ERROR:", err);
    }
  };

  // CHANGE PASSWORD 
  const handleChangePassword = async () => {
    if (!passwordData.oldPassword.trim()) {
      alert("Old password is required");
      return;
    }

    if (!passwordData.newPassword.trim()) {
      alert("New password is required");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      const customerId = stored?.data?._id || stored?._id;

      if (!customerId) {
        alert("Customer ID not found");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("New password and confirm password do not match");
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/customers/${customerId}/password-reset`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await res.json();
      console.log("PASSWORD UPDATE RESPONSE:", data);

      if (data.isSuccess) {
        alert("Password updated successfully");

        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(data.message || "Password update failed");
      }
    } catch (err) {
      console.error("CHANGE PASSWORD ERROR:", err);
    }
  };


  // LOGOUT 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="mt-12 mb-20 container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* LEFT SIDEBAR */}
        <div className="bg-primary/10 rounded-xl p-4 space-y-3">
          <h2 className="text-xl font-bold mb-4">My Account</h2>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === "profile"
              ? "bg-primary text-white"
              : "hover:bg-primary/20"
              }`}
          >
            Personal Information
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === "orders"
              ? "bg-primary text-white"
              : "hover:bg-primary/20"
              }`}
          >
            My Orders
          </button>

          <button
            onClick={() => setActiveTab("address")}
            className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === "address"
              ? "bg-primary text-white"
              : "hover:bg-primary/20"
              }`}
          >
            Manage Address
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === "password"
              ? "bg-primary text-white"
              : "hover:bg-primary/20"
              }`}
          >
            Change Password
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left p-2 text-red-600 hover:bg-red-100"
          >
            <FiLogOut />
            Logout
          </button>
        </div>

        {/* RIGHT CONTENT */}
        <div className="md:col-span-3 bg-white dark:bg-gray-900 rounded-xl p-6 shadow">

          {/* PROFILE */}
          {activeTab === "profile" && (
            <>
              <h3 className="text-2xl font-bold mb-6">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["firstName", "lastName", "email", "phone"].map((field, idx) => (
                  <input
                    key={field}
                    type="text"
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    placeholder={field}
                    className="w-full border px-4 py-2 rounded-lg"
                  />
                ))}
              </div>

              <button
                onClick={handleUpdateProfile}
                className="mt-6 bg-primary text-white px-6 py-2 rounded-lg"
              >
                Save Changes
              </button>

            </>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <>
              <h3 className="text-2xl font-bold mb-6">My Orders</h3>
              <MyOrders />
            </>
          )}

          {/* ADDRESS */}
          {activeTab === "address" && (
            <>
              <h3 className="text-2xl font-bold mb-6">
                Manage Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border px-4 py-2 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Mobile Number"
                  className="w-full border px-4 py-2 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Pincode"
                  className="w-full border px-4 py-2 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="House No / Flat / Building"
                  className="w-full border px-4 py-2 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Area / Street"
                  className="w-full border px-4 py-2 rounded-lg md:col-span-2"
                />

                <input
                  type="text"
                  placeholder="City"
                  className="w-full border px-4 py-2 rounded-lg"
                />

                <select className="w-full border px-4 py-2 rounded-lg">
                  <option value="">Select State</option>
                  <option>Maharashtra</option>
                  <option>Delhi</option>
                  <option>Rajasthan</option>
                  <option>Uttar Pradesh</option>
                  <option>Karnataka</option>
                  <option>Tamil Nadu</option>
                  <option>Gujarat</option>
                </select>

                <select className="w-full border px-4 py-2 rounded-lg">
                  <option value="">Select Country</option>
                  <option>India</option>
                </select>

                <input
                  type="text"
                  placeholder="Landmark (Optional)"
                  className="w-full border px-4 py-2 rounded-lg md:col-span-2"
                />

                <select className="w-full border px-4 py-2 rounded-lg">
                  <option value="">Address Type</option>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                </select>

              </div>

              <button className="mt-6 bg-primary text-white px-6 py-2 rounded-lg">
                Save Address
              </button>
            </>
          )}

          {/* PASSWORD */}
          {activeTab === "password" && (
            <>
              <h3 className="text-2xl font-bold mb-6">
                Change Password
              </h3>

              {["oldPassword", "newPassword", "confirmPassword"].map((field, idx) => (
                <input
                  key={idx}
                  type="password"
                  value={passwordData[field]}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      [field]: e.target.value,
                    })
                  }
                  placeholder={field.replace(/([A-Z])/g, ' $1')}
                  className="w-full border px-4 py-2 rounded-lg mb-3"
                />
              ))}

              <button
                onClick={handleChangePassword}
                className="mt-4 bg-primary text-white px-6 py-2 rounded-lg"
              >
                Update Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
