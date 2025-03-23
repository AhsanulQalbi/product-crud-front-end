import { useMutation, gql } from "@apollo/client";
import ProductForm from "./ProductForm";
import styles from "./StyleForm.module.css";
import { useNavigate, Link } from "react-router-dom";

const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($name: String!, $price: Int!, $stock: Int!) {
    createProduct(name: $name, price: $price, stock: $stock) {
      name
      price
      stock
    }
  }
`;

function Product() {
    const navigate = useNavigate();
    const [createProduct, { error }] = useMutation(CREATE_PRODUCT_MUTATION);
    const handleCreateProduct = async (productData) => {
        try {
        const { data } = await createProduct({
            variables: productData,
        });

        console.log("Product created:", data.createProduct);
        alert("Product successfully created!");
        } catch (err) {
        console.error("Product creation failed:", err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
        <h1>Product Management</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        <Link to="/users">
            <button className={styles.navButton}>Manage Users</button>
        </Link>

        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        <ProductForm onSubmit={handleCreateProduct} />
        </div>
    );
}

export default Product;
