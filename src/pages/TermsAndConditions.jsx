import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Terms & Conditions
      </h1>

      <p className="text-sm text-gray-600 mb-6 text-center">
        Please read these terms and conditions carefully before placing an order.
      </p>

      {/* SECTION 1 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          1. Acceptance of Terms
        </h2>
        <p className="text-gray-700 text-sm">
          By accessing and using this website, you agree to be bound by these
          Terms and Conditions. If you do not agree with any part of these terms,
          you should not proceed with the checkout or place an order.
        </p>
      </section>

      {/* SECTION 2 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          2. Product Information
        </h2>
        <p className="text-gray-700 text-sm">
          We make every effort to display accurate product descriptions, prices,
          and images. However, slight variations may occur due to screen settings
          or availability. Product availability is subject to change without notice.
        </p>
      </section>

      {/* SECTION 3 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. Pricing & Payments
        </h2>
        <p className="text-gray-700 text-sm">
          All prices listed on the website are inclusive of applicable taxes unless
          stated otherwise. Payments must be completed using the available payment
          methods. Once payment is successfully made, the order will be confirmed.
        </p>
      </section>

      {/* SECTION 4 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          4. Order Confirmation
        </h2>
        <p className="text-gray-700 text-sm">
          After placing an order, you will receive an order confirmation message.
          This does not guarantee acceptance of your order. We reserve the right
          to cancel or refuse any order due to product unavailability or other reasons.
        </p>
      </section>

      {/* SECTION 5 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          5. Shipping & Delivery
        </h2>
        <p className="text-gray-700 text-sm">
          Delivery timelines provided are estimates and may vary due to external
          factors such as logistics delays or unforeseen circumstances. We are not
          responsible for delays beyond our control.
        </p>
      </section>

      {/* SECTION 6 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          6. Returns & Refunds
        </h2>
        <p className="text-gray-700 text-sm">
          Returns or refunds are applicable only as per our return policy. Products
          once sold may not be eligible for return unless damaged or defective at
          the time of delivery.
        </p>
      </section>

      {/* SECTION 7 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          7. User Responsibilities
        </h2>
        <p className="text-gray-700 text-sm">
          You agree to provide accurate and complete information while placing
          an order. Any misuse of the website or fraudulent activity may result
          in termination of your access.
        </p>
      </section>

      {/* SECTION 8 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          8. Limitation of Liability
        </h2>
        <p className="text-gray-700 text-sm">
          The company shall not be held responsible for any indirect or incidental
          damages arising from the use of this website or the purchase of products.
        </p>
      </section>

      {/* SECTION 9 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          9. Changes to Terms
        </h2>
        <p className="text-gray-700 text-sm">
          We reserve the right to update or modify these Terms and Conditions at
          any time without prior notice. Continued use of the website indicates
          acceptance of the updated terms.
        </p>
      </section>

      {/* FOOTER */}
      <p className="text-xs text-gray-500 mt-10 text-center">
        Last updated: September 2026
      </p>
    </div>
  );
};

export default TermsAndConditions;

