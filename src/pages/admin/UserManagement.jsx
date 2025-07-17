import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, deleteUserDocument } from '../../services/firestoreService';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react'; // Icon for the delete button

// A sub-component for the confirmation modal. It's defined here for simplicity.
const ConfirmationModal = ({ userEmail, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Confirmar Eliminación</h3>
      <p>
        ¿Estás seguro de que quieres eliminar al usuario <strong>{userEmail}</strong>? 
        Esta acción eliminará sus datos de la base de datos, pero su cuenta de inicio de sesión seguirá existiendo.
      </p>
      <div className="modal-actions">
        <button onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button onClick={onConfirm} className="btn btn-danger">Sí, Eliminar</button>
      </div>
    </div>
  </div>
);

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // State to manage the confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch all users from Firestore when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getAllUsers();
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handles changing a user's role
  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      // Update the local state to reflect the change immediately
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    } catch (error) {
      console.error("Error updating role: ", error);
    }
  };

  // Opens the confirmation modal when the delete button is clicked
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  // Called when the admin confirms the deletion in the modal
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      // Call the service to delete the user's document from Firestore
      await deleteUserDocument(userToDelete.id);
      // Update the local state to remove the user from the list
      setUsers(users.filter(user => user.id !== userToDelete.id));
    } catch (error) {
      console.error("Error deleting user document: ", error);
    } finally {
      // Close the modal and reset the state
      setIsModalOpen(false);
      setUserToDelete(null);
    }
  };

  // Closes the modal without taking action
  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  if (loading) {
    return <div className="loading-indicator">Cargando...</div>;
  }

  return (
    <>
      {/* The modal is only rendered when isModalOpen is true */}
      {isModalOpen && (
        <ConfirmationModal
          userEmail={userToDelete?.email}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      <div className="admin-panel-container">
        <div className='admin-panel-header'>
          <h1>Gestión de Usuarios</h1>
          <Link to="/dashboard" className="btn btn-secondary">Volver al Panel</Link>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Email de Usuario</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="actions-cell">
                    {/* Prevent admin from changing their own role or deleting themselves */}
                    {currentUser.uid !== user.id ? (
                      <>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="role-select"
                        >
                          <option value="user">Usuario</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button onClick={() => handleDeleteClick(user)} className="btn-icon btn-danger">
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <span>No disponible</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
