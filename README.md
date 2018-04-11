[init]:./docs/init.png
[reload]:./docs/reload.png
[header]:./docs/header.png
[product]:./docs/product.png
[main]:./docs/main.png
[card]:./docs/card.png
[upload]:./docs/upload.png

# Stargazer - Scanner de réseau zeroconf pour les produits [Holusion](http://holusion.com/fr/)

[![Build status](https://ci.appveyor.com/api/projects/status/aqxc55did14mf0qa?svg=true)](https://ci.appveyor.com/project/sdumetz/stargazer)


## Installation

### Windows

- Télécharger holusionStargazerSetup.exe à en choisissant la [dernière release](https://github.com/Holusion/stargazer/releases)
- Installer l'éxécutable


### MacOS

La compatibilité MacOS n'est pas supportée actuellement.

### Linux

Il n'y a a pas encore de package linux, mais vous pouvez cloner ce repo et installer avec
```shell
npm install
npm start
```

## Utilisation

### Mise en place

Stargazer peut fonctionner dans un environnement possèdant un réseau internet mais aussi
dans un environnement sans réseau.

Dans le premier cas, branchez votre produit sur le réseau et ouvrez l'application. Dans l'autre cas,
branchez le produit avec un câble RJ45 (ou un adaptateur RJ45 -> USB) directement
sur votre ordinateur et lancez l'application.

Si l'installation s'est bien passé, une fenêtre devrait s'ouvrir ressemblant à ceci :

![Ouverture de stargazer][init]

### Interface

La fenêtre est composée de deux zones distinctes :

- la zone de gauche correspond à la liste des produits trouvés sur le réseau
- la zone centrale affichera les médias présents sur le produit sélectionnés (*voir la suite*)

L'application est composée de plusieurs boutons :

- ![Rechercher produit][reload] met à jour la liste des produits
- ![Retour arrière et coupe de la liste][header]
  - la flèche représente le retour en arrière, attention, ça n'enlève pas les modifications faites sur le produit
  - les trois barres horizontales permettent de couper la liste et de ne concerver que la vue du produit courant
- ![Sélection produit][product] permet d'accèder au produit du même nom

Sélectionnez un produit, la fenêtre devrait ressembler à ceci :

![Playlist d'un produit][main]

De nouvelles informations apparaissent, le nom du produit, la version du produit et
la liste des médias installés sur le produit. La playlist est affichée sous forme de cartes :

![Carte de la playlist][card]

Les trois boutons suivant permettent de manipuler le média :
- **LIRE** : lit immédiatement le média
- **ACTIF / INACTIF** : Active / Désactive le média
- **SUPPRIMER** : Supprime définitivement le média

### Ajouter un média

Cliquez sur la carte ![Carte d'ajout d'un média][upload]

Une fenêtre de sélection de fichier devrait s'ouvrir, choisissez le fichier que vous
souhaitez envoyer sur le produit et validez votre choix. Une nouvelle carte avec votre
média devrait apparaître dans la playlist.

## Remonter un problème

Si vous rencontrez une erreur, un message s'affichera pour vous prévenir. Ces erreurs sont
copiées dans un fichier se trouvant dans :

- Windows : C:\Users\<nom d'utilsateur>\AppData\Roaming\holusion-stargazer\log.log
- Linux : /home/<nom d'utilisateur>/.config/holusion-stargazer/log.log

Vous pouvez nous envoyer ce fichier à <contact@holusion.com> ou en ouvrant une issue sur
[Github](https://github.com/Holusion/stargazer) en nous expliquant votre problème et si
possible avec un exemple pour reproduire le problème.

-------------------------------------------------------------------------------

## Dependencies

### Linux

Install : `libavahi-compat-libdnssd-dev`



# Doc

Apple's doc on bonjour : https://developer.apple.com/documentation/dnssd/1804744-dnsserviceresolve
