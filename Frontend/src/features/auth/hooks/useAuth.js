import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context


    // const handleLogin = async ({email, password}) => {
    //     setLoading(true)
    //     try {
    //         const data = await login({email, password})
    //         setUser(data.user);
    //         return data.user;
    //     } catch (error) {

    //     } finally{
    //         setLoading(false)
    //     }

    // }

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });

            console.log("API response:", data); // 🔥 ADD THIS

            setUser(data.user);
            return data.user;

        } catch (error) {
            console.error("Login error:", error); // 🔥 ADD THIS
            return null;
        } finally {
            setLoading(false);
        }
    };



    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }



    const handleLogout = async () => {
        setLoading(true);
        try {
            const data = await logout();
            setUser(null);
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                console.log("Fetching user...");
                const data = await getMe();
                console.log("getMe response:", data);  // ✅ Log the actual response
                setUser(data.data);
            } catch (error) {
                console.log("Failed to fetch user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        getAndSetUser()
    }, [])





    return { user, loading, handleLogin, handleLogout, handleRegister };


}