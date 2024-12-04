const connPool = require('./db');

// Ajouter ou mettre à jour un produit
async function addProduct(name, description, price, stock, category, barcode, status) {
  const connection = await connPool.getConnection();

  try {
    await connection.execute(
      `INSERT INTO products (name, description, price, stock, category, barcode, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, stock, category, barcode, status]
    );
    console.log("Produit ajouté avec succès!");
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error(`Erreur de duplication : ${error.sqlMessage}`);
    } else {
      console.error(`Erreur lors de l'ajout du produit : ${error.message}`);
    }
    throw error;
  } finally {
    connection.release();
  }
}

async function updateProduct(name, description, price, stock, category, barcode, status) {
  const connection = await connPool.getConnection();

  try {
    await connection.execute(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, stock = ?, category = ?, status = ? 
       WHERE barcode = ?`,
      [name, description, price, stock, category, status, barcode]
    );
    console.log("Produit mis à jour avec succès!");
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du produit : ${error.message}`);
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

async function getAllProducts() {
  const connection = await connPool.getConnection();

  try {
    const [rows] = await connection.execute(
      'SELECT * FROM products'
    );
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des produits :", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  addProduct,
  updateProduct,
  getAllProducts,
  deleteProduct,
  getProductByBarcode
};
