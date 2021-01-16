# Lester
Lester un bot RôlePlay Open Source développé dans l'objectif d'améliorer le RôlePlay pour console via [Discord](https://discord.com/).

Merci à chaque utilisateur qui soutiendra ce travail en ajoutant une étoile, et en contribuant au projet en nous signalant les différents bugs trouvés en rejoigant [notre support](https://discord.gg/ME3y3Bx).

La documentation **complète** de l'Open Source est en cours de rédaction.

## Pré-requis
1. Créer une application (bot) sur [Discord Developer Portal](https://discordapp.com/developers/)
2. Installer [Node.js (LTS)](https://nodejs.org/fr/download/)
3. Télécharger Lester :
    * En **.zip** et/ou **tar.gz** : [Voir](https://github.com/Tseacen/Lester-OpenSource/releases)
    * Avec [Git](https://git-scm.com/download/win) : `$ git clone https://github.com/Tseacen/Lester-OpenSource.git`
4. Configurer le bot (Voir ci-dessous).
    
## Configuration
1. Renommer le fichier `config.example.js` en `config.js`
2. Ouvrez le fichier `config.js`
3. Modifier les valeurs suivantes :
    * **token** : Le token est la clé d'authentification à votre bot. Le token est récuperable sur [Discord Developer Portal](https://discordapp.com/developers/).
    * **mongodbUrl** : Le lien de d'accès à votre base de donnée (Voir *Configuration de la Base de donnée*).
    
**⚠ Avertissement :** Ne pas remplir l'une des valeurs ci-dessus, où les retirer du fichier empêchera le bot de fonctionner correctement. Soyez sûr de ce que vous faîtes avant d'apporter ces changements.

## Configuration Base de donnée 
Lester utilise MongoDB. C'est un gestionnaire de base de donnée noSQL, orienté objet.

Il est possible d'utiliser [MongoDB Atlas](https://cloud.mongodb.com/) (Cloud) ou [MongoDB Community](https://docs.mongodb.com/manual/administration/install-community/)

Nous ne pouvons pas réellement vous recommandez l'un ou l'autre. **MongoDB Atlas** ne nécessite pas d'installation manuel, car c'est une solution cloud. MongoDB Atlas propose un Cluster gratuit de 512mb (qui sera très largement suffisant).
**MongoDB Community** fonctionne en **localhost**. Il faudra alors procéder à une installation manuelle sur votre VPS, afin de le configurer. Mais la capacité de stockage est égale à celle de votre VPS. 

Plusieurs tutoriels sont disponibles sur **YouTube**, ou **Internet** pour apprendre à créer un cluster sur le cloud ou en localhost.

1. Créer un accès privé pour le bot (Database Access)
2. Configurer dans le fichier `config.js` la valeur suivante :

   Exemple : `"mongodbUrl": "mongodb+srv://<NomDeL'acces>:<MotDePasse>@cluster0.giwyh.mongodb.net/<NomDeLaBaseDeDonnee>?retryWrites=true&w=majority"`
Modifier la partie *NomDeL'acces*, *MotDePasse* et *NomDeLaBaseDeDonnee* par vos informations.

**Note : N'oubliez pas d'enlever les chevrons < et > !**

## Lancer le bot
2 Possibilités :

* Double-clique sur le fichier `start.bat`. L'installation et la mise à jour des dépendances se fera automatiquement.
* Ouvrez un terminal dans le dossier et lancer le fichier `index.js`. Ex: `node index.js`

**⚠ Avertissement :** Pour le moment le lancement manuel ne prend pas en compte l'installation des dépendances automatiquement. Il faudra effectuer dans le terminal la commande suivante : `npm install` avant de lancer pour la **première fois** le bot.


## F.A.Q
Cliquez sur la question pour y voir les réponses et les détails. 
* **[✨ Comment mettre à jour le script du bot ?](readme/MAJ.md)**
* **[✨ Puis-je modifier le script ?](readme/MODIFICATION.md)**
