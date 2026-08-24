import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import Hero from "../components/hero";
import BrandsCarrousel from "../components/brandscarrousel";
import QuickFilters from "../components/quickfilters";
import FeaturedProducts from "../components/featuredproducts";
import WhatsAppButton from "../components/whatsappbutton";
import "../styles/pages/home.css";

const Home = () => {
  return (
    <div className="dg-page">
      <Header />
      <main>
        <Hero />
        <BrandsCarrousel />
        <QuickFilters />
        <FeaturedProducts />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default Home;
