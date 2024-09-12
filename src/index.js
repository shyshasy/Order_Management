const readlineSync = require('readline-sync');
const customerManager = require('./customers');
const productManager = require('./products');
const orderManager = require('./purchaseOrders');
const paymentManager = require('./payments');

async function mainMenu() {
  console.log("1. Gestion des clients");
  console.log("2. Gestion des produits");
  console.log("3. Gestion des commandes");
  console.log("4. Gestion des paiements");
  console.log("0. Quitter");
  const choix = readlineSync.question("Votre choix: ");
  return choix;
}

async function customerMenu() {
  console.log("1. Ajouter un client");
  console.log("2. Lister tous les clients");
  console.log("3. Mettre à jour un client");
  console.log("4. Supprimer un client");
  console.log("0. Retour au menu principal");
  const choix = readlineSync.question("Votre choix: ");
  return choix;
}

async function handleCustomerMenu() {
  let choix;
  do {
    choix = await customerMenu();
    switch (choix) {
      case '1':
        const name = readlineSync.question("Nom du client: ");
        const email = readlineSync.question("Email du client: ");
        const phone = readlineSync.question("Téléphone du client: ");
        const address = readlineSync.question("Adresse du client: ");
        await customerManager.addCustomer(name, email, phone, address);
        console.log("Client ajouté avec succès !");
        break;

      case '2':
        const customers = await customerManager.getCustomers();
        console.log("Liste des clients:", customers);
        break;

      case '3':
        const customerIdToUpdate = readlineSync.questionInt("ID du client à mettre à jour: ");
        const newName = readlineSync.question("Nouveau nom du client: ");
        const newEmail = readlineSync.question("Nouvel email du client: ");
        const newPhone = readlineSync.question("Nouveau téléphone du client: ");
        const newAddress = readlineSync.question("Nouvelle adresse du client: ");
        await customerManager.updateCustomer(customerIdToUpdate, newName, newEmail, newPhone, newAddress);
        console.log("Client mis à jour avec succès !");
        break;

      case '4':
        const customerIdToDelete = readlineSync.questionInt("ID du client à supprimer: ");
        await customerManager.deleteCustomer(customerIdToDelete);
        console.log("Client supprimé avec succès !");
        break;

      case '0':
        console.log("Retour au menu principal");
        break;

      default:
        console.log("Choix invalide, veuillez réessayer.");
    }
  } while (choix !== '0');
}

async function productMenu() {
  console.log("1. Ajouter un produit");
  console.log("2. Lister tous les produits");
  console.log("3. Mettre à jour un produit");
  console.log("4. Supprimer un produit");
  console.log("0. Retour au menu principal");
  const choix = readlineSync.question("Votre choix: ");
  return choix;
}

async function handleProductMenu() {
  let choix;
  do {
    choix = await productMenu();
    switch (choix) {
      case '1':
        const productName = readlineSync.question("Nom du produit: ");
        const description = readlineSync.question("Description du produit: ");
        const price = readlineSync.questionFloat("Prix du produit: ");
        const stock = readlineSync.questionInt("Quantité en stock: ");
        const category = readlineSync.question("Catégorie du produit: ");
        const barcode = readlineSync.question("Code-barres du produit: ");
        const status = readlineSync.question("Statut (available/unavailable): ");
        await productManager.addProduct(productName, description, price, stock, category, barcode, status);
        console.log("Produit ajouté avec succès !");
        break;

      case '2':
        const products = await productManager.getProducts();
        console.log("Liste des produits:", products);
        break;

      case '3':
        const productIdToUpdate = readlineSync.questionInt("ID du produit à mettre à jour: ");
        const newProductName = readlineSync.question("Nouveau nom du produit: ");
        const newDescription = readlineSync.question("Nouvelle description du produit: ");
        const newPrice = readlineSync.questionFloat("Nouveau prix du produit: ");
        const newStock = readlineSync.questionInt("Nouvelle quantité en stock: ");
        const newCategory = readlineSync.question("Nouvelle catégorie du produit: ");
        const newBarcode = readlineSync.question("Nouveau code-barres du produit: ");
        const newStatus = readlineSync.question("Nouveau statut (available/unavailable): ");
        await productManager.updateProduct(productIdToUpdate, newProductName, newDescription, newPrice, newStock, newCategory, newBarcode, newStatus);
        console.log("Produit mis à jour avec succès !");
        break;

      case '4':
        const productIdToDelete = readlineSync.questionInt("ID du produit à supprimer: ");
        await productManager.deleteProduct(productIdToDelete);
        console.log("Produit supprimé avec succès !");
        break;

      case '0':
        console.log("Retour au menu principal");
        break;

      default:
        console.log("Choix invalide, veuillez réessayer.");
    }
  } while (choix !== '0');
}

