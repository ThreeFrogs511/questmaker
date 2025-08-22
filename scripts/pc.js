
import {affichageMenuFiltre, systemeDeFiltre, systemeDeTri, ouvertureBarreDeRechercheDeListe, supprimerLaListe} from "./toolbar.js"
import { semaine, mois, moisChiffre, dateChiffre, msgInfo, générerListe, afficherListeRecenteParDefaut, interdireLeClickQuandAucuneListe } from "./global.js"


let taskInput = document.querySelector(".taskInput")
let titleList = document.querySelector(".titleList")
let taskInsertContainer = document.querySelector(".taskSetUpContainer")
let btnFilter = document.querySelector(".fa-filter")
let btnPlus = document.querySelector(".fa-plus")


// l'id unique de l'user
const user_id = JSON.parse(window.localStorage.getItem("user_id"));

//liste globale pour reset les écouteurs d'event au besoin
let currentBoxHandler = null;
let pikadayDate = null;
let picker = null;
let supprimer = '';
let idChangerTitreListeExistante = null;
let idCreationTitreNouvelleListe = null;




if (document.querySelector(".toDoListContainer")) {
    afficherListeRecenteParDefaut();
    modifierTitreDeListe();
    ajoutDeTache();
    validerUneTache();
    supprimerUneTache();
    creationNouvelleListe();
    ouvertureBarreDeRechercheDeListe();
    ajouterUneDeadline();
// fonctions de toolbar
    systemeDeFiltre();
    systemeDeTri();
    affichageMenuFiltre(btnFilter);
    supprimerLaListe();
    if ( taskInsertContainer) {
    modifierUneTache();
    }
} 


  
//code qui affiche le pop up d'alerte des tâches expirées quand l'user se connecte pour la 1ère fois
document.addEventListener("DOMContentLoaded", async () => {
let alert = JSON.parse(window.localStorage.getItem("alertBox"))
    if (alert) {
        popUpAlerteTacheExpiree()
         window.localStorage.setItem("alertBox", JSON.stringify(false))
    }
  })


function creationNouvelleListe() { 
    if (user_id !== null) {
    btnPlus.addEventListener("click", () => {
        btnPlus.classList.toggle("on");
        if (btnPlus.classList.contains("on") && getComputedStyle(document.querySelector(".fa-bars")).getPropertyValue("display") === "none") {
            document.querySelector(".searchBar").classList.remove("searchOpen");
            document.querySelector(".fa-rectangle-xmark").style.setProperty("opacity", "0");
            document.querySelector(".searchInput").innerHTML ='';
            document.querySelector(".fa-arrow-up-z-a").classList.remove("on");
            document.querySelector(".fa-filter").classList.remove("on");
            document.querySelectorAll(".filterOption").forEach(f => {
                f.classList.remove("resetFilter");
            })

            document.querySelector(".toDoListContainer").innerHTML= msgInfo.msgCreationNouvelleListe;
            titleList.value ='';
            titleList.setAttribute("data-id", "");
            titleList.focus();
            taskInsertContainer.style.setProperty("display", "none");
            modifierTitreDeListe();
            } else {
                document.querySelector(".toDoListContainer").innerHTML="";
                afficherListeRecenteParDefaut();
                taskInsertContainer.style.removeProperty("display");
            }
        })
    }
}



async function modifierTitreDeListe() {
    const user_id = JSON.parse(window.localStorage.getItem("user_id"))
    titleList.removeEventListener("keydown", idCreationTitreNouvelleListe)
    titleList.removeEventListener("keydown", idChangerTitreListeExistante)
    //
    idChangerTitreListeExistante = async function changerTitreListeExistante(e) {
        if (titleList.value.trim() !=='' && e.key === "Enter") {
            let idList = titleList.dataset.id
            const response = await fetch("./php/nouveauTitre.php", {
                method:"POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({value: titleList.value, id:idList, userId:user_id})
            })
        const feedback = await response.json();
        titleList.value = feedback[0].liste_titre; // on change l'ancienne value par la nouvelle
        window.localStorage.setItem("liste", JSON.stringify(feedback))
        interdireLeClickQuandAucuneListe()
        }
    }
    // 
    idCreationTitreNouvelleListe = async function CreationTitreNouvelleListe(e) { 
        if (titleList.value.trim() && e.key === "Enter") {
            taskInsertContainer.style.removeProperty("display")
            document.querySelector(".toDoListContainer").innerHTML='';
            const response = await fetch("./php/creationNouvelleListe.php", {
                method:"POST",
                headers:{"content-type": "application/JSON"},
                body: JSON.stringify({title:titleList.value, userId:user_id})
        })
        const titreAjoute = await response.json();
        document.querySelector(".fa-plus").classList.remove("on");
        taskInput.focus()
        titleList.value = titreAjoute[0].liste_titre;
        titleList.setAttribute("data-id", titreAjoute[0].liste_id);
        window.localStorage.setItem("liste", JSON.stringify(titreAjoute))
        location.reload(true);
        }
    }
    // on choisit l'un des 2 fonctions. Si le bouton "+" est utilisé ET au moins une liste existe
    //  on choisit la 1ère, sinon la 2ème
    if (!btnPlus.classList.contains("on") && JSON.parse(window.localStorage.getItem("liste")) !== null) {
        titleList.addEventListener("keydown", idChangerTitreListeExistante )
    } else { 
        titleList.addEventListener("keydown", idCreationTitreNouvelleListe)
    }

}


