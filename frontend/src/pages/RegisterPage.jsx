import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { register, userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
    }
    try {
      await register(name, email, password);
    } catch (err) {
      toast.error(err.response?.data?.message || err.error || 'Registration failed');
    }
  };

  return (
    <div 
      className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[80vh] animate-fade-in relative"
      style={{
        backgroundImage: `linear-gradient(rgba(17, 17, 17, 0.7), rgba(0, 0, 0, 0.9)), url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2000&auto=format&fit=crop')`, // Different jewelry picture
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        margin: '-2rem -1rem -4rem -1rem', 
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100%',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw'
      }}
    >
      <div className="w-full max-w-md bg-dark/40 backdrop-blur-md p-10 rounded-2xl border border-gray-700/50 shadow-[0_0_40px_rgba(0,0,0,0.8)] hover:border-primary/50 transition-colors duration-500 relative overflow-hidden group z-10">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-serif text-primary mb-2 text-center drop-shadow-sm">Create Account</h1>
          <p className="text-gray-400 text-center mb-8 text-sm">Join RSR Collections today</p>
          
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="group/input relative">
              <label className="block text-gray-400 mb-1.5 text-sm font-medium transition-colors group-focus-within/input:text-primary">Full Name</label>
              <input 
                type="text" 
                required 
                className="w-full bg-dark/50 border border-gray-700/50 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-dark/80 transition-all duration-300 backdrop-blur-sm" 
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="group/input relative">
              <label className="block text-gray-400 mb-1.5 text-sm font-medium transition-colors group-focus-within/input:text-primary">Email Address</label>
              <input 
                type="email" 
                required 
                className="w-full bg-dark/50 border border-gray-700/50 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-dark/80 transition-all duration-300 backdrop-blur-sm" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="group/input relative">
              <label className="block text-gray-400 mb-1.5 text-sm font-medium transition-colors group-focus-within/input:text-primary">Password</label>
              <input 
                type="password" 
                required 
                className="w-full bg-dark/50 border border-gray-700/50 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-dark/80 transition-all duration-300 backdrop-blur-sm" 
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="group/input relative">
              <label className="block text-gray-400 mb-1.5 text-sm font-medium transition-colors group-focus-within/input:text-primary">Confirm Password</label>
              <input 
                type="password" 
                required 
                className="w-full bg-dark/50 border border-gray-700/50 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-dark/80 transition-all duration-300 backdrop-blur-sm" 
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-dark-dark font-bold py-3 px-4 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 mt-6">
              Register Account
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800/50 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-primary hover:text-primary-light font-medium transition-colors">
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
