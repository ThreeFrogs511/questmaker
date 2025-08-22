// identification

let header = document.querySelector("header")
export const semaine = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
export const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
export const moisChiffre = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
export const dateChiffre = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"];
export const msgInfo = {
    msgAucuneTache : ` <div class="msgAucuneTache"><div>😭</div><p>Pas de tâches pour le moment.</p></div>`,
    msgAucuneListe: `<div class="msgAucuneListe"><div>😊</div><p>Vous n'avez pas encore créé de liste. </p><div class="maPremiereListe"><button >Créer ma première liste</button></div></div>`,
    msgQuandPasConnecte : `<p>Connectez-vous pour voir vos listes et tâches.</p>`,
    msgCreationNouvelleListe : `<div class="tutoCreationListe"> <span>Félicitations pour votre productivité 🎉</span> <br> Entrez le nom de votre nouvelle liste pour la créer, puis écrivez votre première tâche dans la barre de saisie !</div> `
}
    

// lancement
connexionOuDeconnexion();

console.log(JSON.parse(window.localStorage.getItem("session")))
// système de connexion / inscription

export function connexionOuDeconnexion() {
let session = JSON.parse(window.localStorage.getItem("session"));
if (!session) {
    inscription();
} else {
    let identification = document.querySelector(".identification")
    identification.addEventListener("click", (event) => {
        if (event.target.innerHTML === "Déconnexion") {
            window.localStorage.setItem("session", JSON.stringify(false))
            window.localStorage.setItem("user_id", null);
            window.localStorage.setItem("liste", null)
            location.href = 'index.php';
        }
    })
}};


// si la donnée session n'existe pas, l'user n'est pas connecté, donc on lance cette fonction
async function inscription() {
        header.insertAdjacentHTML("afterend", 
            `<dialog class="signUpBox">
            <h3>Inscrivez-vous ci-dessous</h3>
            <div class="msgErreur"></div>
                <form novalidate>
                    <div>
                        <label for="email">Votre email:</label>
                        <input type="email" name="email" id="email">
                    </div>
                    <div>
                        <label for="nom">Votre nom:</label>
                        <input type="text" name="nom" id="nom">
                    </div>
                    <div>
                        <label for="prenom">Votre prénom:</label>
                        <input type="text" name="prenom" id="prenom">
                    </div>
                    <div>
                        <label for="password">Votre mot de passe:</label>
                        <input type="password" name="password" id="password">
                    </div>
                 
                    <input type="submit" value="Envoyer">
                </form>
                   <small class="msgEnBas" >Vous avez déjà un compte ? <span class="loginOption">Connectez-vous</span></small>
            </dialog>`)
        let signUpBox = document.querySelector(".signUpBox")
        let signUpForm = document.querySelector(".signUpBox form")
        let baliseNom = document.getElementById("nom")
        let balisePrenom = document.getElementById("prenom")
        let baliseEmail = document.getElementById("email")
        let balisePassword = document.getElementById("password")
        let loginOption = document.querySelector(".loginOption")
        let filterSafe;
        const emailRegex = new RegExp('[a-zA-Z0-9_.]+@[a-zA-z_1-9]+\.[a-z]+')
        signUpBox && signUpBox.showModal();
        signUpForm.addEventListener("submit", async (event) => {
            filterSafe = true;
            event.preventDefault();
            signUpBox.querySelector(".msgErreur").innerHTML = '';
                if (balisePassword.value.trim() === '' || 
                    baliseNom.value.trim() === '' || 
                    balisePrenom.value.trim() === '' || 
                    baliseEmail.value.trim() === '') {
                    signUpBox.querySelector(".msgErreur").innerHTML += `<p>Erreur : veuillez ne laisser aucun champ vide.</p>`
                    filterSafe = false;
                } 
                if (!emailRegex.test(baliseEmail.value)) {
                    signUpBox.querySelector(".msgErreur").innerHTML += `<p>Erreur : email non valide.</p>`;
                    filterSafe = false;
                } 
                if (balisePassword.value.length < 5 ) {
                    signUpBox.querySelector(".msgErreur").innerHTML += `<p>Erreur : mot de passe trop court.</p>`;
                    filterSafe = false;
                } 
           

            if (filterSafe) {
                let data = {
                    email: baliseEmail.value, 
                    password: balisePassword.value, 
                    nom: baliseNom.value, 
                    prenom: balisePrenom.value
                }
                const response = await fetch("./php/inscription.php", {
                    method:"POST",
                    headers:{"content-type":"application/json"},
                    body: JSON.stringify(data)
                })
                const inscription = await response.json();
                if (inscription) {
                    signUpBox.innerHTML = `Bienvenue chez nous, ${inscription.prenom} ! Vous allez bientôt être redirigé vers la page de connexion.`;
                    setTimeout(() => {
                        connexion(signUpBox)
                    }, 2500);
                }
            }
        })
        loginOption.addEventListener("click", async () => {
            connexion(signUpBox)
        })
};
    