function ajoutDeTache() {
    const user_id = JSON.parse(window.localStorage.getItem("user_id"))
    if (user_id !== null) {
        taskInput.addEventListener("keydown", async (event) => {
            if (event.key === "Enter" && 
                titleList.value.trim() !== '' && 
                !document.querySelector(".searchOpen")) {
                let deadline = null;
                const response = await fetch("./php/todo.php", {
                    method: "POST",
                    headers: {"content-type": "application/json"},
                    body: JSON.stringify({todo:taskInput.value, titleId: titleList.dataset.id, deadline: deadline, user_id:user_id})
                })
                const updatedList = await response.json();
                 window.localStorage.setItem("liste", JSON.stringify(updatedList[0]));
                let listeDeTravail = updatedList[0];
                let task = listeDeTravail[listeDeTravail.length - 1];
                task.deadline = "Aucune deadline";
                if (document.querySelector(".toDoListContainer").innerHTML === msgInfo.msgAucuneTache) {
                document.querySelector(".toDoListContainer").innerHTML = ''
                    }
                let taskContainer = document.createElement("li");
                taskContainer.classList.add("task");
                taskContainer.setAttribute("data-id", task.todo_id) // on insère l'id unique de la tâche afin de l'identifier plus tard
                taskContainer.innerHTML = `
                <span class="box "></span>
                <textarea class="taskBody" maxlength="50" type="text">${task.todo_body}</textarea>
                <input type="button" class="deadline" data-id="${task.todo_id}" value="${task.deadline}">
                <i class="fa-regular fa-circle-xmark delete hidden"></i>
                <i class="fa-solid fa-ellipsis"></i>`
                document.querySelector(".toDoListContainer").appendChild(taskContainer);
                taskInput.value=''
            }
        })
    } 
}

//système pour mettre à jour les tâches
function modifierUneTache() {
    document.querySelector(".toDoListContainer").addEventListener("input", async (event) => {
        if (event.target.classList.contains("taskBody")) {
            const user_id = JSON.parse(window.localStorage.getItem("user_id"))
            let newTask = event.target.value;
            let taskId = event.target.parentElement.dataset.id;
            let deadline = event.target.nextElementSibling(".deadline").value === "Aucune deadline" ? null : event.target.nextElementSibling(".deadline").value;
            let response = await fetch("./php/updateTodo.php", {
                method: "POST",
                headers:{"content-type":"application/JSON"},
                body: JSON.stringify({body:newTask, id:taskId, userId:user_id, idList:titleList.dataset.id, deadline: deadline})
            })
            let updatedTask = await response.json();
            window.localStorage.setItem("liste", JSON.stringify(updatedTask))
        }})
}

export function validerUneTache() { 
    if (currentBoxHandler) {
         document.querySelector(".toDoListContainer").removeEventListener("click", currentBoxHandler)
    }
    currentBoxHandler = async function handleClickBox(event) {
        if (event.target.classList.contains("box")) {
            event.target.classList.toggle("boxGreen")
            let taskDone = event.target.parentElement.querySelector(".taskBody")
            taskDone.classList.toggle("taskDone")
            let statut = event.target.classList.contains("boxGreen") ? 1 : 0;
            let idTask = event.target.parentElement.dataset.id
            let idTitle = titleList.dataset.id;
            const user_id = JSON.parse(window.localStorage.getItem("user_id"))
            const response = await fetch("./php/taskStatus.php", {
                    method:"POST",
                    headers:{"content-type": "application/JSON"},
                    body: JSON.stringify({id:idTask, done: statut, idTitle:idTitle, userId:user_id})
                })
                const feedback = await response.json();
                window.localStorage.setItem("liste", JSON.stringify(feedback))
            }
        }                
    document.querySelector(".toDoListContainer").addEventListener("click", currentBoxHandler)
    
}


