import "../../styles/layout/footer.css";

const Footer = () =>{
  const year = new Date().getFullYear();

  return (
    <footer className="dg-footer">
      <div className="dg-footer__inner">
        <div className="dg-footer__col">
          <h4>Info útil</h4>
          <ul>
            <li><a href="/tienda">Tienda física</a></li>
            <li><a href="/nosotros">Sobre nosotros</a></li>
            <li><a href="/faq">Preguntas frecuentes</a></li>
          </ul>
        </div>

        <div className="dg-footer__col">
          <h4>Contacto</h4>
          <ul className="dg-footer__contact">
            <li>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" />
              </svg>
              <a href="tel:+5493468123456">+54 9 3468 123456</a>
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                <path d="M2 4h20v16H2V4zm2 2v.3l8 6 8-6V6H4zm16 12V8.7l-8 6-8-6V18h16z" />
              </svg>
              <a href="mailto:info@delgiorgiomaquinarias.com.ar">
                info@delgiorgiomaquinarias.com.ar
              </a>
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                <path d="M12 2C7.6 2 4 5.6 4 10c0 5.4 7 11.5 7.3 11.8.2.2.5.3.7.3s.5-.1.7-.3C13 21.5 20 15.4 20 10c0-4.4-3.6-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
              </svg>
              <span>Ruta 11 km 364, Franck, Santa Fe</span>
            </li>
          </ul>
        </div>

        <div className="dg-footer__col">
          <h4>Legal</h4>
          <ul>
            <li><a href="/terminos">Términos y condiciones</a></li>
            <li><a href="/privacidad">Política de privacidad</a></li>
          </ul>
        </div>
      </div>

      <div className="dg-footer__social">
        <a href="#" aria-label="Facebook" className="dg-footer__social-link">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M13.5 21v-7.7h2.6l.4-3h-3v-1.9c0-.9.2-1.5 1.5-1.5h1.6V4.2C15.9 4.1 15 4 13.9 4c-2.3 0-3.9 1.4-3.9 4v2.3H7.4v3H10V21h3.5z" />
          </svg>
        </a>
        <a href="#" aria-label="Instagram" className="dg-footer__social-link">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 2.2c2.7 0 3 0 4 .05 1 .05 1.7.2 2.3.45.6.25 1.1.6 1.6 1.1.5.5.85 1 1.1 1.6.25.6.4 1.3.45 2.3.05 1 .05 1.3.05 4s0 3-.05 4c-.05 1-.2 1.7-.45 2.3-.25.6-.6 1.1-1.1 1.6-.5.5-1 .85-1.6 1.1-.6.25-1.3.4-2.3.45-1 .05-1.3.05-4 .05s-3 0-4-.05c-1-.05-1.7-.2-2.3-.45-.6-.25-1.1-.6-1.6-1.1-.5-.5-.85-1-1.1-1.6-.25-.6-.4-1.3-.45-2.3C2.2 15 2.2 14.7 2.2 12s0-3 .05-4c.05-1 .2-1.7.45-2.3.25-.6.6-1.1 1.1-1.6.5-.5 1-.85 1.6-1.1.6-.25 1.3-.4 2.3-.45 1-.05 1.3-.05 4-.05zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
          </svg>
        </a>
        <a href="#" aria-label="YouTube" className="dg-footer__social-link">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M21.6 7.2c-.2-1-1-1.7-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3c-1 .2-1.7 1-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8c.2 1 1 1.7 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3c1-.2 1.7-1 1.9-1.9.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8zM10 15V9l5.2 3-5.2 3z" />
          </svg>
        </a>
        <a href="#" aria-label="TikTok" className="dg-footer__social-link">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M16.6 2h-3.2v13.5a2.6 2.6 0 1 1-1.9-2.5v-3.2a5.8 5.8 0 1 0 5.1 5.7V8.3a7.6 7.6 0 0 0 4.4 1.4V6.5a4.4 4.4 0 0 1-4.4-4.4z" />
          </svg>
        </a>
      </div>

      <div className="dg-footer__bottom">
        © {year} Del Giorgio Maquinarias. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