async function connexion(signUpBox) {
        signUpBox.innerHTML =  `<h3>Connectez-vous ci-dessous</h3>
        <div class="msgErreur"></div>
                <form class="loginForm" novalidate>
                    <div>
                        <label for="email">Votre email :</label>
                        <input type="email" name="email" id="email">
                    </div>
                    <div>
                        <label for="password">Votre mot de passe:</label>
                        <input type="password" name="password" id="password">
                    </div>
                 
                    <input type="submit" value="Envoyer">
                    <small class="retourEnArriere msgEnBas">Revenir à l'inscription</small>
                </form>`
        let loginForm = document.querySelector(".loginForm");
        let retourEnArriere = document.querySelector(".retourEnArriere")
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;
            let dataLogin = {email: email, password:password}
            const response = await fetch("./php/connexion.php", {
                method:"POST",
                headers:{"content-type":"application/json"},
                body: JSON.stringify(dataLogin)
            })
            const loginFeedback = await response.json();
            if (loginFeedback.error) {
                signUpBox.querySelector(".msgErreur").innerHTML =  `<p>Profil non trouvé. Veuillez réessayer.</p>`
            } else {
                loginFeedback.session = true;
                window.localStorage.setItem("session", JSON.stringify(loginFeedback.session));
                window.localStorage.setItem("user_id", JSON.stringify(loginFeedback.user_id));
                window.localStorage.setItem("alertBox", JSON.stringify(true));
                location.reload();

            }

        })
         signUpBox.addEventListener("click", (event) => {
        if (event.target === retourEnArriere) {
            window.localStorage.removeItem("session");
            signUpBox.remove();
           inscription();
        }
    })
};

// fonction clé permettant de générer automatiquement les listes selon un template précis
export async function générerListe(liste) {
    let dateObject = {};
     liste.forEach(list => {
        document.querySelector(".titleList").value = list.liste_titre;
        document.querySelector(".titleList").setAttribute("data-id", list.liste_id)
        let taskContainer = document.createElement("li");
        taskContainer.classList.add("task");
        //si l'user choisit une tâche du dashboard, elle est "highlight" via une animation :
        if (parseInt(JSON.parse(window.localStorage.getItem("taskHighlight"))) === list.todo_id) {
                        taskContainer.style.setProperty("animation", "highlightTask 2s linear 2")
                        window.localStorage.removeItem("taskHighlight")
            }
            
        if (list.todo_body !== null) {
            taskContainer.setAttribute("data-id", list.todo_id) // on insère l'id unique de la tâche afin de l'identifier plus tard
            taskContainer.innerHTML = `
                <span class="box"></span>
                <textarea class="taskBody" maxlength="50" type="text">${list.todo_body}</textarea>
                <input type="button" class="deadline" data-id="${list.todo_id}" data-date-formatted = ${list.deadline} value="">
                <i class="fa-regular fa-circle-xmark delete hidden"></i>
                <i class="fa-solid fa-ellipsis"></i>` 
            document.querySelector(".toDoListContainer").appendChild(taskContainer)
            if (list.done) {
                taskContainer.querySelector(".taskBody").classList.add("taskDone")
                taskContainer.querySelector(".box").classList.add("boxGreen")
            }
            if (list.deadline === null || list.deadline === undefined || list.deadline === "0000-00-00") {
                taskContainer.querySelector(".deadline").value = "Aucune deadline"
            } else {
                let deadlineFormatted = new Date(list.deadline)
                dateObject = {
                    date : deadlineFormatted.getDate(),
                    jour: semaine[deadlineFormatted.getDay()],
                    mois: mois[deadlineFormatted.getMonth()]
                } 
                taskContainer.querySelector(".deadline").value = ` ${dateObject.jour} ${dateObject.date} ${dateObject.mois}` 
            }
        } else { 
            // on gère l'absence de tâches dans la jointure externe. Pas de tâches = data NULL donc il faut les remplacer 
            document.querySelector(".toDoListContainer").innerHTML= msgInfo.msgAucuneTache;
        }


    });
    
    
}

