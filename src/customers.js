const pool = require('./db');

// Récupérer tous les clients
async function getCustomers() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM customers");
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Ajouter un client
async function addCustomer(customerName, email, phone, address) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "INSERT INTO customers (customer_name, email, phone, address) VALUES (?, ?, ?, ?)",
      [customerName, email, phone, address]
    );
    return result.insertId;
  } catch (error) {
    console.error("Erreur lors de l'ajout du client:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Mettre à jour un client
async function updateCustomer(customerId, customerName, email, phone, address) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "UPDATE customers SET customer_name = ?, email = ?, phone = ?, address = ? WHERE id = ?",
      [customerName, email, phone, address, customerId]
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Supprimer un client
async function deleteCustomer(customerId) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "DELETE FROM customers WHERE id = ?",
      [customerId]
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Erreur lors de la suppression du client:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Récupérer un client par ID
async function getCustomerById(customerId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM customers WHERE id = ?", [customerId]);
    return rows[0]; // Retourne le premier client trouvé ou `undefined` s'il n'existe pas
  } catch (error) {
    console.error("Erreur lors de la récupération du client par ID:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById // Assurez-vous que cette fonction est exportée
};
