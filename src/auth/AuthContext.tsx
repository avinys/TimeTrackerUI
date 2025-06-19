import { createContext, useContext, useState, useEffect } from 'react';
import type { UserDto, AuthContextType } from '../types/auth.types'
import { AuthService } from '../services/AuthService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AuthService.getMe()
        .then(setUser)
        .catch(() => setUser(null))
        .finally(() => setLoading(false))
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}