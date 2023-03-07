# Architecture - Frontend 

Nous allons voir dans cette partie les changements qui ont été effectués afin d'incorporer nos méthodes d'authentification à l'application Lenni-App existante. 

La page d'inscription du client a été modifié afin d'ajouter le choix de la seconde méthode d'authentification : question de sécurité, OTP, TOTP ou bien la vérification en magasin. 
Le choix de la seconde authentification est alors ajouté en tant que paramètre dans l'interface ClientData. 
Selon le choix effectué par l'utilisateur, l'affichage varie : 
- Si la question de sécurité est choisie, l'utilisateur peut choisir parmi 5 questions de sécurité classique et rentrer la réponse personnelle dans l'espace prévu à cette effet. 
- Si l'utilisateur choisit les codes à usage unique (OTP), il lui est indiquer qu'une liste de codes lui sera envoyée soit par courriel ou bien par envoi postal à son adresse. 
- Si le client fait le choix de des codes à usage unique avec une composante temporelle (TOTP), il lui est indiqué qu'un appareil physique générant les codes lui sera fournit par Lenni. 
- Enfin si le client choisit la méthode d'authentification en magasin, il devra alors se rendre chez un fournisseur afin de compléter une transaction. Le choix de cette dernière méthode fait passer le paramètre _pending_ à vrai afin que la transaction soit mise en attente jusqu'à qu'un fournisseur valide son identité. 
Du côté du fournisseur, nous avons ajouté un tableau permettant de visualiser toutes les transactions en cours et de les valider ou refuser selon la présentation d'une pièce d'identité valide du client. 

Ensuite, certains ajouts ont été apportés à la page des fournisseurs. 
La dernière option de la barre latérale permet de venir approuver les transactions mises en attente suite à une initiation de la méthode d'authentification en magasin sur le téléphone. Sur cet onglet, il est possible de faire la recherche d'un client, d'identifier la transaction que l'on souhaite modifier et de l'approuver ou la refuser. Les transactions sont placées en ordre alphabétique du nom de client.

# Fichier src/Core/users.tsx
 ## Méthode pour OTP (One-Time Password)

 ### generateNewOtp :
 Cette méthode permet de faire le lien entre le bouton *Generate new list* qui a été ajouté dans la page ```ClientProfilePage```, ainsi que l'appel API du backend ```api/user/generateOTP```. Cela va donc permette de générer une nouvelle liste de OTP vers le mail de l'utilisateur.

# Fichier src/Api/Auth/totp.tsx
 ## Méthodes pour TOTP (Time-based One-Time Password)

 ### fetchInitTotp :
 La méthode va permettre de faire le lien entre le bouton de la page ```PendingUserList``` qui va permettre d'accepter la création d'un compte utilisateur. Elle prend en paramètre un ```user``` et va appeller l'API du backend ```api/totp/init/:id```.

 ### sendTotpVerify :
 Cette méthode est la suite de la méthode précédente. Elle prend en paramètre un ```user``` ainsi qu'un ```code``` et va appeller l'API du backend ```api/totp/verify/:id```. Elle permet de vérifier si le code pris en paramètre fonctionne correctement pour la génération des TOTP.
 
# Fichier src/Api/Core/clientExchangeAds.tsx
 ## Méthodes pour l'authentification en magasin
 
 ### getAllClientExchangeAds
 Cette méthode va servir pour aller chercher toutes les transactions qui ont été mises en attente par le client au moment de débuter la transaction sur son téléphone. Pour cette méthode, elle est intégrée dans la page ```SupplierPendingSellers```.
 
 ### validateExchangeAd
 Méthode qui permet de compléter la validation d'une transaction qui été mise en attente de validation préalablement. Cette méthode est intégrée dans le composant ```PendingAdTable```.
 
 ### deleteExchangeAd
 Méthode qui permet de supprimer du compte d'un client une transaction. Cette méthode est intégrée dans le composant ```PendingAdTable``` tout comme la méthode qui fait la validation.
