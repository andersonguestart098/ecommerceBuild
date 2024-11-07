import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import theme from "../theme/CustomTheme";
import HomePage from "../pages/HomePage";
import BannerUpload from "../components/BannerUpload";
import ProductForm from "../components/ProductForm";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import CartList from "../components/cartList";
import Checkout from "../components/checkout";
import Navbar from "../components/Navbar";
import { CartProvider } from "../contexts/CartContext";
import { SocketProvider } from "../contexts/SocketContext";
import { Box } from "@mui/material";
import OrderTrackingAdmin from "../components/OrderTrackingAdmin";
import OrderTrackingCustomer from "../components/OrderTrackingCustomer";
import ProductList from "../components/ProductList";
import SuccessPage from "../components/mercadoPago/sucesso";
import FailurePage from "../components/mercadoPago/falha";
import PendingPage from "../components/mercadoPago/pendente";
import Management from "../components/gerenciador";
import MeusDados from "../components/MeusDados"; // Novo componente de perfil do usuário

const App: React.FC = () => {
  const [images, setImages] = useState<{ imageUrl: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const [filters, setFilters] = useState({
    searchTerm: "",
    color: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleSearch = (
    searchTerm: string,
    color: string,
    minPrice: number | "",
    maxPrice: number | ""
  ) => {
    setFilters({
      searchTerm,
      color,
      minPrice: minPrice !== "" ? String(minPrice) : "",
      maxPrice: maxPrice !== "" ? String(maxPrice) : "",
    });
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce-fagundes-13c7f6f3f0d3.herokuapp.com/banners"
        );
        const formattedImages = response.data.map(
          (resource: { imageUrl: string }) => ({
            imageUrl: resource.imageUrl,
          })
        );
        setImages(formattedImages);
      } catch (error) {
        console.error("Erro ao buscar imagens de banners:", error);
        setError("Erro ao buscar imagens de banners");
      }
    };
    fetchImages();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <ThemeProvider theme={theme}>
      <SocketProvider>
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            minHeight: "100vh",
            paddingTop: "94px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Router>
            <CartProvider>
              <Navbar
                onSearch={handleSearch}
                showSearch={showSearch}
                toggleSearch={toggleSearch}
              />
              <Box sx={{ marginTop: "0px", position: "relative", zIndex: 5 }}>
                <Routes>
                  <Route
                    path="/"
                    element={<HomePage images={images} filters={filters} />}
                  />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/products" element={<ProductForm />} />
                  <Route path="/cart" element={<CartList />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<OrderTrackingAdmin />} />
                  <Route
                    path="/my-orders"
                    element={<OrderTrackingCustomer />}
                  />
                  <Route
                    path="/product-list"
                    element={<ProductList {...filters} />}
                  />
                  {/* Novo componente de perfil de usuário */}
                  <Route path="/meus-dados" element={<MeusDados />} />

                  {/* Rotas para status de pagamento */}
                  <Route path="/sucesso" element={<SuccessPage />} />
                  <Route path="/falha" element={<FailurePage />} />
                  <Route path="/pendente" element={<PendingPage />} />
                  <Route path="/admin" element={<Management />} />
                </Routes>
              </Box>
            </CartProvider>
          </Router>
        </Box>
      </SocketProvider>
    </ThemeProvider>
  );
};

export default App;
