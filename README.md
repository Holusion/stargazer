[init]:./docs/init.png
[reload]:./docs/reload.png
[header]:./docs/header.png
[product]:./docs/product.png
[main]:./docs/main.png
[card]:./docs/card.png
[upload]:./docs/upload.png
[burger]:./docs/burger.png
[filter]:./docs/filter.png
[playbar]:./docs/playbar.png
[deletebar]:./docs/deletebar.png
[closebar]:./docs/closebar.png
[checkbar]:./docs/checkbar.png
[play]:./docs/play.png
[active]:./docs/active.png
[delete]:./docs/delete.png
[select]:./docs/select.png
[tab]:./docs/tab.png

[English documentation](#english) - [Documentation française](#french)

# <a name="french"></a>Stargazer - Scanner de réseau zeroconf pour les produits [Holusion](http://holusion.com/fr/)

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

Stargazer peut fonctionner dans un environnement possédant un réseau internet mais aussi dans un environnement sans réseau.

Dans le premier cas, branchez votre produit sur le réseau et ouvrez l'application. Dans l'autre cas,
branchez le produit avec un câble RJ45 (ou un adaptateur RJ45 -> USB) directement
sur votre ordinateur et lancez l'application.

Si l'installation s'est bien passé, une fenêtre devrait s'ouvrir ressemblant à ceci :

![Ouverture de stargazer][init]

### Interface

Sélectionnez un produit, la fenêtre devrait ressembler à ceci :

![Playlist d'un produit][main]

#### Barre d'outils

![Barre d'outils][header]

- ![Ouvrir / Fermer le menu des produits][burger] Ouvrir / Fermer le menu des produits
- ![Ouvrir / Fermer le menu des filtres][filter] Ouvrir / Fermer le menu des filtres
- ![Lance le média sélectionné][playbar] Lance le média sélectionné
- ![Supprime les médias sélectionnés][deletebar] Supprime les médias sélectionnés
- ![Annule les filtres][closebar] Annule les filtres
- ![Confirme les filtres][checkbar] Confirme les filtres

#### Zone produits


- ![Rechercher produit][reload] met à jour la liste des produits
- ![Sélection produit][product] permet d'accéder au produit du même nom

#### Zone playlist

![Tabbar][tab]

- Contenus : Affiche la playlist du produit
- Infos : Affiche des informations sur le produit comme l'adresse IP, le player actuel, etc...

![Carte de la playlist][card]

Un simple clique permet de sélectionner la carte. Un clique sur une carte sélectionnée lance le média associé.

Les quatre sélecteurs suivant permettent de manipuler le média :
- ![Lire un média][play] : lit immédiatement le média
- ![Active / Désactive un média][active] : active / désactive le média
- ![Supprime définitivement un média][delete] : supprime définitivement le média
- ![Sélectionne la carte][select] : sélectionne la carte (permet la sélection multiple)

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

## Problème connu

### Linux

Si vous recevez une erreur `-3008 : name or service not known`, c'est probablement parce que le fichier `/etc/nsswitch.conf` n'est pas correctement configuré. Sur la ligne commençant par `hosts:` il doit y avoir l'option `mdns`, si elle n'est pas là, ajoutez là juste après `hosts:`. Si l'option `mdns` est là et que l'erreur est toujours déclenchée, changez la position de l'option. De temps en temps, il y a une option `dns4_minimal`, remplacez là par `mdns`.

-------------------------------------------------------------------------------

# <a name="english"></a>Stargazer - zeroconf network scanner for [Holusion](http://holusion.com/fr/) products

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

Select a product, the window should looks like this :

![Playlist d'un produit][main]

#### Toolbar

![Toolbar][header]

- ![Open / Close the products menu][burger] Open / Close the products menu
- ![Open / Close the filter menu][filter] Open / Close the filter menu
- ![Launch a media][playbar] Launch the selected media
- ![Remove the selected medias][deletebar] Remove the selected medias
- ![Cancel the filters][closebar] Cancel the filter modifications
- ![Confirm the filters][checkbar] Confirm the filter modifications

#### Product area


- ![Search product][reload] Update the product list
- ![Select product][product] Allows to access to the product with the same name

#### Playlist area

![Tabbar][tab]

- Contenus : Show the product playlist
- Infos : Show the informations about the product like IP address, actual player, etc..

![Playlist card][card]

A click allows to select the card. A click on a selected card launch the associated media.

The next  four selectors allow to manipulate the medias :
- ![Launch a media][play] : Launch immediately the media
- ![Enable / Disable a media][active] : Enable / Disable the media
- ![Remove definitively a media][delete] : Remove definitively the media
- ![Select the card][select] : Select the card (allow the multiple selection)

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

## Troubleshooting

### Linux

If you received an error `-3008 : name or service not known` it's probably because
the file `/etc/nsswitch.conf` is not correctly configured. On the line starting with
`hosts:` there must be the option `mdns`, if it is not here, add it just after `hosts:`.
If the option `mdns` is here and the error is still fired, change the position of the option.
Sometime there is an option `dns4_minimal`, replace it with `mdns`.

-------------------------------------------------------------------------------

## Dependencies

### Linux

Install : `libavahi-compat-libdnssd-dev`



# Doc

Apple's doc on bonjour : https://developer.apple.com/documentation/dnssd/1804744-dnsserviceresolve