function supprimerUneTache() {
    // if (document.querySelector(".optionMobile").style.getPropertyValue("display") !== "none") {
     document.querySelector(".toDoListContainer").addEventListener("mouseover", (event) => {
        if (event.target.parentElement.classList.contains("task") || event.target.classList.contains("task")) {
            if (event.target.parentElement.classList.contains("task")) {
                supprimer = event.target.parentElement.querySelector(".delete");
            } else {
                supprimer = event.target.querySelector(".delete")
            }
            
            supprimer && supprimer.classList.remove("hidden");
        }
        })
    document.querySelector(".toDoListContainer").addEventListener("mouseout", (event) => {
        if (event.target.parentElement.classList.contains("task") || event.target.classList.contains("task") && supprimer && !supprimer.classList.contains("hidden") ) {
            supprimer && supprimer.classList.add("hidden");
        }
        })
     
     document.querySelector(".toDoListContainer").addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete")) {
            const user_id = JSON.parse(window.localStorage.getItem("user_id"))
            // let idTask = event.target.parentElement.dataset.id
            const response = await fetch("./php/supprimerUneTache.php" , {
                method: "POST",
                headers:{"content-type": "application/JSON"},
                body: JSON.stringify({idTask:event.target.parentElement.dataset.id, userId:user_id, idList:titleList.dataset.id, title:titleList.value})
            })
    const suppression = await response.json();
    event.target.parentElement.remove();
    if (suppression.todo_body === null) {
        const updatedList = [];
        updatedList[0] = suppression
        console.log(updatedList[0])
        window.localStorage.setItem("liste", JSON.stringify(updatedList))
        document.querySelector(".toDoListContainer").innerHTML = msgInfo.msgAucuneTache;
       
        
    } else {
         window.localStorage.setItem("liste", JSON.stringify(suppression))
    }
   
       
        
    }

})
}
// }



                                                    // * ---- SECTION DEADLINE --- * //                  


//fonction pour mettre à jour la deadline dynamiquement
function ajouterUneDeadline() {

    pikadayDate = function handlePikaday(event) {
        // On récupère la date ajd pour fixer une date minimum (impossible de choisir une date antérieure)
        let today = new Date();

        // si l'user n'a pas choisi de deadline, un msg par défaut apparaît. Par soucis de compatibilité, il faut
        //tout de même choisir une date par défaut, celle d'ajd par exemple
        if (event.target.classList.contains("deadline")) {
            if (event.target.value === 'Aucune deadline') {
                event.target.value = 'Aucune deadline';
                event.target.dataset.dateFormatted = today;
            }
            
            
            // Si le picker existe déjà, on le détruit pour éviter une multiplication des listeners et des bugs
            if (picker) {
                picker.destroy()
                picker = null;
            }

            // Au focus sur l'input de date, on crée un nouvel objet "picker" avec plsrs propriétés, dont la cible/field (event.target),
            // et une fonction anonyme qui s'active quand l'user choisit une date (onSelect)
            picker = new Pikaday({ 
                    field: event.target,
                    defaultDate: event.target.dataset.dateFormatted,
                    setDefaultDate : true,
                    minDate : today,
                    onSelect: async () => {
                        // 1 - on crée un objet date, on le formatte au format "YYYY/MM/DD" pour être SQL 
                        // et Pikaday compatible (sinon bug d'affichage)
                        let date = new Date(Date.parse(event.target.value)); 
                        let datePourSql = date.getFullYear()
                        +"/"+
                        moisChiffre[date.getMonth()]
                        +"/"+ 
                        (date.getDate() < 10 ? dateChiffre[date.getDate()] : date.getDate());
                        // 2  on appelle une fonction qui se chargera d'envoyer à la BDD SQL
                        await modifierUneDeadline(datePourSql, event.target.dataset.id, event);
                        // 3 - on reformate la date pour la mettre en lettres dans la tâche => meilleure UX
                        let dateObject = {
                            date : date.getDate(),
                            jour: semaine[date.getDay()],
                            mois: mois[date.getMonth()]
                        } 
                        event.target.value = `${dateObject.jour} ${dateObject.date} ${dateObject.mois}`;
                      
                        // 4 - quand on a finit, on détruit l'objet picker pour éviter des bugs de multiplication de listeners
                        picker.destroy();
                        picker = null;
                    
                    }        
            });
        }
    }

    // on insère et active le listener en dernier, après avoir déclaré la fonction 
    // et suppr tous les listeners redondants
    document.querySelector(".toDoListContainer").addEventListener("focusin", pikadayDate)
}

