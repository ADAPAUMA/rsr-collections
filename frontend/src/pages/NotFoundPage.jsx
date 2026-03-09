import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
      <FaExclamationTriangle className="text-primary text-6xl mb-6" />
      <h1 className="text-5xl font-serif text-white mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-gray-400 mb-8 max-w-lg">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link to="/" className="btn-primary py-3 px-8 text-lg">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
