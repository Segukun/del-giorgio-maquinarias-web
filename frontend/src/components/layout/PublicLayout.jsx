import Header from "./header.jsx";
import Footer from "./footer.jsx";
import WhatsAppButton from "../whatsappbutton.jsx";

const PublicLayout = ({ children }) => (
  <div className="dg-page">
    <Header />
    <main>{children}</main>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default PublicLayout;