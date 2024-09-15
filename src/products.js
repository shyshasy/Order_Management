const connPool = require('./db');

// Ajouter un produit
async function addProduct(name, description, price, stock, category, barcode, status) {
  const connection = await connPool.getConnection();
  try {
    // Vérifiez si le code-barres existe déjà
    const [existingProduct] = await connection.execute(
      "SELECT id FROM products WHERE barcode = ?",
      [barcode]
    );

    if (existingProduct.length > 0) {
      throw new Error(`Un produit avec le code-barres ${barcode} existe déjà.`);
    }

    // Ajouter le produit si le code-barres est unique
    const [result] = await connection.execute(
      "INSERT INTO products (name, description, price, stock, category, barcode, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, description, price, stock, category, barcode, status]
    );
    console.log("Produit ajouté avec succès !");
    return result.insertId;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error(`Erreur: Un produit avec le code-barres ${barcode} existe déjà.`);
    } else {
      console.error("Erreur lors de l'ajout du produit:", error.message);
    }
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
    // Vérifiez si le code-barres est unique avant la mise à jour
    const [existingProduct] = await connection.execute(
      "SELECT id FROM products WHERE barcode = ? AND id != ?",
      [barcode, id]
    );

    if (existingProduct.length > 0) {
      throw new Error(`Un autre produit avec le code-barres ${barcode} existe déjà.`);
    }

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
async function deleteProduct(productId) {
  const connection = await connPool.getConnection();
  try {
    // Supprimer les détails de commande associés
    const [result1] = await connection.execute('DELETE FROM order_details WHERE product_id = ?', [productId]);
    console.log(`Deleted ${result1.affectedRows} rows from order_details.`);

    // Supprimer le produit
    const [result2] = await connection.execute('DELETE FROM products WHERE id = ?', [productId]);
    console.log(`Deleted ${result2.affectedRows} rows from products.`);
    
    if (result2.affectedRows === 0) {
      console.log(`Aucun produit trouvé avec l'ID ${productId}.`);
    } else {
      console.log(`Produit avec l'ID ${productId} supprimé avec succès.`);
    }
  } catch (err) {
    console.error('Erreur lors de la suppression du produit:', err.message);
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct
};
