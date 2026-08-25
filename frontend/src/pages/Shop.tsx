import Header from "../components/Header";
import SignIn from "../components/SignIn";

import { useAuth } from "../hooks/useAuth";
import { IRRA_TOKEN_CANONICAL, usePayments } from "../hooks/usePayments";
import { axiosClient } from "../lib/axiosClient.ts";

const stores = [
  {
    name: "Pioneer Market",
    category: "Market",
    location: "Istanbul, Türkiye",
    product: "Fresh Market",
    price: 0.5,
    emoji: "🛒",
  },
  {
    name: "Pioneer Electronics",
    category: "Electronics",
    location: "Istanbul, Türkiye",
    product: "Smartphone",
    price: 12,
    emoji: "📱",
  },
  {
    name: "Pioneer Cafe",
    category: "Food & Drink",
    location: "Ankara, Türkiye",
    product: "Coffee & Dessert",
    price: 0.15,
    emoji: "☕",
  },
  {
    name: "Pioneer Services",
    category: "Services",
    location: "Izmir, Türkiye",
    product: "Digital Service",
    price: 1,
    emoji: "🔧",
  },
];

const categories = [
  "All",
  "Market",
  "Electronics",
  "Food & Drink",
  "Hotels",
  "Services",
];

const Shop = () => {
  const {
    user,
    isAuthenticated,
    showSignIn,
    signIn,
    signOut,
    closeSignIn,
    requireAuth,
    isLoading: isAuthLoading,
  } = useAuth();

  const { orderProduct, isLoading } = usePayments({
    isAuthenticated,
    onRequireAuth: requireAuth,
  });

  const onSendTestNotification = () => {
    const notification = {
      title: "PioneerMap",
      body: "Welcome to PioneerMap!",
      user_uid: user?.uid,
      subroute: "/",
    };

    axiosClient.post("/notifications/send", {
      notifications: [notification],
    });
  };

  const handlePiPayment = (
    name: string,
    price: number,
    productId: string,
  ) => {
    orderProduct(
      `Order ${name}`,
      price,
      { productId },
    );
  };

  const handleIrraPayment = (
    name: string,
    price: number,
    productId: string,
  ) => {
    orderProduct(
      `Order ${name}`,
      price,
      { productId },
      IRRA_TOKEN_CANONICAL,
    );
  };

  return (
    <>
      <Header
        user={user}
        onSignIn={signIn}
        onSignOut={signOut}
        onSendTestNotification={onSendTestNotification}
        isLoading={isAuthLoading}
      />

      <main
        style={{
          minHeight: "calc(100vh - 60px)",
          background: "#f7f8fa",
          paddingBottom: 32,
        }}
      >
        {/* Hero */}
        <section
          style={{
            padding: "28px 18px 22px",
            background:
              "linear-gradient(135deg, #5b3cc4 0%, #7548d8 55%, #9167e8 100%)",
            color: "white",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            PioneerMap
          </h1>

          <p
            style={{
              margin: "8px 0 20px",
              fontSize: 15,
              opacity: 0.92,
            }}
          >
            Discover the Pi Economy.
          </p>

          {/* Search */}
          <input
            type="search"
            placeholder="Search products, stores or services..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px 16px",
              border: "none",
              borderRadius: 12,
              fontSize: 14,
              outline: "none",
            }}
          />
        </section>

        {/* Quick actions */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            padding: 16,
          }}
        >
          <button
            type="button"
            style={{
              padding: 16,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "white",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            📍 Nearby
          </button>

          <button
            type="button"
            style={{
              padding: 16,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "white",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            🗺️ Map
          </button>
        </section>

        {/* Categories */}
        <section style={{ padding: "0 16px 18px" }}>
          <h2
            style={{
              fontSize: 18,
              margin: "8px 0 12px",
            }}
          >
            Categories
          </h2>

          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                style={{
                  whiteSpace: "nowrap",
                  border: "1px solid #ddd6fe",
                  background: "white",
                  borderRadius: 20,
                  padding: "9px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Stores */}
        <section style={{ padding: "0 16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h2 style={{ fontSize: 18, margin: 0 }}>
              Explore the Pi Economy
            </h2>

            <span
              style={{
                fontSize: 12,
                color: "#777",
              }}
            >
              {stores.length} stores
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            {stores.map((store, index) => (
              <article
                key={store.name}
                style={{
                  background: "white",
                  borderRadius: 14,
                  padding: 16,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 12,
                      background: "#f1ecff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                      flexShrink: 0,
                    }}
                  >
                    {store.emoji}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                      }}
                    >
                      {store.name}
                    </h3>

                    <p
                      style={{
                        margin: "5px 0",
                        fontSize: 13,
                        color: "#666",
                      }}
                    >
                      {store.category}
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "#888",
                      }}
                    >
                      📍 {store.location}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 14,
                    paddingTop: 12,
                    borderTop: "1px solid #eee",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {store.product}
                    </span>

                    <strong>{store.price} π</strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() =>
                        handlePiPayment(
                          store.product,
                          store.price,
                          `pioneer_${index}`,
                        )
                      }
                      style={{
                        flex: 1,
                        border: "none",
                        borderRadius: 8,
                        padding: "11px 8px",
                        background: "#5b3cc4",
                        color: "white",
                        fontWeight: 700,
                      }}
                    >
                      Pay with Pi
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() =>
                        handleIrraPayment(
                          store.product,
                          store.price,
                          `pioneer_${index}`,
                        )
                      }
                      style={{
                        flex: 1,
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        padding: "11px 8px",
                        background: "white",
                        fontWeight: 700,
                      }}
                    >
                      Pay with IRRA
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {showSignIn && (
        <SignIn
          onSignIn={signIn}
          onModalClose={closeSignIn}
          disabled={isAuthLoading}
        />
      )}
    </>
  );
};

export default Shop;

      
