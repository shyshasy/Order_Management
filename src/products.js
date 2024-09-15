const connPool = require('./db');

// Ajouter un produit
async function addProduct(name, description, price, stock, category, barcode, status) {
  const connection = await connPool.getConnection();
  try {
    const [result] = await connection.execute(
      "INSERT INTO products (name, description, price, stock, category, barcode, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, description, price, stock, category, barcode, status]
    );
    console.log("Produit ajouté avec succès !");
    return result.insertId;
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Récupérer tous les produits
async function getProducts() {
  const connection = await connPool.getConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM products");
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Mettre à jour un produit
async function updateProduct(id, name, description, price, stock, category, barcode, status) {
  const connection = await connPool.getConnection();
  try {
    const [result] = await connection.execute(
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, barcode = ?, status = ? WHERE id = ?",
      [name, description, price, stock, category, barcode, status, id]
    );
    console.log("Produit mis à jour avec succès !");
    return result.affectedRows;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Supprimer un produit
const db = require('./db'); // Assurez-vous que le chemin est correct

async function deleteProduct(productId) {
  let connection;
  try {
    connection = await db.getConnection();
    
    // Supprimer les détails de commande associés
    const [result1] = await connection.query('DELETE FROM order_details WHERE product_id = ?', [productId]);
    console.log(`Deleted ${result1.affectedRows} rows from order_details.`);

    // Supprimer le produit
    const [result2] = await connection.query('DELETE FROM products WHERE id = ?', [productId]);
    console.log(`Deleted ${result2.affectedRows} rows from products.`);
    
    if (result2.affectedRows === 0) {
      console.log(`No product found with ID ${productId}.`);
    } else {
      console.log(`Product with ID ${productId} supprimer avec succès.`);
    }
  } catch (err) {
    console.error('Error deleting product:', err);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  deleteProduct
};


module.exports = {
  deleteProduct
};

module.exports = { addProduct, getProducts, updateProduct, deleteProduct };