// par défaut, questmaker affiche une liste qui est la plus récente
export async function afficherListeRecenteParDefaut() {
    if (JSON.parse(window.localStorage.getItem("user_id"))!== null) {
        if (JSON.parse(window.localStorage.getItem("liste")) === null) {
            const response = await fetch("./php/listeRecente.php", {
                method: "POST",
                headers:{"content-type":"application/json"},
                body: JSON.stringify({user_id:JSON.parse(window.localStorage.getItem("user_id"))})
            }) ;
            // on récupère la liste la plus récente
            const listeRecente = await response.json();
            // s'il n'y a aucune tâche dans la liste
             if (listeRecente.todo_body === null) {
                document.querySelector(".toDoListContainer").innerHTML = msgInfo.msgAucuneTache;
                document.querySelector(".titleList").value = listeRecente.liste_titre;
            // s'il n'y a aucune liste
            } else if (listeRecente.length === 0 || listeRecente === undefined) {
               document.querySelector(".titleList").value = '';
                document.querySelector(".toDoListContainer").innerHTML= msgInfo.msgAucuneListe;
                creationToutePremiereListe();
            // s'il y a au moins une liste et au moins une tâche
            } else {
            await générerListe(listeRecente)
            window.localStorage.setItem("liste", JSON.stringify(listeRecente))    
            }
           
        } else {
            const listeRecente = JSON.parse(window.localStorage.getItem("liste"))
            !listeRecente[0].todo_body && (listeRecente[0].todo_body = null);
            await générerListe(listeRecente)
           
        }     
    } else {
        document.querySelector(".toDoListContainer").innerHTML = msgInfo.msgQuandPasConnecte;
    }
}

// quand l'user n'a pas encore créé de liste, un bouton lui permet de le guider, diff selon mobile ou pc
export function creationToutePremiereListe() {
    if (document.querySelector(".maPremiereListe")) {
        // on désactive les clics inutiles tant que l'user n'a pas crée de liste
        interdireLeClickQuandAucuneListe();
        document.querySelector(".maPremiereListe").addEventListener("click", () => {
            // si .fa-bars existe, on est sur mobile. Sinon sur PC. Deux systèmes différents.
            if (getComputedStyle(document.querySelector(".fa-bars")).getPropertyValue("display") !== "none") {
               
                // on crée dynamiquement le pop up de création de liste
                document.querySelector(".popUpMobile").innerHTML = 
                    `
                    <div>
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                    <div>
                        <h3>Entrez le nouveau nom de votre liste</h3>
                        <textarea name="task" id="entryField" placeholder="Ma liste" minlength="1" maxlength="25" >${document.querySelector(".titleList").value}</textarea>
                    </div>
                    <div>
                        <button class=" listeBtn submitBtnMobile">Envoyer</button>
                    </div>
                `
                document.querySelector(".popUpMobile").classList.toggle("popUpMobileOpen");
                document.querySelector(".entryField") && document.getElementById("entryField").focus();
            } else {
                document.querySelector(".titleList").focus();
                // document.querySelector(".toolBar div").classList.contains("titleListHightLight") && document.querySelector(".toolBar div").classList.remove("titleListHightLight");
                document.querySelector(".toolBar div").classList.add("titleListHightLight");
                setTimeout(() => {
                    document.querySelector(".toolBar div").classList.remove("titleListHightLight")
                }, 550);
            
             
            }
        })
    }
}

// D'un certains cas, (par ex quand il y a aucune tâche ni liste), on doit interdire l'interaction avec
// certains éléments pour éviter des bugs. Cette fonction joue avec le "toggle" pour activer et réactiver
// au besoin
export function interdireLeClickQuandAucuneListe() {
    document.querySelector(".globalWrapper").style.setProperty("overflow", "hidden");
    document.querySelector(".iconToolBar").classList.toggle("noClick");
    document.querySelector(".searchBarContainer").classList.toggle("noClick");
    document.querySelector(".taskSetUpContainer").classList.toggle("noClick");
    document.querySelector(".rechercheDeListe").classList.toggle("noClick");
    document.getElementById("barsContainer").classList.toggle("noClick");
}
