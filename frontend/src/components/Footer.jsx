const Footer = () => {
  return (
    <footer className="bg-dark-dark border-t border-gray-800 text-gray-400 py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-serif text-primary mb-4">RSR Collections</h3>
          <p className="text-sm">Modern luxury jewellery for modern women. Discover our exclusive collection of gold and designer ornaments.</p>
        </div>
        <div>
          <h4 className="text-lg text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/shop" className="hover:text-primary transition-colors">Shop All</a></li>
            <li><a href="/contact" className="hover:text-primary transition-colors">Contact Us</a></li>
            <li><a href="/login" className="hover:text-primary transition-colors">My Account</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg text-white mb-4">Contact</h4>
          <p className="text-sm border-b border-gray-700 pb-2 mb-2">Lucky Shopping Mall,<br/>Main Road, Kakinada,<br/>AP, India</p>
          <p className="text-sm">Care: rsrcollections@example.com</p>
          <p className="text-sm">Phone: +91 9014352672</p>
        </div>
      </div>
      <div className="text-center text-sm pt-8 mt-8 border-t border-gray-800">
        &copy; {new Date().getFullYear()} RSR Collections. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