async function modifierUneDeadline(date, id, event) {
    // 1 - envoie des données vers BDD SQL
   const user_id = JSON.parse(window.localStorage.getItem("user_id"))
    let response = await fetch("./php/updateDeadline.php", {
                    method: "POST",
                    headers: {"content-type": "application/JSON"},
                    body: JSON.stringify({date:date, id: id, userId:user_id, idList:titleList.dataset.id})
                })
    // 2 - on reçoit un tableau avec : deadline propre, compatible avec SQL et Pikaday, et la liste globale à jour
    let updatedList = await response.json();
    // 3 - on màj l'attribut dateFormatted qui sera utilisé par Pikaday pour sélectionner une date
    event.target.dataset.dateFormatted = updatedList['deadlineFormatted']
    // 4 - on enregistre les modifs de la liste actuelle dans le localStorage, afin de la réutiliser si besoin
    window.localStorage.setItem("liste", JSON.stringify(updatedList['list']))
    
}


// pop up qui s'affiche quand certaines tâches non accomplies sont expirées (deadline dépassée)
async function popUpAlerteTacheExpiree() {
    const user_id = JSON.parse(window.localStorage.getItem("user_id"))
        const response = await fetch("./php/searchList.php", {
            method:"POST",
            headers:{"content-type":"application/JSON"},
            body: JSON.stringify({user_id:user_id})
        });
        const listStmts = await response.json();    
        let listsStmtsNotDone = listStmts.filter(n => n.done === 0 && n.deadline !== null && Date.parse(n.deadline) <= Date.now())
        if (listsStmtsNotDone.length > 0) {
            let alertExpired = document.createElement("dialog")
            alertExpired.classList.add("alertBoxExpired")
            alertExpired.innerHTML =` 
            <div>🔍</div>
            <h2> Vous avez ${listsStmtsNotDone.length} tâche(s) en attente : </h2>
            <ul>
            </ul>
            <button class="closeAlert">Fermer</button>
            `
           
            listsStmtsNotDone.forEach(e => {
                 let deadlineFormatted = new Date(e.deadline)
                        let dateObject = {
                            date : deadlineFormatted.getDate(),
                            jour: semaine[deadlineFormatted.getDay()],
                            mois: mois[deadlineFormatted.getMonth()]
                        } 
                alertExpired.querySelector("ul").innerHTML+=
                `<li class="lateTask" data-liste="${e.liste_id}"data-id="${e.todo_id}"><span>${e.todo_body}</span> | ${dateObject.jour} ${dateObject.date} ${dateObject.mois}</li>`
            })
            document.body.appendChild(alertExpired)
            alertExpired.showModal();
            alertExpired.addEventListener("click", async (event) => {
                if (event.target.classList.contains("closeAlert")) {
                    alertExpired.remove();
                }

                if (event.target.classList.contains("lateTask") || event.target.closest(".lateTask")) {
                    let listeId = event.target.dataset.liste ??= event.target.closest(".lateTask").dataset.liste;
                    let todoId = event.target.dataset.id ??= event.target.closest(".lateTask").dataset.id;
                    window.localStorage.setItem("taskHighlight", JSON.stringify(listeId))
                    const response = await fetch("./php/searchList.php", {
                        method: "POST",
                        headers: {"content-type":"application/json"},
                        body: JSON.stringify({user_id:user_id} )
                    })
                    const listeStmts = await response.json();
                    let listeACorriger = listeStmts.filter(n => n.liste_id === parseInt(listeId));
                    window.localStorage.setItem("taskHighlight", JSON.stringify(todoId));
                    window.localStorage.setItem("liste", JSON.stringify(listeACorriger))   
                    document.querySelector(".toDoListContainer").innerHTML= "";
                    générerListe(listeACorriger);
                    alertExpired.remove();
                   
                }
            })
        }

} 





