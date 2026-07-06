import React, { useState, useEffect } from 'react';
import { LogIn as LogInIcon, User, Lock, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Removed: import './Login.css'; // Relying on global App.css now

// Global variables provided by the environment
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Mock Firebase functions (Actual Firebase services are initialized in Analysis.jsx)
// We only use the environment's auto-sign-in mechanism here.

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // In this specific environment, authentication is handled automatically
    // via a custom token (__initial_auth_token) in the background.
    // This effect checks if the token is available to simulate being logged in.
    useEffect(() => {
        if (initialAuthToken) {
            // Wait briefly to ensure the auth process in Analysis.jsx has finished
            const checkAuth = setTimeout(() => {
                // Since the token exists, assume the user is signed in.
                setIsLoggedIn(true);
            }, 500); 

            return () => clearTimeout(checkAuth);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // --- SIMULATED LOGIN FOR ENVIRONMENT ---
        // In a real app, you would call signInWithEmailAndPassword(auth, email, password)
        
        if (email === 'admin@hub.com' && password === 'password') {
             // In a real app, this would be an actual sign-in call.
             // Here, we just redirect to the Analysis Hub after a brief simulated delay.
            setTimeout(() => {
                setIsLoggedIn(true);
                setIsLoading(false);
                navigate('/analysis');
            }, 1500);

        } else if (email === 'auto' && password === 'login') {
            // This case simulates a successful environment auto-login (which happens regardless)
            setTimeout(() => {
                setIsLoggedIn(true);
                setIsLoading(false);
                navigate('/analysis');
            }, 1000);
        } else {
            setTimeout(() => {
                setError('Invalid credentials. (Note: Actual sign-in is managed by the environment)');
                setIsLoading(false);
            }, 1500);
        }
    };

    if (isLoggedIn) {
        return (
            <div className="analysis-page">
                <div className="welcome-section">
                    <h1 className="text-success-color">You are already logged in!</h1>
                    <p>Redirecting you to the Analysis Hub...</p>
                    <button className="cta-button" onClick={() => navigate('/analysis')}>
                        Go to Analysis Hub
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="analysis-page">
            <div className="selection-mode">
                <LogInIcon className="w-12 h-12 text-primary-color mb-4" />
                <h1 style={{ color: 'var(--primary-color)' }}>Project Login</h1>
                <p className="text-sm text-gray-500 mb-6">
                    Enter your credentials to access the Specialist AI Hub.
                </p>

                {error && (
                    <div className="error-message">{error}</div>
                )}
                
                <form onSubmit={handleLogin} className="w-full max-w-xs">
                    <div className="mb-4">
                        <label className="sr-only" htmlFor="email">Email</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-color" />
                            <input
                                id="email"
                                type="email"
                                placeholder="Email (Try: admin@hub.com)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-card"
                                style={{ paddingLeft: '2.5rem' }}
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="sr-only" htmlFor="password">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-color" />
                            <input
                                id="password"
                                type="password"
                                placeholder="Password (Try: password)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-card"
                                style={{ paddingLeft: '2.5rem' }}
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="mode-button w-full flex items-center justify-center" 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader className="w-5 h-5 mr-2 animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            <>
                                <LogInIcon className="w-5 h-5 mr-2" />
                                Login
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;