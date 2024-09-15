// customers.js

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

// Vérifier si le numéro de téléphone existe déjà pour un autre client
async function isPhoneDuplicate(phone, customerId = null) {
  const connection = await pool.getConnection();
  try {
    const query = customerId 
      ? "SELECT id FROM customers WHERE phone = ? AND id != ?" 
      : "SELECT id FROM customers WHERE phone = ?";
    const params = customerId 
      ? [phone, customerId] 
      : [phone];
    
    const [rows] = await connection.execute(query, params);
    return rows.length > 0; // Retourne true si le numéro existe déjà pour un autre client
  } catch (error) {
    console.error("Erreur lors de la vérification du numéro de téléphone:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Vérifier si l'email est déjà utilisé par un autre client
async function isEmailDuplicate(email, customerId = null) {
  const connection = await pool.getConnection();
  try {
    const query = customerId 
      ? "SELECT id FROM customers WHERE email = ? AND id != ?" 
      : "SELECT id FROM customers WHERE email = ?";
    const params = customerId 
      ? [email, customerId] 
      : [email];
    
    const [rows] = await connection.execute(query, params);
    return rows.length > 0; // Retourne true si l'email existe déjà pour un autre client
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Ajouter un client
async function addCustomer(name, email, phone, address) {
  const connection = await pool.getConnection();
  try {
    // Vérifier si le numéro de téléphone est déjà utilisé
    const isPhoneDuplicateCheck = await isPhoneDuplicate(phone);
    if (isPhoneDuplicateCheck) {
      throw new Error('Ce numéro de téléphone existe déjà. Veuillez fournir un autre numéro.');
    }

    // Vérifier si l'email est déjà utilisé
    const isEmailDuplicateCheck = await isEmailDuplicate(email);
    if (isEmailDuplicateCheck) {
      throw new Error('Cet email est déjà associé à un autre client.');
    }

    const [result] = await connection.execute(
      "INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)",
      [name, email, phone, address]
    );
    return result.insertId;
  } catch (error) {
    console.error("Erreur lors de l'ajout du client:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Mettre à jour un client avec gestion des duplications de numéro de téléphone et email
async function updateCustomer(customerId, name, email, phone, address) {
  const connection = await pool.getConnection();
  try {
    // Vérifier si le numéro de téléphone est déjà utilisé par un autre client
    const isPhoneDuplicateCheck = await isPhoneDuplicate(phone, customerId);
    if (isPhoneDuplicateCheck) {
      throw new Error('Le numéro de téléphone est déjà associé à un autre client.');
    }

    // Vérifier si l'email est déjà utilisé par un autre client
    const isEmailDuplicateCheck = await isEmailDuplicate(email, customerId);
    if (isEmailDuplicateCheck) {
      throw new Error('Cet email est déjà associé à un autre client.');
    }

    const [result] = await connection.execute(
      "UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?",
      [name, email, phone, address, customerId]
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
  getCustomerById
};
