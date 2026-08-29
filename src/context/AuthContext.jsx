import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

const AuthContext = createContext(null);

const API_URL =
    import.meta.env.VITE_API_URL ||
    'http://localhost:5008/api';

export function AuthProvider({ children }) {
    // --------------------------------------------------
    // User
    // --------------------------------------------------
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('authUser');

            return savedUser
                ? JSON.parse(savedUser)
                : null;
        } catch (error) {
            console.error(
                'Failed to restore user:',
                error
            );

            localStorage.removeItem('authUser');

            return null;
        }
    });

    // --------------------------------------------------
    // JWT Token
    // --------------------------------------------------
    const [token, setToken] = useState(
        () => localStorage.getItem('authToken') || null
    );

    // --------------------------------------------------
    // Loading
    // --------------------------------------------------
    const [loading, setLoading] = useState(true);

    // --------------------------------------------------
    // Restore authentication on app startup
    // --------------------------------------------------
    useEffect(() => {
        const restoreAuth = () => {
            const savedToken =
                localStorage.getItem('authToken');

            const savedUser =
                localStorage.getItem('authUser');

            // No saved authentication
            if (!savedToken) {
                setToken(null);
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                // Decode JWT payload
                const payload = JSON.parse(
                    atob(savedToken.split('.')[1])
                );

                // Check token expiration
                if (
                    payload.exp &&
                    payload.exp * 1000 <= Date.now()
                ) {
                    console.log('JWT token expired');

                    localStorage.removeItem('authToken');
                    localStorage.removeItem('authUser');

                    setToken(null);
                    setUser(null);

                    return;
                }

                // Restore token
                setToken(savedToken);

                // Restore saved user
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                } else {
                    // Fallback: create user from JWT
                    const restoredUser = {
                        id: payload.id,
                        email: payload.email,
                        name:
                            payload.name ||
                            payload.email?.split('@')[0],
                        role: payload.role || 'user',
                    };

                    setUser(restoredUser);

                    localStorage.setItem(
                        'authUser',
                        JSON.stringify(restoredUser)
                    );
                }
            } catch (error) {
                console.error(
                    'Invalid authentication token:',
                    error
                );

                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');

                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restoreAuth();
    }, []);

    // --------------------------------------------------
    // LOGIN
    // --------------------------------------------------
    // LoginPage sends:
    //
    // login(token, user)
    //
    // Backend returns:
    //
    // {
    //   message: "Login successful",
    //   token: "...",
    //   user: {...}
    // }
    // --------------------------------------------------
    const login = (newToken, newUser) => {
        if (!newToken || !newUser) {
            throw new Error(
                'Invalid login response'
            );
        }

        console.log(
            'User logged in:',
            newUser
        );

        // Update React state
        setToken(newToken);
        setUser(newUser);

        // Persist authentication
        localStorage.setItem(
            'authToken',
            newToken
        );

        localStorage.setItem(
            'authUser',
            JSON.stringify(newUser)
        );
    };

    // --------------------------------------------------
    // REGISTER
    // --------------------------------------------------
    const register = async (
        name,
        email,
        password,
        phone
    ) => {
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim().toLowerCase(),
                        password,
                        phone: phone?.trim() || null,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    'Registration failed'
                );
            }

            console.log(
                'Registration successful:',
                data
            );

            return data;
        } catch (error) {
            console.error(
                'Registration error:',
                error
            );

            throw error;
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------------------------
    // LOGOUT
    // --------------------------------------------------
    const logout = () => {
        console.log('User logged out');

        // Clear browser storage
        localStorage.removeItem(
            'authToken'
        );

        localStorage.removeItem(
            'authUser'
        );

        // Clear React state
        setToken(null);
        setUser(null);
    };

    // --------------------------------------------------
    // UPDATE USER
    // --------------------------------------------------
    const updateUser = (updatedUser) => {
        if (!updatedUser) return;

        setUser(updatedUser);

        localStorage.setItem(
            'authUser',
            JSON.stringify(updatedUser)
        );
    };

    // --------------------------------------------------
    // Admin
    // --------------------------------------------------
    const isAdmin =
        user?.role === 'admin';

    // --------------------------------------------------
    // Authentication
    // --------------------------------------------------
    const isAuthenticated =
        !!user && !!token;

    // --------------------------------------------------
    // Context
    // --------------------------------------------------
    return (
        <AuthContext.Provider
            value={{
                user,
                token,

                login,
                logout,
                register,
                updateUser,

                isAdmin,
                isAuthenticated,

                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// --------------------------------------------------
// useAuth Hook
// --------------------------------------------------
export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth must be used inside AuthProvider'
        );
    }

    return context;
}
