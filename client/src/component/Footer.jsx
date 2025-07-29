import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => (
  <footer className="bg-stone-800 text-stone-200 py-12">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-2xl font-bold text-amber-400 mb-4">Akaka Coffee</h3>
          <p className="text-stone-400 text-sm">
            Premium Ethiopian coffee roasted to perfection. Experience the difference quality makes.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm w-full">
            <li><Link to="/" className="text-stone-400 hover:text-amber-400 transition">Home</Link></li>
            <li><Link to="/menu" className="text-stone-400 hover:text-amber-400 transition">Menu</Link></li>
            <li><Link to="/about" className="text-stone-400 hover:text-amber-400 transition">About</Link></li>
            <li><Link to="/contact" className="text-stone-400 hover:text-amber-400 transition">Contact</Link></li>
          </ul>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="font-semibold mb-4">Contact</h4>
          <div className="space-y-2 text-sm w-full">
            <div className="flex items-center text-stone-400">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Addis Ababa, Ethiopia</span>
            </div>
            <div className="flex items-center text-stone-400">
              <Phone className="h-4 w-4 mr-2" />
              <span><a href="tel:+251903243174" className="text-stone-400 hover:text-amber-400 transition">+251-90-899-2890</a></span>
            </div>
            <div className="flex items-center text-stone-400">
              <Mail className="h-4 w-4 mr-2" />
              <span><a href="mailto:contact@akakacoffee.com" className="text-stone-400 hover:text-amber-400 transition">contact@akakacoffee.com</a></span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-stone-700 mt-8 pt-8 text-center text-stone-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Akaka Coffee. All rights reserved. | Built by <a href="https://code-arc-4ouu.vercel.app/" className="text-amber-400 hover:underline">CodeArc</a></p>
      </div>
    </div>
  </footer>
);

export default Footer;
