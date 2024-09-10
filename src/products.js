const connPool = require('./db');

// Ajouter un produit
async function addProduct(productName, description, price, stock, category, barcode, status) {
  const connection = await connPool.getConnection();
  try {
    const [result] = await connection.execute(
      "INSERT INTO products (product_name, description, price, stock, category, barcode, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [productName, description, price, stock, category, barcode, status]
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
async function updateProduct(id, productName, description, price, stock, category, barcode, status) {
  const connection = await connPool.getConnection();
  try {
    const [result] = await connection.execute(
      "UPDATE products SET product_name = ?, description = ?, price = ?, stock = ?, category = ?, barcode = ?, status = ? WHERE id = ?",
      [productName, description, price, stock, category, barcode, status, id]
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
async function deleteProduct(id) {
  const connection = await connPool.getConnection();
  try {
    const [result] = await connection.execute(
      "DELETE FROM products WHERE id = ?",
      [id]
    );
    console.log("Produit supprimé avec succès !");
    return result.affectedRows;
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { addProduct, getProducts, updateProduct, deleteProduct };
