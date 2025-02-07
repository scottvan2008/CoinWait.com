import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-sky-600 text-white py-8 ">
      <div className="container mx-auto px-4">
        {/* Company Info */}
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Coin Wait To Mars Limited</h3>
          <p className="text-sky-100">Contact: scottvan2008@gmail.com, maria.demo@demo.com</p>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-sky-500 mt-8 pt-6 text-center">
          <p className="text-sky-100">
            &copy; {new Date().getFullYear()} Coin Wait To Mars Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;