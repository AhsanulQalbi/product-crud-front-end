import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            navigate("/product");
        } else {
            navigate("/login");
        }
    }, [token, navigate]);

    return <h1>Redirecting...</h1>;
}