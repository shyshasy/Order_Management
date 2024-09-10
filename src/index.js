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
  console.log("1. Ajouter une commande");
  console.log("2. Lister toutes les commandes");
  console.log("3. Mettre à jour une commande");
  console.log("4. Supprimer une commande");
  console.log("5. Gérer les détails de commande");
  console.log("0. Retour au menu principal");
  const choix = readlineSync.question("Votre choix: ");
  return choix;
}

async function orderDetailMenu(orderId) {
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
      case '1':
        const customerId = readlineSync.questionInt("ID du client: ");
        const orderDate = readlineSync.question("Date de la commande (YYYY-MM-DD): ");
        const deliveryAddress = readlineSync.question("Adresse de livraison: ");
        const trackNumber = readlineSync.question("Numéro de suivi: ");
        const status = readlineSync.question("Statut (pending/shipped/processing/delivered/cancelled): ");
        const orderId = await orderManager.addOrder(customerId, orderDate, deliveryAddress, trackNumber, status);
        console.log("Commande ajoutée avec succès, ID de la commande:", orderId);
        break;

      case '2':
        const orders = await orderManager.getOrders();
        console.log("Liste des commandes:", orders);
        break;

      case '3':
        const orderIdToUpdate = readlineSync.questionInt("ID de la commande à mettre à jour: ");
        const newCustomerId = readlineSync.questionInt("Nouvel ID du client: ");
        const newOrderDate = readlineSync.question("Nouvelle date de la commande (YYYY-MM-DD): ");
        const newDeliveryAddress = readlineSync.question("Nouvelle adresse de livraison: ");
        const newTrackNumber = readlineSync.question("Nouveau numéro de suivi: ");
        const newStatus = readlineSync.question("Nouveau statut (pending/shipped/processing/delivered/cancelled): ");
        await orderManager.updateOrder(orderIdToUpdate, newCustomerId, newOrderDate, newDeliveryAddress, newTrackNumber, newStatus);
        console.log("Commande mise à jour avec succès !");
        break;

      case '4':
        const orderIdToDelete = readlineSync.questionInt("ID de la commande à supprimer: ");
        await orderManager.deleteOrder(orderIdToDelete);
        console.log("Commande supprimée avec succès !");
        break;

      case '5':
        const orderIdForDetails = readlineSync.questionInt("ID de la commande pour gérer les détails: ");
        let detailChoice;
        do {
          detailChoice = await orderDetailMenu(orderIdForDetails);
          switch (detailChoice) {
            case '1':
              const productId = readlineSync.questionInt("ID du produit: ");
              const quantity = readlineSync.questionInt("Quantité: ");
              await orderManager.addOrderDetail(orderIdForDetails, productId, quantity);
              console.log("Détail de commande ajouté avec succès !");
              break;

            case '2':
              const orderDetailIdToUpdate = readlineSync.questionInt("ID du détail de commande à mettre à jour: ");
              const newProductId = readlineSync.questionInt("Nouveau ID du produit: ");
              const newQuantity = readlineSync.questionInt("Nouvelle quantité: ");
              await orderManager.updateOrderDetail(orderDetailIdToUpdate, newProductId, newQuantity);
              console.log("Détail de commande mis à jour avec succès !");
              break;

            case '3':
              const orderDetailIdToDelete = readlineSync.questionInt("ID du détail de commande à supprimer: ");
              await orderManager.deleteOrderDetail(orderDetailIdToDelete);
              console.log("Détail de commande supprimé avec succès !");
              break;

            case '4':
              const orderDetails = await orderManager.getOrderDetails(orderIdForDetails);
              console.log("Détails de la commande:", orderDetails);
              break;

            case '0':
              console.log("Retour au menu des commandes");
              break;

            default:
              console.log("Choix invalide, veuillez réessayer.");
          }
        } while (detailChoice !== '0');
        break;

      case '0':
        console.log("Retour au menu principal");
        break;

      default:
        console.log("Choix invalide, veuillez réessayer.");
    }
  } while (choix !== '0');
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
        const orderId = readlineSync.questionInt("ID de la commande: ");
        const amount = readlineSync.questionFloat("Montant du paiement: ");
        const paymentDate = readlineSync.question("Date du paiement (YYYY-MM-DD): ");
        const paymentMethod = readlineSync.question("Méthode de paiement: ");
        await paymentManager.addPayment(orderId, amount, paymentDate, paymentMethod);
        console.log("Paiement ajouté avec succès !");
        break;

      case '2':
        const payments = await paymentManager.getPayments();
        console.log("Liste des paiements:", payments);
        break;

      case '3':
        const paymentIdToUpdate = readlineSync.questionInt("ID du paiement à mettre à jour: ");
        const newOrderId = readlineSync.questionInt("Nouvel ID de la commande: ");
        const newAmount = readlineSync.questionFloat("Nouveau montant du paiement: ");
        const newPaymentDate = readlineSync.question("Nouvelle date du paiement (YYYY-MM-DD): ");
        const newPaymentMethod = readlineSync.question("Nouvelle méthode de paiement: ");
        await paymentManager.updatePayment(paymentIdToUpdate, newOrderId, newAmount, newPaymentDate, newPaymentMethod);
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
        console.log("Au revoir !");
        break;

      default:
        console.log("Choix invalide, veuillez réessayer.");
    }
  } while (choix !== '0');
}

main().catch(console.error);
