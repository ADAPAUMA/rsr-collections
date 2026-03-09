import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaInstagram } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif text-primary mb-12 text-center">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div className="bg-dark-light p-8 rounded-xl border border-gray-800 shadow-xl">
          <h2 className="text-2xl font-serif text-white mb-6">Get In Touch</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-dark p-3 rounded-full text-primary border border-gray-700">
                <FaMapMarkerAlt size={20} />
              </div>
              <div>
                <h3 className="text-lg text-white font-semibold mb-1">Store Location</h3>
                <p className="text-gray-400 leading-relaxed">
                  RSR Collections<br />
                  Lucky Shopping Mall<br />
                  Main Road, Kakinada<br />
                  Andhra Pradesh, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-dark p-3 rounded-full text-primary border border-gray-700">
                <FaPhoneAlt size={20} />
              </div>
              <div>
                <h3 className="text-lg text-white font-semibold mb-1">Phone</h3>
                <p className="text-gray-400">+91 9014352672</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-dark p-3 rounded-full text-green-500 border border-gray-700">
                <FaWhatsapp size={20} />
              </div>
              <div>
                <h3 className="text-lg text-white font-semibold mb-1">WhatsApp</h3>
                <a href="https://wa.me/919014352672" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  Chat with us!
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-dark p-3 rounded-full text-pink-500 border border-gray-700">
                <FaInstagram size={20} />
              </div>
              <div>
                <h3 className="text-lg text-white font-semibold mb-1">Instagram</h3>
                <a href="https://www.instagram.com/rsrcollectionskkd?igsh=MXU4NWd3b2dqM2JhNw==" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  @rsrcollectionskkd
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="rounded-xl overflow-hidden shadow-xl border border-gray-800 h-[400px] md:h-auto">
          {/* Using a general Kakinada coordinates for demo, realistically would be exact iframe */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15264.450377017041!2d82.2359461!3d16.9465224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3828114de93b95%3A0x6bba52d7ee8ca0c2!2sMain%20Rd%2C%20Kakinada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1683908479234!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="RSR Collections Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
