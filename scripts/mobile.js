
import { msgInfo, generateurDeTache, generateurdeListe, moisChiffre, dateChiffre, générerListe, afficherListeRecenteParDefaut, interdireLeClickQuandAucuneListe } from "./global.js"

// l'id unique de l'user
const user_id = JSON.parse(window.localStorage.getItem("user_id"))
// objet global qui sert à stocker les listes avec tri et listes avec filtre
let listeCustomise = {
    tri: null,
    filtre: null
};

// variable globale pour mettre à jour dynamiquement les filtres à appliquer
let filtresChoisis = [];

// deconnexion via barre nav mobile
document.querySelector(".deconnexionMobile").addEventListener("click", () => {
    window.localStorage.setItem("session", JSON.stringify(false))
    window.localStorage.setItem("user_id", null);
    window.localStorage.setItem("liste", null)
    location.href = 'index.php';
})

// recherche de liste via barre de nav mobile
document.querySelector(".rechercheDeListe").addEventListener("click", (e) => {
        containerActionMobile(e);
})


// les 'if (document.querySelector(".fa-bars")' sont là pour éviter les bug quand on arrive sur la page dashboard)



// affichage menu contextuel via le hamburger sur mobile
document.querySelector(".toolBar .fa-bars").addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-bars")) {
        document.querySelector(".iconToolBarMobile").classList.toggle("iconToolBarOpen");
        document.querySelector("html").classList.toggle("no-scroll");
        e.target.classList.toggle("fa-barsOn");
        if (document.querySelector(".iconToolBarMobile").classList.contains("iconToolBarOpen")) {
            document.getElementById("trash").classList.remove("on");
            document.getElementById("new").classList.remove("on");
        } 
    } 
})
// permet la fermeture du menu contextuel en cliquant ailleurs
document.querySelector(".globalWrapper").addEventListener("click", (e) => {
if (!e.target.classList.contains("fa-bars") && document.querySelector(".iconToolBarMobile").classList.contains("iconToolBarOpen")) {
        closeHamburgerMenu();
    } 
})



// fermeture menu contextuel sur mobile
function closeHamburgerMenu() {
    document.querySelector(".fa-barsOn") && document.querySelector(".fa-barsOn").classList.remove("fa-barsOn");
    document.querySelector(".iconToolBarMobile").classList.remove("iconToolBarOpen");
    document.querySelector("html").classList.remove("no-scroll");
    document.getElementById("trash").classList.remove("on");
    document.getElementById("new").classList.remove("on");
}



// gestion du click sur chaque option du menu contextuel mobile
if (document.querySelector(".fa-bars")) {
    // on charge la liste affichée pour vérifier s'il y a au moins 1 tâche
    // Si 0 tâche = les fonctions "filtre" et "tri" sont bloquées
    document.querySelector(".iconToolBarMobile").addEventListener("click", (e) => {
        if (e.target.getAttribute("id") === "tri" || e.target.classList.contains("fa-arrow-up-z-a")) {
            if (document.querySelector(".toDoListContainer").innerHTML !== msgInfo.msgAucuneTache) {
                triDesTachesSurMobile();
            }
        }

        if (e.target.getAttribute("id") === "trash" || e.target.classList.contains("fa-trash")) {
            setTimeout(() => {
                supprimerUneListeSurMobile();
            },100);
        }

        if (e.target.getAttribute("id") === "new" || e.target.classList.contains("fa-plus") || 
            e.target.getAttribute("id") === "liste" || e.target.classList.contains("fa-list") ||
            e.target.getAttribute("id") === "titreListe" ||e.target.classList.contains("fa-pen-to-square")) {
            containerActionMobile(e);
        }

        if (e.target.getAttribute("id") === "filtrer" || e.target.classList.contains("fa-filter")) {
              if (document.querySelector(".toDoListContainer").innerHTML !== msgInfo.msgAucuneTache) {
                afficherSousMenuFiltreMobile();
            }
        }

        
    })
}

