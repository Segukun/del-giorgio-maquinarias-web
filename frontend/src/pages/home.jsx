import { useEffect, useState } from "react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import Hero from "../components/hero";
import BrandsCarrousel from "../components/brandscarrousel";
import QuickFilters from "../components/quickfilters";
import FeaturedProducts from "../components/featuredproducts";
import WhatsAppButton from "../components/whatsappbutton";
import { getFeaturedProducts } from "../firebase/productsService";
import "../styles/pages/home.css";

const Home = () => {

  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    getFeaturedProducts().then(setFeaturedProducts);
  }, []);

  return (
    <div className="dg-page">
      <Header />
      <main>
        <Hero />
        <BrandsCarrousel />
        <QuickFilters />
        <FeaturedProducts products={featuredProducts} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default Home;
