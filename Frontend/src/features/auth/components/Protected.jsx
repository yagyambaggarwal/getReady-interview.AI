import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {
    const { loading, user } = useAuth();

    console.log("Protected user:", user);

    if (loading) {
        return (
            <main>
                <h1>Page is being loaded...</h1>
            </main>
        );
    }


    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default Protected;