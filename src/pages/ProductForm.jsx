import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import styles from "./StyleForm.module.css";

const GET_PRODUCTS = gql`
  query {
    products {
      product_id
      name
      price
      stock
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($name: String!, $price: Int!, $stock: Int!) {
    createProduct(name: $name, price: $price, stock: $stock) {
      product_id
      name
      price
      stock
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $name: String!, $price: Int!, $stock: Int!) {
    updateProduct(product_id: $id, name: $name, price: $price, stock: $stock) {
      name
      price
      stock
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(product_id: $id) {
      name
    }
  }
`;

export default function ProductForm() {
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);
  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      refetch();
      resetForm();
    },
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => {
      refetch();
      resetForm();
    },
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateProduct({ variables: { id, name, price: parseInt(price), stock: parseInt(stock) } });
    } else {
      await createProduct({ variables: { name, price: parseInt(price), stock: parseInt(stock) } });
    }
  };

  const handleEdit = (product) => {
    setId(product.product_id);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct({ variables: { id: productId } });
    }
  };

  const resetForm = () => {
    setId(null);
    setName("");
    setPrice("");
    setStock("");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{id ? "Edit Product" : "Create Product"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required className={styles.input} />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required className={styles.input} />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required className={styles.input} />
        <button type="submit" className={styles.button}>{id ? "Update" : "Create"}</button>
        {id && <button type="button" onClick={resetForm} className={styles.cancelButton}>Cancel</button>}
      </form>

      <h2 className={styles.title}>Product List</h2>
      {loading && <p>Loading products...</p>}
      {error && <p>Error loading products: {error.message}</p>}

      <div className={styles.productList}>
        {data?.products?.map((product) => (
          <div key={product.product_id} className={styles.productItem}>
            <p><strong>{product.name}</strong> - Rp {product.price} (Stock: {product.stock})</p>
            <button onClick={() => handleEdit(product)} className={styles.editButton}>Edit</button>
            <button onClick={() => handleDelete(product.product_id)} className={styles.deleteButton}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