async function orderMenu() {
  const choices = [
    'Ajouter une nouvelle commande avec ses détails',
    'Mettre à jour les informations d\'une commande et ses détails',
    'Supprimer une commande avec ses détails',
    'Lister une commande avec ses détails',
    'Retour'
  ];

  const index = readlineSync.keyInSelect(choices, 'Choisissez une option:');
  return index;
}

async function orderDetailMenu() {
  console.log("1. Ajouter un détail de commande");
  console.log("2. Mettre à jour un détail de commande");
  console.log("3. Supprimer un détail de commande");
  console.log("4. Afficher les détails de la commande");
  console.log("0. Retour au menu des commandes");
  const choix = readlineSync.question("Votre choix: ");
  return choix;
}

async function handleOrderMenu() {
  let choix;

  do {
    choix = await orderMenu();

    switch (choix) {
      case 0: // Ajouter une nouvelle commande avec ses détails
        await addOrder();
        break;

      case 1: // Mettre à jour les informations d'une commande et ses détails
        await updateOrder();
        break;

      case 2: // Supprimer une commande avec ses détails
        await deleteOrder();
        break;

      case 3: // Lister une commande avec ses détails
        await listOrder();
        break;

      case 4: // Retour
        console.log('Retour au menu principal.');
        break;

      default:
        console.log('Option invalide. Veuillez choisir une option valide.');
        break;
    }
  } while (choix !== 4); // 4 correspond à "Retour"
}

async function addOrder() {
  // Demander les informations de la commande
  const orderDate = readlineSync.question('Date de la commande (YYYY-MM-DD): ');
  const deliveryAddress = readlineSync.question('Adresse de livraison: ');
  const customerId = readlineSync.questionInt('ID du client: ');
  const trackNumber = readlineSync.question('Numéro de suivi: ');
  const status = readlineSync.question('Statut de la commande (pending/shipped/completed): ');

  // Validation du statut
  if (!['pending', 'shipped', 'completed'].includes(status)) {
    console.error('Erreur: Statut de la commande invalide. Utilisez "pending", "shipped", ou "completed".');
    return;
  }

  // Gestion des détails de la commande
  let orderDetails = [];
  let detailChoice;

  do {
    detailChoice = readlineSync.keyInSelect(
      ['Ajouter un produit', 'Sauvegarder', 'Annuler l\'ajout'],
      'Choisissez une option:'
    );

    switch (detailChoice) {
      case 0: // Ajouter un produit
        const productId = readlineSync.questionInt('ID du produit: ');
        const quantity = readlineSync.questionInt('Quantité du produit: ');
        const price = readlineSync.questionFloat('Prix du produit: ');

        // Validation des détails du produit
        if (isNaN(productId) || isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
          console.error('Erreur: Assurez-vous que les valeurs du produit sont correctes.');
          break;
        }

        // Ajouter le produit aux détails de la commande
        orderDetails.push({ productId, quantity, price });
        break;

      case 1: // Sauvegarder
        try {
          // Ajouter la commande avec ses détails
          await orderManager.addOrderWithDetails(
            customerId, // ID du client
            orderDate, 
            deliveryAddress,
            trackNumber,
            status,
            orderDetails
          );
          console.log('Commande et détails créés avec succès.');
        } catch (error) {
          console.error('Erreur lors de l\'ajout de la commande avec ses détails:', error.message);
        }
        break;

      case 2: // Annuler l'ajout
        console.log('Annulation de l\'ajout.');
        break;
    }
  } while (detailChoice !== 1 && detailChoice !== 2);
}

