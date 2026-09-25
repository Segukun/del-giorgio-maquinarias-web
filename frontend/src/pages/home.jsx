import Hero from "../components/hero";
import BrandsCarrousel from "../components/brandscarrousel";
import QuickFilters from "../components/quickfilters";
import FeaturedProducts from "../components/featuredproducts";
import "../styles/pages/home.css";

const Home = () => (
  <>
    <Hero />
    <BrandsCarrousel />
    <QuickFilters />
    <FeaturedProducts />
  </>
);

export default Home;