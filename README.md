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
Lester utilise une base de donnée en cloud, nommée MongoDB. C'est un gestionnaire de base de donnée noSQL, orienté objet.

Il est possible d'utiliser [MongoDB Atlas](https://cloud.mongodb.com/) (Cloud) ou [MongoDB Community](https://docs.mongodb.com/manual/administration/install-community/)


