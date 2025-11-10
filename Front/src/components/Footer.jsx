import React from "react";
import "../style/style_components/Footer.css";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LOGO */}
        <div className="footer-logo">
          <Link to="/">LOGO</Link>
        </div>

        {/* LINKS */}
        <div className="footer-links">
          <Link to="/sobre">Sobre Nós</Link>
        </div>

        {/* REDES SOCIAIS */}
        <div className="footer-social">
          <a href="#" aria-label="Instagram">
            <Instagram size={22} />
          </a>
          <a href="#" aria-label="Facebook">
            <Facebook size={22} />
          </a>
          <a href="#" aria-label="YouTube">
            <Youtube size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
}
