# Order_Management

## Description
Ce projet vise à gérer les entités clés de **ABC Corporation** (clients, produits, commandes, paiements) via une application Node.js interagissant avec une base de données MySQL. Il permet d'effectuer les opérations CRUD (Create, Read, Update, Delete) sur ces entités.





## Prérequis
- [Node.js ](https://nodejs.org/fr)
- [MySQL ](https://www.mysql.com/)


## Dépôt
Le dépôt du projet est accessible à l'adresse suivante :  
[https://github.com/shyshasy/Order_Management](hhttps://github.com/shyshasy/Order_Management)


## Configuration de la connexion MySQL

Avant de lancer l'application, vous devez configurer la connexion à votre base de données MySQL. Voici comment procéder :

Ouvrez le fichier ./src/db.js 

Modifiez les paramètres de connexion pour correspondre à votre environnement MySQL. Remplacez les valeurs des propriétés  `user` par votre nom d'utilisateur et `password` par votre mot de passe.

## Installation et Exécution


```bash
git clone https://github.com/shyshasy/Order_Management.git
```


```bash
cd Order_Management
````
## Installer les dépendances :


````bash
npm install
````



Configurez la connexion MySQL dans le fichier db.js 

Lancez l'application :

```bash
cd Order_Management
```

```bash
cd src
````


```bash
node index.js
````

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


## Auteur

[Aichetou Taher SY](https://github.com/shyshasy)
