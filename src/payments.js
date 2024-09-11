const pool = require('./db');

// Fonction pour obtenir tous les paiements
async function getPayments() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM payments');
    connection.release();
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements:", error);
    throw error;
  }
}

// Fonction pour ajouter un paiement
const addPayment = async (orderId, date, amount, paymentMethod) => {
  try {
    // Debugging: Log les valeurs
    console.log('Order ID:', orderId);
    console.log('Date provided:', date);
    console.log('Amount provided:', amount);
    console.log('Payment Method:', paymentMethod);

    // Vérification du format de la date (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error('Le format de la date est invalide. Utilisez le format YYYY-MM-DD.');
    }

    // Validation de la date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('La date fournie est invalide.');
    }

    const formattedDate = parsedDate.toISOString().split('T')[0];
    console.log('Formatted date:', formattedDate);

    // Validation du montant
    const formattedAmount = parseFloat(amount);
    if (isNaN(formattedAmount)) {
      throw new Error('Le montant fourni est invalide. Il doit être un nombre.');
    }

    // Vérification si l'order_id existe dans la table purchase_orders
    const connection = await pool.getConnection();
    try {
      const [orderRows] = await connection.execute(
        'SELECT id FROM purchase_orders WHERE id = ?',
        [orderId]
      );

      if (orderRows.length === 0) {
        throw new Error(`La commande avec l'ID ${orderId} n'existe pas.`);
      }

      // Ajout du paiement si la commande existe
      await connection.execute(
        'INSERT INTO payments (order_id, date, amount, payment_method) VALUES (?, ?, ?, ?)',
        [orderId, formattedDate, formattedAmount, paymentMethod]
      );
    
    } catch (error) {
      console.error('Erreur lors de l\'ajout du paiement :', error.message);
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erreur dans addPayment :', error.message);
    throw error;
  }
};



// Fonction pour mettre à jour un paiement
async function updatePayment(paymentId, orderId, paymentDate, amount, paymentMethod) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "UPDATE payments SET order_id = ?, date = ?, amount = ?, payment_method = ? WHERE id = ?",
      [orderId, paymentDate, amount, paymentMethod, paymentId]
    );
    return result.affectedRows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Fonction pour supprimer un paiement
async function deletePayment(paymentId) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "DELETE FROM payments WHERE id = ?",
      [paymentId]
    );
    return result.affectedRows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { getPayments, addPayment, updatePayment, deletePayment };
