const pool = require('./db');

// Récupérer tous les clients
async function getCustomers() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM customers");
    return rows;
  } catch (error) {
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
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { getCustomers, addCustomer, updateCustomer, deleteCustomer };
