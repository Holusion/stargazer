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

- Windows : *C:\Users\<nom d'utilsateur>\AppData\Roaming\holusion-stargazer\log.log*
- Linux : */home/<nom d'utilisateur>/.config/holusion-stargazer/log.log*

Vous pouvez nous envoyer ce fichier à <contact@holusion.com> ou en ouvrant une issue sur
[Github](https://github.com/Holusion/stargazer) en nous expliquant votre problème et si
possible avec un exemple pour reproduire le problème.

-------------------------------------------------------------------------------

# Stargazer - zeroconf network scanner for [Holusion](http://holusion.com/fr/) products

[![Build status](https://ci.appveyor.com/api/projects/status/aqxc55did14mf0qa?svg=true)](https://ci.appveyor.com/project/sdumetz/stargazer)


## Install

### Windows

- Download holusionStargazerSetup.exe the [last release](https://github.com/Holusion/stargazer/releases)
- Install the executable file


### MacOS

MacOS compatibility is not actually supported.

### Linux

There is no linux package yet, but you can clone this repo and install it with
```shell
npm install
npm start
```

## Usage

### Setting up

Stargazer can work in an internet network environment and in an environment without
network too.

In the first case, plug your product in your network and launch the application. In
the other case, plug the product directly to you computer with a RJ45 cable (or a
RJ45 -> USB adaptor) and launch the application.

If the installation was succeeded, a window should appear like this one:

![Opening of stargazer][init]

## Interface

The window is composed of two distinct areas:

- the left area correspond to the products list found on the network
- the central area will show the medias present on the selected product (*see the rest*)

The application is composed of multiple buttons:

- ![Product search][reload] met à jour la liste des produits
- ![Go back and cut the list][header]
  - the arrow represent the "Go back", warning, it does not remove the last modifications made
  on de product.
  - the three horizontal bars allow to cut the list and keep only the current product view
- ![Product selection][product] allow to access to the product of the same name

Select a product and the window should look like this:

![Playslist of a product][main]

New information appears, the product name, the product version and the medias list installed
on the product. The playlist is displayed in the form of card:

![Card of the playlist][card]

The next three buttons allow to manipulate the media:

- **Lire**: Read the media immediately
- **ACTIF / INACTIF**: Enable / Disable the media
- **SUPPRIMER**: Remove the media definitively

## Adding a media

Click to the card ![Card to add a media][upload]

A file selection window should open, choose the file you want to send to the product and
validate your choice. A new card with your media should appear in the playlist.

## Feedback a problem

If you encounter an error, a message will display to warn you. This errors are copied
in a file based in:

- Windows : *C:\Users\<username>\AppData\Roaming\holusion-stargazer\log.log*
- Linux : */home/<username>/.config/holusion-stargazer/log.log*

You can send us this file at <contact@holusion.com> or open an issue on [Github](https://github.com/Holusion/stargazer)
by explaining you problem and if possible with an example to reproduce you problem.

-------------------------------------------------------------------------------

## Dependencies

### Linux

Install : `libavahi-compat-libdnssd-dev`



# Doc

Apple's doc on bonjour : https://developer.apple.com/documentation/dnssd/1804744-dnsserviceresolve
