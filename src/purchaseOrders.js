const pool = require('./db');

// Fonction pour vérifier l'existence d'une commande
async function orderExists(orderId) {
  const connection = await pool.getConnection();
  try {
    const [order] = await connection.execute("SELECT id FROM purchase_orders WHERE id = ?", [orderId]);
    return order.length > 0;
  } finally {
    connection.release();
  }
}

// Fonction pour obtenir toutes les commandes
async function getOrders() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM purchase_orders");
    return rows;
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Fonction pour ajouter une commande
async function addOrder(customerId, orderDate, deliveryAddress, trackNumber, status) {
  const connection = await pool.getConnection();
  try {
    const [customer] = await connection.execute("SELECT id FROM customers WHERE id = ?", [customerId]);
    if (customer.length === 0) {
      throw new Error(`Customer with ID ${customerId} does not exist.`);
    }

    const [result] = await connection.execute(
      "INSERT INTO purchase_orders (customer_id, order_date, delivery_address, track_number, status) VALUES (?, ?, ?, ?, ?)",
      [customerId, orderDate, deliveryAddress, trackNumber, status]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error adding order:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Fonction pour ajouter un détail de commande
async function addOrderDetail(orderId, productId, quantity, price) {
  const connection = await pool.getConnection();
  try {
    // Vérifier que l'orderId et le productId existent
    const [order] = await connection.execute("SELECT id FROM purchase_orders WHERE id = ?", [orderId]);
    if (order.length === 0) {
      throw new Error(`La commande avec l'ID ${orderId} n'existe pas.`);
    }

    const [product] = await connection.execute("SELECT id FROM products WHERE id = ?", [productId]);
    if (product.length === 0) {
      throw new Error(`Le produit avec l'ID ${productId} n'existe pas.`);
    }

    // Vérifier que le prix n'est pas null ou undefined
    if (price === null || price === undefined || isNaN(price) || price <= 0) {
      throw new Error("Le prix doit être un nombre positif non nul.");
    }

    // Exécuter la requête d'insertion
    const [result] = await connection.execute(
      "INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
      [orderId, productId, quantity, price]
    );
    return result.insertId;
  } catch (error) {
    console.error("Erreur lors de l'ajout du détail de commande :", error.message);
    throw error;
  } finally {
    connection.release();
  }
}


// Fonction pour obtenir les détails d'une commande spécifique
// Fonction pour obtenir les détails d'une commande spécifique
async function getOrderDetails(orderId) {
  const connection = await pool.getConnection(); // Obtenez une connexion à partir du pool
  try {
    const [rows] = await connection.execute(
      `SELECT od.*, p.product_name AS product_name, p.description AS product_description
       FROM order_details od
       JOIN products p ON od.product_id = p.id
       WHERE od.order_id = ?`,
      [orderId]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching order details:", error.message);
    throw error;
  } finally {
    connection.release(); // Assurez-vous de libérer la connexion
  }
}


// Fonction pour mettre à jour un détail de commande
async function updateOrderDetail(orderId, productId, quantity, price) {
  const connection = await pool.getConnection();
  try {
    const [order] = await connection.execute("SELECT id FROM purchase_orders WHERE id = ?", [orderId]);
    if (order.length === 0) {
      throw new Error(`Order with ID ${orderId} does not exist.`);
    }

    const [product] = await connection.execute("SELECT id FROM products WHERE id = ?", [productId]);
    if (product.length === 0) {
      throw new Error(`Product with ID ${productId} does not exist.`);
    }

    const [result] = await connection.execute(
      "UPDATE order_details SET quantity = ?, price = ? WHERE order_id = ? AND product_id = ?",
      [quantity, price, orderId, productId]
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Error updating order detail:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Fonction pour supprimer un détail de commande
// Fonction pour supprimer un détail de commande
async function deleteOrderDetail(orderId, productId) {
  const connection = await pool.getConnection();
  try {
    // Vérifiez si orderId et productId sont définis et valides
    if (orderId === undefined || productId === undefined) {
      throw new Error("Order ID or Product ID is undefined.");
    }

    // Vérifiez que orderId et productId ne sont pas null
    if (orderId === null || productId === null) {
      throw new Error("Order ID or Product ID cannot be null.");
    }

    // Exécutez la requête de suppression
    const [result] = await connection.execute(
      "DELETE FROM order_details WHERE order_id = ? AND product_id = ?",
      [orderId, productId]
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Error deleting order detail:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}


// Fonction pour mettre à jour une commande
async function updateOrder(orderId, customerId, orderDate, deliveryAddress, trackNumber, status) {
  const connection = await pool.getConnection();
  try {
    const [customer] = await connection.execute("SELECT id FROM customers WHERE id = ?", [customerId]);
    if (customer.length === 0) {
      throw new Error(`Customer with ID ${customerId} does not exist.`);
    }

    const [result] = await connection.execute(
      "UPDATE purchase_orders SET customer_id = ?, order_date = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?",
      [customerId, orderDate, deliveryAddress, trackNumber, status, orderId]
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Error updating order:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Fonction pour supprimer une commande et ses détails
async function deleteOrder(orderId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Supprimer les détails de la commande s'ils existent
    const [details] = await connection.execute(
      "SELECT * FROM order_details WHERE order_id = ?",
      [orderId]
    );
    if (details.length > 0) {
      await connection.execute("DELETE FROM order_details WHERE order_id = ?", [orderId]);
    }

    // Supprimer la commande elle-même
    const [result] = await connection.execute("DELETE FROM purchase_orders WHERE id = ?", [orderId]);

    await connection.commit();
    return result.affectedRows;
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting order:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { 
  getOrders, 
  addOrder, 
  addOrderDetail, 
  getOrderDetails, 
  updateOrderDetail, 
  deleteOrderDetail, 
  updateOrder, 
  deleteOrder 
};
