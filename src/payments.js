const mysql = require('mysql2/promise');
const pool = require('./db');

// Function to get all payments
async function getPayments() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM payments");
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Function to add a payment
const addPayment = async (orderId, date, amount, paymentMethod) => {
  // Debugging: Log the values
  console.log('Order ID:', orderId);
  console.log('Date provided:', date);
  console.log('Amount provided:', amount);
  console.log('Payment Method:', paymentMethod);

  // Ensure date is a string and correctly formatted
  const formattedDate = new Date(date).toISOString().split('T')[0];
  console.log('Formatted date:', formattedDate);

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
    throw new Error('Invalid date format. Use YYYY-MM-DD.');
  }

  // Ensure amount is a number
  const formattedAmount = parseFloat(amount);
  if (isNaN(formattedAmount)) {
    throw new Error('Invalid amount value. Must be a number.');
  }

  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'INSERT INTO payments (order_id, date, amount, payment_method) VALUES (?, ?, ?, ?)',
      [orderId, formattedDate, formattedAmount, paymentMethod]
    );
    console.log('Payment added successfully.');
  } catch (error) {
    console.error('Error adding payment:', error.message);
  } finally {
    connection.release();
  }
};

// Function to update a payment
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

// Function to delete a payment
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
