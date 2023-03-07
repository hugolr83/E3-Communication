# Architecture - Auth-server

Comme vu dans le diagramme du README, deux classes sont ici présentes. Le rôle de chacune des fonctions sera détaillé ici


# Twilio Controller
## Méthode Question de securité
Pour cette méthode d'authentification, deux fonctions sont utilisés:
### defaultPOST :
Cette méthode est appelée par le flow Twilio afin de poser la quesion de sécurité à l'usager. Elle demande dans son body un paramètre ```token``` qui correspond au token d'authentification de l'usager (obtenue préablement en faisant un appel à Lenni avec le nom d'utilisateur et mot de passe).
La méthode se charge de demander à Lenni les informations détaillées concernant l'usager (question, réponse, numéto de téléphone) à l'aide de l'appel GET ```/api/user/current```. Avec ces informations un appel est initié à l'aide de l'API Twilio afin de poser la question de sécurité de vive voix. La méthode ```voiceReponse.gather``` permet de paramétrer le système de reconnaissance vocale. Un point important est le paramètre ```action``` qui permet de spécifier à Twilio l'URL a appeler après effectué le reconnaissance vocale afin de traiter la réponse. Enfin, on sauvegarde les données relatif à cet appel (Appel ID, numéro de téléphone, réponse etc.) dans la structure de données ```answerToSay``` afin de pouvoir récupérer ces informations plus tard.


### smsReponseQuestion:
On effectue ici le traitement de la réponse de l'usager. Le lien vers cette méthode doit être spécifiée dans le champs ```action``` précédemment vu. Une variable d'environnement ```NGROK_CALLBACK``` a été ajouté à cet effet. Twilio fournit les paramètres suivant lors de l'appel :
- CallSid : Représente l'ID de l'appel. Ceci nous permettra de récupérer les informations sauvegardées précédemment (comme la réponse attendue).
- SpeechResult : Contient la phrase prononcée par l'usager qui a été détectée à l'aide des modèles d'intelligence artificielle de Twilio.
Un comparaison entre ce SpeechResult et la réponse attendue est effectuée. Si la réponse est identique, alors on utilise ```twiml.say``` afin de notifier verbalement l'usager de sa bonne réponse. Un appel au Flow est aussi effectué à l'aide de ```smsClient.studio.v2.flows``` afin de reprendre l'éxécution du Flow. Voir section Twilio avec appel RestAPI.

## Méthode Validation en magasin
### validateID :
Cette méthode sera appelée par le backend de Lenni afin de notifier l'usager que son annonce a bien été validée. Elle prend en body le numéro de téléphone de destination. Ensuite, on fait un appel POST vers le Twilio Flow afin d'envoyer le message. 

## Méthode OTP
### sendOtp :
Cette méthode sera appelée par le backend de Lenni afin d'envoyer la liste des codes OTP généré par courriel. Pour rappel, la génération des codes s'effectue dans le backend. La méthode prend en body trois paramètres :
 - ```email``` : L'email de l'usager
 - ```list``` : La liste des codes à envoyer
 - ```name``` : Le nom de l'usager (qui apparaitra dans le corps du courriel).
 L'API SendGrid est ici utilisé afin de facilier l'envoi du courriel. Un paramètre important à noter est ```template_id``` qui définit le template du courriel à utiliser (il est possible d'en créer sur l'interface web de SendGrid).


# TOTP Controller
Ces fonctions ont été ajoutées pour interfacer Lenni avec Twilio.
### init:
Cette méthode prend comme paramètre dans le body un ```friendlyname``` (nom de l'usager) et un ```userId```. Ceci permettra d'identifier et de sauvegarder l'utilisateur dans le système de Twilio. Cette méthode init fait appel au service verify afin de créer un facteur d'authentification. Dans notre cas, nous ajoutons une authentification TOTP. L'appel à la librairie Twilio nous retourne notamment le binding (qui correspond au token nous permerttant de générér les codes TOTP). Ce token pourra être ajouté par exemple dans Google Auth.

### verify:
Cette méthode a pour but de vérifier la méthode d'authentification. Il ne faut pas confondre cette étape avec l'étape de validation. Cet appel devra être fait qu'une seule fois. L'idée ici est de vérifier que la génération de code fonctionne bien et identique à Twilio que le facteur est prêt à être utilisé. On passe encore en body le ```userId``` mais aussi le ```code``` à vérifier. Dans la méthode, on fait un appel à Twilio verify afin de récupérer les informations du dernier facteur créé. Puis on vérifie dans un 2e appel à la librairie, que le code est valide.