async function updateOrder() {
  // Mettre à jour une commande
  const orderId = readlineSync.questionInt('ID de la commande à mettre à jour: ');

  // Obtenez les nouvelles informations
  const newOrderDate = readlineSync.question('Nouvelle date de la commande (YYYY-MM-DD): ');
  const newDeliveryAddress = readlineSync.question('Nouvelle adresse de livraison: ');
  const newTrackNumber = readlineSync.question('Nouveau numéro de suivi: ');
  const newStatus = readlineSync.question('Nouveau statut de la commande (pending/shipped/completed): ');

  // Validation du statut
  if (!['pending', 'shipped', 'completed'].includes(newStatus)) {
    console.error('Erreur: Statut de la commande invalide. Utilisez "pending", "shipped", ou "completed".');
    return;
  }

  try {
    await orderManager.updateOrder(orderId, newOrderDate, newDeliveryAddress, newTrackNumber, newStatus);
    console.log('Commande mise à jour avec succès.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error.message);
  }
}

async function deleteOrder() {
  // Supprimer une commande
  const orderId = readlineSync.questionInt('ID de la commande à supprimer: ');

  try {
    await orderManager.deleteOrder(orderId);
    console.log('Commande supprimée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error.message);
  }
}

async function listOrder() {
  // Lister les commandes
  const orderId = readlineSync.questionInt('ID de la commande à afficher: ');

  try {
    const order = await orderManager.getOrderWithDetails(orderId);
    console.log('Commande:', order);
  } catch (error) {
    console.error('Erreur lors de l\'affichage de la commande:', error.message);
  }
}

async function paymentMenu() {
  console.log("1. Ajouter un paiement");
  console.log("2. Lister tous les paiements");
  console.log("3. Mettre à jour un paiement");
  console.log("4. Supprimer un paiement");
  console.log("0. Retour au menu principal");
  const choix = readlineSync.question("Votre choix: ");
  return choix;
}

async function handlePaymentMenu() {
  let choix;
  do {
    choix = await paymentMenu();
    switch (choix) {
      case '1':
        const paymentOrderId = readlineSync.questionInt("ID de la commande associée au paiement: ");
        const paymentAmount = readlineSync.questionFloat("Montant du paiement: ");
        const paymentDate = readlineSync.question("Date du paiement (YYYY-MM-DD): ");
        await paymentManager.addPayment(paymentOrderId, paymentAmount, paymentDate);
        console.log("Paiement ajouté avec succès !");
        break;

      case '2':
        const payments = await paymentManager.getPayments();
        console.log("Liste des paiements:", payments);
        break;

      case '3':
        const paymentIdToUpdate = readlineSync.questionInt("ID du paiement à mettre à jour: ");
        const newPaymentAmount = readlineSync.questionFloat("Nouveau montant du paiement: ");
        const newPaymentDate = readlineSync.question("Nouvelle date du paiement (YYYY-MM-DD): ");
        await paymentManager.updatePayment(paymentIdToUpdate, newPaymentAmount, newPaymentDate);
        console.log("Paiement mis à jour avec succès !");
        break;

      case '4':
        const paymentIdToDelete = readlineSync.questionInt("ID du paiement à supprimer: ");
        await paymentManager.deletePayment(paymentIdToDelete);
        console.log("Paiement supprimé avec succès !");
        break;

      case '0':
        console.log("Retour au menu principal");
        break;

      default:
        console.log("Choix invalide, veuillez réessayer.");
    }
  } while (choix !== '0');
}

async function main() {
  let choix;
  do {
    choix = await mainMenu();
    switch (choix) {
      case '1':
        await handleCustomerMenu();
        break;

      case '2':
        await handleProductMenu();
        break;

      case '3':
        await handleOrderMenu();
        break;

      case '4':
        await handlePaymentMenu();
        break;

      case '0':
        console.log('Au revoir !');
        break;

      default:
        console.log('Choix invalide, veuillez réessayer.');
    }
  } while (choix !== '0');
}

main();
