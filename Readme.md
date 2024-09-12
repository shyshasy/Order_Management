# Update ABC Corporation DB

## Auteur

[Aichetou Taher SY](https://github.com/shyshasy)

## Dépôt
Le dépôt du projet est accessible à l'adresse suivante :  
[https://github.com/shyshasy/Update_ABC_Corporation_db](https://github.com/shyshasy/Update_ABC_Corporation_db)

## Description
Ce projet vise à gérer les entités clés de **ABC Corporation** (clients, produits, commandes, paiements) via une application Node.js interagissant avec une base de données MySQL. Il permet d'effectuer les opérations CRUD (Create, Read, Update, Delete) sur ces entités.

## Prérequis
- [Node.js ](https://nodejs.org/fr)
- [MySQL ](https://www.mysql.com/)
- [Readline-sync](https://www.npmjs.com/package/readline-sync)

### Dépendances Node.js
Installez les dépendances nécessaires avec la commande suivante :
```bash
npm install mysql2 
```
# Fonctionnalités

## Gestion des clients
- Lister tous les clients
- Ajouter un client
- Mettre à jour un client
- Supprimer un client

### des produits
- Lister tous les produits
- Ajouter un produit
- Mettre à jour un produit
- Supprimer un produit

## Gestion des commandes
- Ajouter une commande avec détails
- Mettre à jour une commande
- Supprimer une commande

## Gestion des paiements
- Ajouter un paiement
- Mettre à jour un paiement
- Supprimer un paiement

## Installation et Exécution##


```bash
git clone https://github.com/shyshasy/Update_ABC_Corporation_db
```


```bash
cd Update_ABC_Corporation_db
````
## Installer les dépendances :

````bash
npm install
````

Configurez la connexion MySQL dans le fichier db.js 

Lancez l'application :

```bash
node index.js
````