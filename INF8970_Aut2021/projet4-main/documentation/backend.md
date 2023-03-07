# Architecture - Nodeserver (backend)

Comme vu dans le diagramme du README, de nouvelle méthode ont été ajouté dans le serveur du backend. Le rôle de chacune des nouvelles fonctions ajoutées pour l'authentification seront détaillés ici.

 # Fichier src/routes/user.ts
 ## Méthode pour OTP (One-Time Password)

 ### api/user/add :
 Cette méthode est utilisée lors de la création d'un nouvel utilisateur. Il a été modifié pour rajouter la méthode d'authentification choisie par ce nouvel utilisateur.
 - Si la variable ```secondAuthChoice = 2```, alors on crée une liste de OTP à envoyer par mail à l'utilisateur (même logique que la route generateOTP, plus bas).

 ### api/user/verifyOTP :
 Cette méthode prend dans son header le ```x-auth-token``` de l'utilisateur pour identifier le client ainsi qu'un fichier json contenant le ```code``` de l'utilisateur à vérifier. Avec ces paramètres, cette méthode va verifier dans la base de donnée si le code (l'OTP) envoyé est bien présent dans la liste de One-Time Password du client.
 - Si l'OTP est bien dedans, l'utilisateur sera authentifié et le mot de passe utilisé sera supprimé de la base de donnée, on retourne alors le json: ```{ has_errors: false, value: array }```
 (Avec 'array', le tableau contenant les mots de passe encore valide dans la base de donnée)
 - Sinon, l'authentification échoue et l'on retourne : ```{ has_errors: true, message: "Invalid password"}```

 ### api/user/generateOTP :
 Cette méthode prend dans son header le ```x-auth-token``` de l'utilisateur pour l'identifier.
 Cette route sert à générer une nouvelle liste de One-Time Password au client. Elle va générer aléatoirement dix nombres à six chiffres qu'elle va envoyer par mail au client grâce à l'appel à la fonction ```authserver/twilio/sendOTP```. Ensuite, cette liste de mot de passe sera envoyée à la base de donnée en étant encrypté.
 Cette méthode est appelée lorsque le client utilise tous les mots de passe de sa précédente liste et qu'il décide de générer une nouvelle liste. Il devra appuyer sur le bouton "Generate new list" qui apparait dans la section *Client Profile* de l'utilisateur.

 # Fichier src/routes/totp.ts
 ## Méthodes pour TOTP (Time-based One-Time Password)
 Les méthodes utilisées dans ce fichier permettent de faire le lien entre le frontend de l'application Lenni, ainsi que notre serveur auth-server. Ces appels seront faits au moment où l'administrateur devra valider l'inscription d'un utilisateur qui a choisi la méthode d'authentification TOTP.

 ### api/totp/init/:id :
 Fait un appel vers la route ```authserver:5000/totp/init```. Il prend en paramètre le ```id``` de l'utilisateur.

 ### api/totp/verify/:id :
 Fait un appel vers la route ```authserver:5000/totp/verify```. Il prend en paramètre le ```id``` de l'utilisateur.
 
 # Fichier src/routes/clientExchangeAd.ts
 ## Méthode pour Validation en magasin

 ### api/clientAd/exchange/validateID :
 Fait un appel vers la route ```authserver:5000/totp/validateID```. Tout comme les méthodes précédentes, cette méthode permet de faire le pont entre le frontend et le server 'authserver' et va donc notifier le client que son annonce a été validée.
 