// TOOLBAR : fonctionnalité de tri spécial mobile
function triDesTachesSurMobile() {
    const listeVierge = JSON.parse(window.localStorage.getItem("liste"))
    const tri = document.getElementById("tri");
    if (listeVierge[0].todo_body !== null || listeVierge[0].todo_body !== undefined) {
        tri.classList.toggle("on");
        if (document.getElementById("tri").classList.contains("on")) {
            const listeAvecTri = listeVierge.sort((a, b) => {
                const dateA = a.deadline ? Date.parse(a.deadline) : Infinity;
                const dateB = b.deadline ? Date.parse(b.deadline) : Infinity;
                return dateA - dateB;})
            listeCustomise["tri"] = listeAvecTri;
            document.querySelector(".toDoListContainer").innerHTML = "";
            if (listeCustomise["filtre"] === null) {
                générerListe(listeAvecTri)
            } else {
                const listeAvecFiltre = [...listeCustomise["filtre"]];
                const listAvecFiltreEtTri = listeAvecFiltre.sort((a, b) => {
                    const dateA = a.deadline ? Date.parse(a.deadline) : Infinity;
                    const dateB = b.deadline ? Date.parse(b.deadline) : Infinity;
                    return dateA - dateB;})
                générerListe(listAvecFiltreEtTri)
            }
        } else {
            listeCustomise["tri"] = null;
            document.querySelector(".toDoListContainer").innerHTML = "";
            listeCustomise["filtre"] === null ? générerListe(listeVierge) : générerListe(listeCustomise["filtre"]);
        }
    }
        
    };

// TOOLBAR :fonctionnalité de suppression de liste spécial mobile
async function supprimerUneListeSurMobile() {
    if (JSON.parse(window.localStorage.getItem("liste"))) {
            let confirmation = confirm("Êtes-vous sûr de vouloir supprimer cette liste ?");
            if (confirmation) {
                document.querySelector(".iconToolBarMobile").classList.toggle("iconToolBarOpen");
                document.querySelector(".fa-barsOn") && document.querySelector(".fa-barsOn").classList.remove("fa-barsOn")
                const response = await fetch("./php/deleteList.php", {
                    method: "POST",
                    headers:{"content-type":"application/JSON"},
                    body: JSON.stringify({liste_id: document.querySelector(".titleList").dataset.id})
                })
                    await response.json();
                    window.localStorage.removeItem("liste");
                    document.querySelector(".toDoListContainer").innerHTML =''
                    afficherListeRecenteParDefaut();
            } else {
                 document.querySelector(".iconToolBarMobile").classList.toggle("iconToolBarOpen");
                 document.querySelector(".fa-barsOn") && document.querySelector(".fa-barsOn").classList.remove("fa-barsOn");
            }
        
    }
}

