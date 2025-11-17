import React from "react";
// Importo ícones prontos da biblioteca react-icons
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import "../style/style_components/Footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">LOGO</div>

      <div className="footer-links">
        <a href="#sobre">Sobre Nós</a>
      </div>

      <div className="footer-social">
        {/* Links para as redes sociais com ícones */}
        <a href="https://www.instagram.com" aria-label="Instagram">
          <FaInstagram />
        </a>
        <a href="https://www.facebook.com" aria-label="Facebook">
          <FaFacebookF />
        </a>
        <a href="https://www.youtube.com" aria-label="YouTube">
          <FaYoutube />
        </a>
      </div>
    </footer>
  );
}