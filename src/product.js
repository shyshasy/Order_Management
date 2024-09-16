const connPool = require('./db');

// Ajouter ou mettre à jour un produit
async function addOrUpdateProduct(name, description, price, stock, category, barcode, status) {
  const connection = await connPool.getConnection();

  try {
    await connection.execute(
      `INSERT INTO products (name, description, price, stock, category, barcode, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         description = VALUES(description),
         price = VALUES(price),
         stock = VALUES(stock),
         category = VALUES(category),
         status = VALUES(status)`,
      [name, description, price, stock, category, barcode, status]
    );
    console.log("Produit ajouté ou mis à jour avec succès!");
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error(`Erreur de duplication : ${error.sqlMessage}`);
    } else {
      console.error(`Erreur lors de l'ajout ou de la mise à jour du produit : ${error.message}`);
    }
    throw error;
  } finally {
    connection.release();
  }
}

// Supprimer un produit par son code-barres
async function deleteProduct(barcode) {
  const connection = await connPool.getConnection();
  
  try {
    const [result] = await connection.execute(
      'DELETE FROM products WHERE barcode = ?',
      [barcode]
    );

    if (result.affectedRows === 0) {
      console.log(`Aucun produit trouvé avec le code-barres ${barcode}.`);
    } else {
      console.log(`Produit avec le code-barres ${barcode} supprimé avec succès.`);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du produit :", error.message);
    throw error;
  } finally {
    // Libérer la connexion
    connection.release();
  }
}

// Récupérer un produit par son code-barres
async function getProductByBarcode(barcode) {
  const connection = await connPool.getConnection();
  
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM products WHERE barcode = ?',
      [barcode]
    );

    if (rows.length > 0) {
      return rows[0];
    } else {
      console.log(`Aucun produit trouvé avec le code-barres ${barcode}.`);
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du produit :", error.message);
    throw error;
  } finally {
    // Libérer la connexion
    connection.release();
  }
}

module.exports = {
  addOrUpdateProduct,
  deleteProduct,
  getProductByBarcode
};
