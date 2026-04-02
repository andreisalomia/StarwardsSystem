import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

type User = { id: number; name: string; email: string; role: string } | null;

const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios
                .get("/auth/me")
                .then((r) => {
                    setUser(r.data.user);
                    setLoading(false);
                })
                .catch((err) => {
                    if (err.response?.status === 401) {
                        setUser(null);
                        setToken(null);
                    }
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email: string, password: string) => {
        const res = await axios.post("/auth/login", { email, password });
        const t = res.data.token;
        localStorage.setItem("token", t);
        setToken(t);
        setUser(res.data.user);
        return res.data;
    };

    const register = async (payload: any) => {
        const res = await axios.post("/auth/register", payload);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common["Authorization"];
    };

    return <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>{children}</AuthContext.Provider>;
}
