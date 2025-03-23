import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./StyleForm.module.css";


const GET_USERS = gql`
  query GetUsers {
    users {
      user_id
      name
      email
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String!, $email: String!) {
    updateUser(user_id: $id, name: $name, email: $email) {
      user_id
      name
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(user_id: $id) {
      user_id
    }
  }
`;

export default function Users() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading users.</p>;

  const handleEdit = (user) => {
    setEditingUser(user.user_id);
    setName(user.name);
    setEmail(user.email);
  };

  const handleUpdate = async () => {
    await updateUser({ variables: { id: editingUser, name, email } });
    setEditingUser(null);
    refetch();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser({ variables: { id } });
      refetch();
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <Link to="/products">
        <button className={styles.navButton}>Manage Product</button>
      </Link>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user) => (
            <tr key={user.user_id}>
              <td>
                {editingUser === user.user_id ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingUser === user.user_id ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUser === user.user_id ? (
                  <>
                    <button onClick={handleUpdate} className={styles.saveButton}>
                      Save
                    </button>
                    <button onClick={() => setEditingUser(null)} className={styles.cancelButton}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user)} className={styles.editButton}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user.user_id)} className={styles.deleteButton}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