// TOOLBAR : ouverture du container unique permettant de : créer une tâche, une liste, modifier liste, etc
async function containerActionMobile(e) {
    if (e.target.getAttribute("id") === "new") {
    document.querySelector(".popUpMobile").innerHTML = `
            <div>
                <i class="fa-solid fa-xmark"></i>
            </div>
            <div>
                <h3>Créer votre tâche ci-dessous</h3>
                <textarea name="task" id="entryField" placeholder="Nouvelle tâche" minlength="1" maxlength="50" ></textarea>
            </div>
            <div>
                <div class="deadline-picker-container">
                    <input type="button" class="btn-deadline-mobile" value="Aucune deadline">
                </div>
                <button class="taskBtn submitBtnMobile">Envoyer</button>
            </div>
        `
    } else if (e.target.getAttribute("id") === "liste") {
        document.querySelector(".popUpMobile").innerHTML = 
         `
            <div>
                <i class="fa-solid fa-xmark"></i>
            </div>
            <div>
                <h3>Donnez un nom à votre nouvelle liste</h3>
                <textarea name="task" id="entryField" placeholder="Ma liste" minlength="1" maxlength="25" ></textarea>
            </div>
            <div>
                <button class=" listeBtn submitBtnMobile">Envoyer</button>
            </div>
        `
    } else if (e.target.getAttribute("id") === "titreListe") {
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
                <button class=" titreListBtn submitBtnMobile">Envoyer</button>
            </div>
        `
    } else if (e.target.classList.contains("fa-magnifying-glass") || e.target.classList.contains("rechercheDeListe") ) {
        document.querySelector(".popUpMobile").innerHTML = 
          `
            <div>
                <i class="fa-solid fa-xmark"></i>
            </div>
            <div>
                <h3>Entrez le nom de la liste en question :</h3>
                <input type="search" list="toutes-les-listes"  id="entryInputTypeSearchField" placeholder="Ma liste" minlength="1" maxlength="25" autocomplete="off">
                <datalist id="toutes-les-listes"></datalist>
            </div>
            <div class="containerMsgErreur">

            </div>
            <div>
                <button class=" listeChercheBtn submitBtnMobile">Envoyer</button>
            </div>
        `
       suggestionDeToutesLesListes();
    } else if (e.target.classList.contains("fa-ellipsis")) {
         document.querySelector(".popUpMobile").innerHTML = 
          `
            <div>
                <i class="fa-solid fa-xmark"></i>
            </div>
            <div class="rubriqueModifier">
                <h3>Modifier votre tâche :</h3>
                <textarea name="task" id="entryField" data-id = ${e.target.closest("li").dataset.id} placeholder="Ma liste" minlength="1" maxlength="50" >${e.target.closest("li").querySelector(".taskBody").value}</textarea>
            </div>
            <div>
              <div class="deadline-picker-container">
                    <input type="button" class="btn-deadline-mobile" value="${e.target.closest("li").querySelector(".deadline").value}">
                </div>
                <button class="editTacheMobile submitBtnMobile">Envoyer</button>
                <button class="supprimerTacheBtnMobile">Supprimer la tâche</button>
            </div>
        `
    }
    document.querySelector(".popUpMobile").classList.toggle("popUpMobileOpen");
    document.querySelector(".entryField") && document.getElementById("entryField").focus();
 
    if (document.querySelector(".fa-bars")) {
    setTimeout(() => {
        closeHamburgerMenu();
         
    }, 250);
    }
    !document.querySelector("html").classList.contains("no-scroll") && document.querySelector("html").classList.add("no-scroll");
   
}   


//Gestion du click sur ce container unique
document.querySelector(".popUpMobile").addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-xmark")) {
        document.querySelector(".popUpMobile").classList.toggle("popUpMobileOpen");
        document.querySelector("html").classList.contains("no-scroll") && document.querySelector("html").classList.remove("no-scroll");
    } else if (e.target.classList.contains("taskBtn")) {
        // ajoutDeTacheSurMobile(e);
        ajoutDeTachePOOMobile(e);
    } else if (e.target.classList.contains("btn-deadline-mobile")) {
        let date = new Date(); 
        let dateCompatibleAvecInput = 
            date.getFullYear()
            +"-"+
            moisChiffre[date.getMonth()]
            +"-"+ 
            (date.getDate() < 10 ? dateChiffre[date.getDate()] : date.getDate());
        e.target.value= dateCompatibleAvecInput;
        e.target.setAttribute("type", "date");
        e.target.setAttribute("min", dateCompatibleAvecInput);
    } else if (e.target.classList.contains("listeBtn")){
        creationNouvelleListeMobile();
    } else if (e.target.classList.contains("titreListBtn")) {
        modifierTitreDeListeExistanteMobile();
    } else if (e.target.classList.contains("editTacheMobile") || e.target.classList.contains("supprimerTacheBtnMobile")) {
        modifierTacheSurMobile(e);
    } 
})

// CREATION TACHE :système d'ajout de tâches pour mobile
// async function ajoutDeTacheSurMobile(e) {
//     const user_id = JSON.parse(window.localStorage.getItem("user_id"))
//     if (e.target.classList.contains("taskBtn") && user_id !== null && 
//         document.querySelector(".titleList").value.trim() !=='' && 
//         document.getElementById("entryField").value.trim() !=='') 
//     {
//         let taskBody = document.getElementById("entryField").value.trim();
//         let deadline = document.querySelector(".btn-deadline-mobile").value;
//         deadline === "Aucune deadline" && (deadline=null);
//         const response = await fetch("./php/todo.php", {
//             method: "POST",
//             headers: {"content-type": "application/json"},
//             body: JSON.stringify({todo_body:taskBody, titleId: document.querySelector(".titleList").dataset.id, deadline: deadline, user_id:user_id})
//         })
//         const updatedList = await response.json();
//         if (updatedList[1]) {
//             window.localStorage.setItem("liste", JSON.stringify(updatedList[0]));
//             let listeDeTravail = updatedList[0];
//             let task = listeDeTravail[listeDeTravail.length - 1];
//             deadline ??= task.deadline = "Aucune deadline";
//             document.querySelector(".toDoListContainer").innerHTML === msgInfo.msgAucuneTache && (document.querySelector(".toDoListContainer").innerHTML = '');
//             let taskContainer = document.createElement("li");
//             taskContainer.classList.add("task");
//             taskContainer.setAttribute("data-id", task.todo_id) // on insère l'id unique de la tâche afin de l'identifier plus tard
//             taskContainer.innerHTML = `
//             <span class="box "></span>
//             <textarea class="taskBody" maxlength="50" type="text">${task.todo_body}</textarea>
//             <input type="button" class="deadline" data-id="${task.todo_id}" value="${task.deadline}">
//             <i class="fa-regular fa-circle-xmark delete hidden"></i>
//             <i class="fa-solid fa-ellipsis"></i>`
//             document.querySelector(".toDoListContainer").appendChild(taskContainer);
//             document.getElementById("entryField").value='';
//             document.querySelector(".popUpMobile").classList.toggle("popUpMobileOpen");
//         } else {
//             console.log(updatedList[1]);
//         }
//     }
           
// }

async function ajoutDeTachePOOMobile(e) {
    if (e.target.classList.contains("taskBtn") && user_id !== null && 
    document.querySelector(".titleList").value.trim() !=='' && 
    document.getElementById("entryField").value.trim() !=='') {
        // on récupère les valeurs clés
        let todo_body = document.getElementById("entryField").value.trim();
        let liste_id = document.querySelector(".titleList").dataset.id;
        const user_id = JSON.parse(window.localStorage.getItem("user_id"));
        let deadline = document.querySelector(".btn-deadline-mobile").value === "Aucune deadline" ? null : document.querySelector(".btn-deadline-mobile").value;
        // on construit la tâche via le générateur      
        let tache = new generateurDeTache(todo_body, 0, deadline, liste_id, user_id);
        // on envoie le tout vers la BDD
        await tache.envoiTacheVersBDD();
        // on l'insère dynamiquement dans la li <ul>
        tache.insertionDeLaTacheDansLaListe();
        // on reset l'input et on ferme le container dynamique
        document.getElementById("entryField").value='';
        document.querySelector(".popUpMobile").classList.toggle("popUpMobileOpen");

}}

// fonction qui permet de modifier et supprimer une tâche en particulier
async function modifierTacheSurMobile(e) {
    let idDeLaTache = document.getElementById("entryField").dataset.id;
    let idDeLaListe = document.querySelector(".titleList").dataset.id;
    // on gère la modification de la tâche ici
    if (e.target.classList.contains("editTacheMobile")) {
        if (document.getElementById("entryField").value.trim() !== '') {
            let nouvelIntituleDeTache = document.getElementById("entryField").value.trim();
            let nouvelleDeadline = document.querySelector(".btn-deadline-mobile") ? document.querySelector(".btn-deadline-mobile").value : null;
            const response = await fetch("./php/updateToDo.php", {
                method: "POST",
                headers:{"content-type":"application/JSON"},
                body: JSON.stringify({
                    userId:user_id, 
                    body: nouvelIntituleDeTache, 
                    deadline: nouvelleDeadline, 
                    id: idDeLaTache, 
                    idList: idDeLaListe
                })
            })
        
            const listeAvecLaTacheMiseAJour = await response.json();
            const listeDeToutesLesTaches = Array.from(document.querySelectorAll(".task"));
       
            for (let i = 0; i < listeDeToutesLesTaches.length-1 ; i++) {
                if (listeDeToutesLesTaches[i].dataset.id === idDeLaTache) {
                    listeDeToutesLesTaches[i].querySelector(".taskBody").value = nouvelIntituleDeTache;
                    listeDeToutesLesTaches[i].querySelector(".deadline").value = `${semaine[nouvelleDeadline.getDay()]} ${nouvelleDeadline.getDate()} ${mois[nouvelleDeadline.getMonth()]}`;
                    break;
                } 
            }
            window.localStorage.setItem("liste", JSON.stringify(listeAvecLaTacheMiseAJour));
            document.getElementById("entryField").value='';
            document.querySelector(".popUpMobile").classList.toggle("popUpMobileOpen");
        }
        // on gère la suppression de la tâche ici
    } else if (e.target.classList.contains("supprimerTacheBtnMobile")) {
        let supprimerLaTacheConfirmation = confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?");
        if (supprimerLaTacheConfirmation) {
             const response = await fetch("./php/supprimerUneTache.php" , {
                method: "POST",
                headers:{"content-type": "application/JSON"},
                body: JSON.stringify({idTask:idDeLaTache, userId:user_id, idList:idDeLaListe, title:document.querySelector(".titleList").value})
            })
            const suppression = await response.json();
            const listeDeToutesLesTaches = Array.from(document.querySelectorAll(".task"));
            for (let i = 0 ; i < listeDeToutesLesTaches.length-1 ; i++) {
                if (listeDeToutesLesTaches[i].dataset.id ===  idDeLaTache) {
                    listeDeToutesLesTaches[i].remove();
                }
            }
            if (suppression.todo_body === null) {
                // si liste sans tâche = > "suppression" devient un objet. On doit le transformer en Array sinon
                // les fonctions de génération de listes bug (elles requièrent un Array)
                const updatedList = [];
                updatedList[0] = suppression;
                window.localStorage.setItem("liste", JSON.stringify(updatedList));
                document.querySelector(".toDoListContainer").innerHTML = msgInfo.msgAucuneTache;
            } else {
                  window.localStorage.setItem("liste", JSON.stringify(suppression));
            }
            document.getElementById("entryField").value='';
            document.querySelector(".popUpMobile").classList.toggle("popUpMobileOpen");
        }
    }
}
    
async function creationNouvelleListeMobile() {
    if (document.getElementById("entryField") !=='' ) {
        let nomDeLaNouvelleListe = document.getElementById("entryField").value.trim();
         const response = await fetch("./php/creationNouvelleListe.php", {
                method:"POST",
                headers:{"content-type": "application/JSON"},
                body: JSON.stringify({title:nomDeLaNouvelleListe, userId:user_id})
        })
        const nouvelleListe = await response.json();
        document.querySelector(".toDoListContainer").innerHTML = msgInfo.msgAucuneTache;
        document.querySelector(".titleList").value = nomDeLaNouvelleListe;
        document.querySelector(".titleList").dataset.id = nouvelleListe[0].liste_id;
        window.localStorage.setItem("liste", JSON.stringify(nouvelleListe))
        interdireLeClickQuandAucuneListe();
        document.querySelector(".popUpMobile").classList.toggle("popUpMobileOpen");
    }
}

async function modifierTitreDeListeExistanteMobile() {
    document.getElementById("entryField").focus();
    if (document.getElementById("entryField").value.trim() !=='') {
            let idDeLaListe = document.querySelector(".titleList").dataset.id;
            const response = await fetch("./php/nouveauTitre.php", {
                method:"POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify(
                    {value: document.getElementById("entryField").value, 
                    id:idDeLaListe, 
                    userId:user_id
                })
            })
        const listeAvecLeTitreAJour= await response.json();
        document.querySelector(".titleList").value = listeAvecLeTitreAJour[0].liste_titre; // on change l'ancienne value par la nouvelle
        window.localStorage.setItem("liste", JSON.stringify(listeAvecLeTitreAJour));
        document.querySelector(".popUpMobile").classList.toggle("popUpMobileOpen");
        }
}
    
// TOOLBAR : affichage du sous menu des filtres
function afficherSousMenuFiltreMobile() {
    let choixFiltre = document.createElement("dialog");
    choixFiltre.classList.add("choixFiltreMobile")
    choixFiltre.innerHTML = 
    `<div class="filterDeadlineMobile choix">Filtrer par deadline </div>
    <div class="filterDoneMobile choix">Filtrer par tâches faites </div>
    <div class="filterNotDoneMobile choix">Filtrer par tâches non faites</div>
    <div id="groupe-btn">
        <button class="validateFilter">Valider</button>
        <button class="cancelFilter">Reset</button>
    </div>`;
    let listeDesFiltresPossibles = Array.from(choixFiltre.querySelectorAll(".choix"));
    for (let i = 0 ; i <= listeDesFiltresPossibles.length-1; i++) {
        filtresChoisis[i] && listeDesFiltresPossibles[i].classList.add("filtreChoisi");
    }

    document.body.appendChild(choixFiltre);
    choixFiltre.showModal();
    document.querySelector(".choixFiltreMobile").addEventListener("click", (e) => {
        if (e.target.classList.contains("validateFilter")) {
            let filtres = Array.from(document.querySelectorAll(".choix"));
            filtresChoisis = filtres.map(n => n.classList.contains("filtreChoisi"));
            // si on choisit deux filtres antagonistes
            if (filtresChoisis[1] && filtresChoisis[2]) {
                console.log("erreur : impossible de choisir deux filtres antagonistes")
            // si on choisit aucun filtre
            } else if (!filtresChoisis.includes(true)){
                document.getElementById("filtrer").classList.remove("on");
                document.querySelector(".toDoListContainer").innerHTML = "";
                listeCustomise["filtre"] = null;
                document.querySelector(".choixFiltreMobile").remove();
                // on doit regénérer la liste mais on regarde d'abord si le "tri" est encore activé 
                if (listeCustomise["tri"] === null) {
                    const listeSansFiltreEtSansTri = JSON.parse(window.localStorage.getItem("liste"));
                    générerListe(listeSansFiltreEtSansTri);
                } else {
                    générerListe(listeCustomise["tri"]);
                }
                closeHamburgerMenu();
            } else {
                document.getElementById("filtrer").classList.add("on");
                appliquerFiltres(filtresChoisis);
                document.querySelector(".choixFiltreMobile").remove();
            }
        } else if (e.target.classList.contains("cancelFilter")) {
            // on reset tout, on vérifie si un tri n'est pas activé et on génère la liste de nouveau
            document.getElementById("filtrer").classList.remove("on");
            document.querySelector(".toDoListContainer").innerHTML = "";
            listeCustomise["filtre"] = null;
            filtresChoisis = [];
            if (listeCustomise["tri"] === null) {
                const listeSansFiltreEtSansTri = JSON.parse(window.localStorage.getItem("liste"));
                générerListe(listeSansFiltreEtSansTri);
            } else {
                générerListe(listeCustomise["tri"]);
            }
            closeHamburgerMenu();
            document.querySelector(".choixFiltreMobile").remove();
        } else if (e.target.classList.contains("filterDeadlineMobile")) {
            e.target.classList.toggle("filtreChoisi")
        } else if (e.target.classList.contains("filterDoneMobile")) {
            e.target.classList.toggle("filtreChoisi")
        } else if (e.target.classList.contains("filterNotDoneMobile")) {
            e.target.classList.toggle("filtreChoisi")
        }
    })

}

// FILTRE : système d'application des filtres
function appliquerFiltres(filtresChoisis) {
    let filtreDeadline = filtresChoisis[0];
    let filtreTachesFaites = filtresChoisis[1];
    let filtreTachesNonFaites = filtresChoisis[2];
    let listeNonFiltre;
    document.querySelector(".toDoListContainer").innerHTML = "";
    if (listeCustomise["tri"] === null) {
        listeNonFiltre = JSON.parse(window.localStorage.getItem("liste"));
    } else {
        listeNonFiltre = listeCustomise["tri"];
    }
    if (filtreDeadline) {
        if (filtreTachesFaites) {
            // On applique les filtres DEADLINE + TACHES FAITES puis on génère la nouvelle liste filtrée
            let listeAvecFiltre = listeNonFiltre.filter(n => n.deadline !== null && n.done === 1);
            générerListe(listeAvecFiltre);
            // Stockage d'une version sans tri de la liste filtrée, pour triDesTachesSurMobile()
            let listeAvecFiltreMaisSansTri = listeNonFiltre.filter(n => n.deadline !== null && n.done === 1);
            listeCustomise["filtre"] = listeAvecFiltreMaisSansTri
        } else if (filtreTachesNonFaites) {
            // On applique les filtres DEADLINE + TACHES NON FAITES puis on génère la nouvelle liste filtrée
            let listeAvecFiltre = listeNonFiltre.filter(n => n.deadline !== null && n.done === 0);
            générerListe(listeAvecFiltre);
            // Stockage d'une version sans tri de la liste filtrée, pour triDesTachesSurMobile()
            let listeAvecFiltreMaisSansTri = listeNonFiltre.filter(n => n.deadline !== null && n.done === 0);
            listeCustomise["filtre"] = listeAvecFiltreMaisSansTri
        } else {
            // On applique le filtre DEADLINE puis on génère la nouvelle liste filtrée
            let listeAvecFiltre = listeNonFiltre.filter(n => n.deadline !== null )
            générerListe(listeAvecFiltre);
            // Stockage d'une version sans tri de la liste filtrée, pour triDesTachesSurMobile()
            let listeAvecFiltreMaisSansTri = listeNonFiltre.filter(n => n.deadline !== null);
            listeCustomise["filtre"] = listeAvecFiltreMaisSansTri
        }
    } else if (filtreTachesFaites) {
        // On applique le filtre TACHES FAITES puis on génère la nouvelle liste filtrée
        let listeAvecFiltre = listeNonFiltre.filter(n => n.done === 1);
        générerListe(listeAvecFiltre);
        // Stockage d'une version sans tri de la liste filtrée, pour triDesTachesSurMobile()
        let listeAvecFiltreMaisSansTri = listeNonFiltre.filter(n => n.done === 1);
        listeCustomise["filtre"] = listeAvecFiltreMaisSansTri;
    } else if (filtreTachesNonFaites) {
        // On applique le filtre TACHES NON FAITES puis on génère la nouvelle liste filtrée
        let listeAvecFiltre = listeNonFiltre.filter(n => n.done === 0)
        générerListe(listeAvecFiltre);
        // Stockage d'une version sans tri de la liste filtrée, pour triDesTachesSurMobile()
        let listeAvecFiltreMaisSansTri = listeNonFiltre.filter(n => n.done === 0);
        listeCustomise["filtre"] = listeAvecFiltreMaisSansTri;
    }
    closeHamburgerMenu();

}


async function suggestionDeToutesLesListes() {
    if (document.querySelector(".listeChercheBtn")) {
        const response = await fetch('./php/listeDesListes.php', {
            method: "POST", 
            headers :{"content-type":"application/json"},
            body : JSON.stringify({user_id:user_id})
        })
        const listedeToutesLesListes = await response.json();
        for (let i = 0 ; i < listedeToutesLesListes.length ; i++) {
            document.getElementById("toutes-les-listes").innerHTML+= 
                `<option value="${listedeToutesLesListes[i].liste_titre}"></option>`
        }

        // si l'user choisit une liste parmi les suggestions et clique sur le bouton d'envoi :
        document.querySelector(".listeChercheBtn").addEventListener("click", async ()=> {
            
            if (document.getElementById("entryInputTypeSearchField").value.trim() !== "") {
                for (let i = 0 ; i < listedeToutesLesListes.length ; i++) {
                    if (document.getElementById("entryInputTypeSearchField").value.trim() === listedeToutesLesListes[i].liste_titre) {
                        const response = await fetch("./php/chercherUneListePrecise.php", {
                            method:"POST",
                            headers:{"content-type":"application/json"},
                            body: JSON.stringify({liste_id:listedeToutesLesListes[i].liste_id})
                        })
                        const listeChoisieParUser = await response.json();
                          
                        // on récupère l'url pour rediriger l'user vers page principale s'il se trouve sur
                        // le dashboard
                         const pageActuelle = window.location.pathname;
                       
                        if (pageActuelle === '/questmaker/dashboard.php') {
                            document.querySelector(".containerMsgErreur").textContent = "";
                            window.localStorage.setItem("liste", JSON.stringify(listeChoisieParUser));
                            window.location.href = 'index.php';
                        }
                      
                            document.querySelector(".toDoListContainer").innerHTML = "";
                            générerListe(listeChoisieParUser);
                            window.localStorage.setItem("liste", JSON.stringify(listeChoisieParUser));
                            document.querySelector(".popUpMobile").classList.toggle("popUpMobileOpen");
                            document.getElementById("entryInputTypeSearchField").value = "";
                            break;
                    }
                }
                document.querySelector(".containerMsgErreur") && (document.querySelector(".containerMsgErreur").textContent = "Aucune liste trouvée. Veuillez réessayer.");
            } else {
                if (document.querySelector(".containerMsgErreur")) {
                            document.querySelector(".containerMsgErreur").textContent = "Veuillez ne pas laisser le champ vide."
                    }
            }
        }) 
    }
}


// TACHE : click sur les trois points pour ouvrir le container unique permettant de modifier ou supprimer une tâche, éditer une deadline
if (document.querySelector(".fa-bars")) {
    document.querySelector(".toDoListContainer").addEventListener("click", (e) => {
        if (e.target.classList.contains("fa-ellipsis")) {
            containerActionMobile(e);
        }
    })
}



