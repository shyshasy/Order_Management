const pool = require('./db');

// Vérifier l'existence d'une commande
async function orderExists(orderId) {
  const connection = await pool.getConnection();
  try {
    const [order] = await connection.execute("SELECT id FROM purchase_orders WHERE id = ?", [orderId]);
    return order.length > 0;
  } finally {
    connection.release();
  }
}

// Obtenir toutes les commandes
async function getOrders() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM purchase_orders");
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Ajouter une commande avec ses détails
async function addOrderWithDetails(customerId, orderDate, deliveryAddress, trackNumber, status, orderDetails) {
  const connection = await pool.getConnection();
  try {
    // Log des entrées pour déboguer
    console.log("Entrée de la fonction:");
    console.log("Customer ID:", customerId);
    console.log("Order Date:", orderDate);
    console.log("Delivery Address:", deliveryAddress);
    console.log("Track Number:", trackNumber);
    console.log("Status:", status);

    // Validation de l'ID client
    const parsedCustomerId = parseInt(customerId, 10);
    if (!Number.isInteger(parsedCustomerId) || parsedCustomerId <= 0) {
      throw new Error(`L'ID client ${customerId} n'est pas valide.`);
    }

    // Validation de la date de commande
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(orderDate)) {
      throw new Error(`La date de commande ${orderDate} n'est pas valide.`);
    }

    // Validation de l'adresse de livraison
    if (typeof deliveryAddress !== 'string' || deliveryAddress.trim().length === 0) {
      throw new Error("L'adresse de livraison ne peut pas être vide.");
    }

    // Validation du numéro de suivi
    if (typeof trackNumber !== 'string' || trackNumber.trim().length > 100) {
      throw new Error("Le numéro de suivi est invalide.");
    }

    // Validation du statut
    const validStatuses = ["pending", "shipped", "completed"];
    if (!validStatuses.includes(status)) {
      throw new Error("Le statut de la commande est invalide.");
    }

    // Vérification de l'existence du client
    const [customer] = await connection.execute("SELECT id FROM customers WHERE id = ?", [parsedCustomerId]);
    if (customer.length === 0) {
      throw new Error(`Le client avec l'ID ${parsedCustomerId} n'existe pas.`);
    }

    // Commence une transaction
    await connection.beginTransaction();

    // Ajouter la commande
    const [result] = await connection.execute(
      "INSERT INTO purchase_orders (customer_id, date, delivery_address, track_number, status) VALUES (?, ?, ?, ?, ?)",
      [parsedCustomerId, orderDate, deliveryAddress, trackNumber, status]
    );
    
    const orderId = result.insertId;
    console.log("ID de la commande insérée:", orderId);

    // Ajouter les détails de la commande
    for (const detail of orderDetails) {
      await connection.execute(
        "INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, detail.productId, detail.quantity, detail.price]
      );
    }

    // Commit de la transaction
    await connection.commit();
    console.log("Commande ajoutée avec succès.");
  } catch (error) {
    // Annule la transaction en cas d'erreur
    await connection.rollback();
    console.error("Erreur lors de l'ajout de la commande avec ses détails:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Mettre à jour une commande et ses détails
async function updateOrderWithDetails(orderId, customerId, orderDate, deliveryAddress, trackNumber, status, orderDetails) {
  const connection = await pool.getConnection();
  try {
    // Vérification si la commande existe avant la mise à jour
    const exists = await orderExists(orderId);
    if (!exists) {
      throw new Error(`La commande avec l'ID ${orderId} n'existe pas.`);
    }

    const [customer] = await connection.execute("SELECT id FROM customers WHERE id = ?", [customerId]);
    if (customer.length === 0) {
      throw new Error(`Le client avec l'ID ${customerId} n'existe pas.`);
    }

    await connection.beginTransaction();

    await connection.execute(
      "UPDATE purchase_orders SET customer_id = ?, date = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?",
      [customerId, orderDate, deliveryAddress, trackNumber, status, orderId]
    );

    await connection.execute("DELETE FROM order_details WHERE order_id = ?", [orderId]);

    for (const detail of orderDetails) {
      const { productId, quantity, price } = detail;
      const [product] = await connection.execute("SELECT id FROM products WHERE id = ?", [productId]);
      if (product.length === 0) {
        throw new Error(`Le produit avec l'ID ${productId} n'existe pas.`);
      }
      if (price === null || price === undefined || isNaN(price) || price <= 0) {
        throw new Error("Le prix doit être un nombre positif.");
      }

      await connection.execute(
        "INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, productId, quantity, price]
      );
    }

    await connection.commit();
    return orderId;
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la mise à jour de la commande avec ses détails:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Supprimer une commande avec ses détails
async function deleteOrderWithDetails(orderId) {
  const connection = await pool.getConnection();
  try {
    // Vérifier si la commande existe avant de la supprimer
    const exists = await orderExists(orderId);
    if (!exists) {
      throw new Error(`La commande avec l'ID ${orderId} n'existe pas.`);
    }

    await connection.beginTransaction();

    await connection.execute("DELETE FROM order_details WHERE order_id = ?", [orderId]);

    const [result] = await connection.execute("DELETE FROM purchase_orders WHERE id = ?", [orderId]);
    await connection.commit();

    // Vérifier si la suppression a réussi
    if (result.affectedRows === 0) {
      throw new Error(`La suppression de la commande avec l'ID ${orderId} a échoué.`);
    }

    return result.affectedRows;
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la suppression de la commande avec ses détails:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Lister une commande avec ses détails
async function getOrderWithDetails(orderId) {
  const connection = await pool.getConnection();
  try {
    // Récupérer la commande
    const [order] = await connection.execute("SELECT * FROM purchase_orders WHERE id = ?", [orderId]);
    if (order.length === 0) {
      throw new Error(`La commande avec l'ID ${orderId} n'existe pas.`);
    }

    // Récupérer les détails de la commande avec les informations sur les produits
    const [details] = await connection.execute(
      `SELECT od.*, p.name AS product_name, p.description AS product_description
       FROM order_details od
       JOIN products p ON od.product_id = p.id
       WHERE od.order_id = ?`,
      [orderId]
    );

    return { order: order[0], details };
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande avec ses détails:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}


module.exports = {
  getOrders,
  addOrderWithDetails,
  updateOrderWithDetails,
  deleteOrderWithDetails,
  getOrderWithDetails
};
