import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-sky-600 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Company Info */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">Coin Wait To Mars Limited</h3>
            <p className="text-sky-100">
              Exploring the future of finance and beyond. Join us on our journey to redefine possibilities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-sky-100 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/services" className="text-sky-100 hover:text-white transition-colors">Services</a></li>
              <li><a href="/blog" className="text-sky-100 hover:text-white transition-colors">Blog</a></li>
              <li><a href="/contact" className="text-sky-100 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="/privacy-policy" className="text-sky-100 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="text-sky-100 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/disclaimer" className="text-sky-100 hover:text-white transition-colors">Disclaimer</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://twitter.com/CoinWaitToMars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-100 hover:text-white transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/company/coin-wait-to-mars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-100 hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/CoinWaitToMars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-100 hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/coinwaittomars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-100 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
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