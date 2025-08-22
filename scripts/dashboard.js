let tachesNonFaitesContainer = document.querySelector(".tachesNonFaites")
let sousContainerNonFaites = document.querySelector(".sousContainerNonFaites")
// 
let user_id = JSON.parse(window.localStorage.getItem("user_id"))

// 
const response = await fetch("./php/profilInfo.php", {
            method : "POST",
            headers : {"content-type" : "application/json"},
            body : JSON.stringify(user_id)
})
const profileInfoList = await response.json();


let elementAffiche = 0;
if (elementAffiche === 0) {
tachesNonFaitesContainer.querySelector(".fa-arrow-left").style.removeProperty("cursor")
}

//

//fonctions
await graphTachesAccomplies()
await listerTachesAFaire(user_id)

voirPlus()
typeWriterMessage()

// 
import { semaine, mois} from "./global.js"


if (JSON.parse(window.localStorage.getItem("liste")) === null ||
    JSON.parse(window.localStorage.getItem("liste")) === undefined) {
    !document.querySelector(".rechercheDeListe").classList.contains("noClick") && document.querySelector(".rechercheDeListe").classList.add("noClick");
}
async function listerTachesAFaire(user_id) {
    const response = await fetch("./php/tachesAFaire.php", {
            method : "POST",
            headers : {"content-type" : "application/json"},
            body : JSON.stringify({user_id:user_id})
        })
    const tachesAFaire = await response.json();
    const tachesAFaireUrgente = tachesAFaire.sort((a,b) => {
        const dateA = a.deadline ? Date.parse(a.deadline) : Infinity;
        const dateB = b.deadline ? Date.parse(b.deadline) : Infinity;
        return dateA - dateB});
    
    let elementTotal = tachesAFaireUrgente.length;
    let movement = 0;

    affichageTaskDashboard(tachesAFaireUrgente, sousContainerNonFaites)
    NavigationTaskHorizontale(tachesNonFaitesContainer, sousContainerNonFaites, elementAffiche, elementTotal, movement)

}


function affichageTaskDashboard(taches, container) {
    if (container === sousContainerNonFaites) {
        container.innerHTML = '';
        let contenuBtnDeadline;
        if(taches.length > 0) {
            taches.forEach(u => {
            if (u.deadline !== null) {
                let deadlineFormatted = new Date(u.deadline)
                let dateObject = {
                    date : deadlineFormatted.getDate(),
                    jour: semaine[deadlineFormatted.getDay()],
                    mois: mois[deadlineFormatted.getMonth()]
                } 
                contenuBtnDeadline = `${dateObject.jour} ${dateObject.date} ${dateObject.mois}`;
            } else {
                contenuBtnDeadline = "Aucune deadline";
            }
            let taskContainer = document.createElement("div");
            taskContainer.classList.add("taskDashboard")
            taskContainer.setAttribute("data-id", u.todo_id) 
            taskContainer.innerHTML = `
            
            <div class="wrapperBodyTask">
                <div>
                    <h4 class="taskBody" data-id=${u.liste_id}>${u.todo_body}</h4>
                    <small>- ${u.liste_titre}</small>
                </div>
                <div class="wrapperDeadlineTask"data-id="${u.todo_id}"> 
                <i class="fa-solid fa-clock"></i>
                    ${contenuBtnDeadline}
                </div>
                
            </div>
            ` 
            container.appendChild(taskContainer)
            })
        } else {
            container.innerHTML = ` 
            <div class="dashbordAucuneTache" 
            style=" color: black; 
                    display: flex; 
                    flex-direction : column;
                    justify-content: center;
                    align-items: center;
                    width: 80%;
                    margin-inline: auto;
                    font-size: 4vh;
                    text-align: center;">
            <div>😭</div>
            <p>Pas de tâches pour le moment.</p>
            </div>`;
        }
    }
}

function NavigationTaskHorizontale(containerPrincipal, sousContainer, elementAffiche, elementTotal, movement) {
    displayingArrows(containerPrincipal)
     if (elementTotal > 3) {
        containerPrincipal.querySelector(".fa-arrow-right").style.setProperty("cursor", "pointer")
        displayingArrows(containerPrincipal)
    }
 
     containerPrincipal.addEventListener("click", async (event) => {
        if (event.target.classList.contains("fa-arrow-right")) {
           if(elementAffiche < elementTotal - 3) {
            elementAffiche+=3;
            containerPrincipal.querySelector(".fa-arrow-left").style.setProperty("cursor", "pointer")
            displayingArrows(containerPrincipal)
            movement-=924
            sousContainer.style.setProperty('--slide', ` ${movement}px` )
                if (elementAffiche >= elementTotal - 3) {
                containerPrincipal.querySelector(".fa-arrow-right").style.removeProperty("cursor")
                containerPrincipal.querySelector(".fa-arrow-right").style.removeProperty("animation")
                displayingArrows(containerPrincipal)
                }
            }
        }
        if (event.target.classList.contains("fa-arrow-left")) {
             if(elementAffiche=== 0) {
                console.log("vous êtes déjà au début de la liste")
            } else {
                containerPrincipal.querySelector(".fa-arrow-right").style.setProperty("cursor", "pointer")
                displayingArrows(containerPrincipal)
                elementAffiche-=3;
                movement+=924
                sousContainer.style.setProperty('--slide', ` ${movement}px`)
                if (elementAffiche=== 0) {
                    containerPrincipal.querySelector(".fa-arrow-left").style.removeProperty("cursor")
                    containerPrincipal.querySelector(".fa-arrow-left").style.removeProperty("animation")
                    displayingArrows(containerPrincipal)
                }
            }         
        }
    
            
})
}


document.addEventListener("mouseover", (event)=> {
    if (event.target.classList.contains("fa-arrow-right") || event.target.classList.contains("fa-arrow-left") && event.target.style.getPropertyValue("cursor")) {
        if (event.target.style.getPropertyValue("cursor")) {
            if (event.target.classList.contains("fa-arrow-right")) {
            event.target.style.setProperty("animation", "arrowMovementRight 1s infinite linear")
            }
             if (event.target.classList.contains("fa-arrow-left")) {
            event.target.style.setProperty("animation", "arrowMovementLeft 1s infinite linear")
            }
        } 
        
    } else {
            event.target.style.removeProperty("animation")
    }
})

document.addEventListener("mouseout", (event)=> {
    if (event.target.classList.contains("fa-arrow-right") || event.target.classList.contains("fa-arrow-left") ) {
            event.target.style.removeProperty("animation")
    }
})

function displayingArrows(containerPrincipal) {
        if (!containerPrincipal.querySelector(".fa-arrow-right").style.getPropertyValue("cursor")) {
        containerPrincipal.querySelector(".fa-arrow-right").style.setProperty("opacity", "0")
    } else {
        containerPrincipal.querySelector(".fa-arrow-right").style.setProperty("opacity", "1")
    }

       if (!containerPrincipal.querySelector(".fa-arrow-left").style.getPropertyValue("cursor")) {
        containerPrincipal.querySelector(".fa-arrow-left").style.setProperty("opacity", "0")
    } else {
        containerPrincipal.querySelector(".fa-arrow-left").style.setProperty("opacity", "1")
    }
}


//voir plus
function voirPlus() {
const allCards = document.querySelectorAll(".taskDashboard")
    if (allCards.length !== 0) {
        allCards.forEach(a => {
            a.addEventListener("mouseenter", () => {
                a.insertAdjacentHTML("afterbegin", `
                    <p class="voirPlus">
                        <i class="fa-solid fa-eye"></i>
                        Voir la liste
                    </p>`
                )
            })
            a.addEventListener("mouseleave", () => {
                a.querySelector(".voirPlus").remove();
            })

            a.addEventListener("click", async () => {
               let listeId = parseInt(a.querySelector(".taskBody").dataset.id);
    
                const response = await fetch("./php/searchList.php", {
                    method: "POST",
                    headers:{"content-type":"application/JSON"},
                    body:JSON.stringify({user_id:user_id})
                })
                const listes = await response.json();
                const listeChoisie = listes.filter(n => n.liste_id === listeId)
                window.localStorage.setItem("liste", JSON.stringify(listeChoisie))
                window.localStorage.setItem("taskHighlight", JSON.stringify(a.querySelector(".wrapperDeadlineTask").dataset.id))
                window.location.href ="index.php"
            })
        })

    } 
}



//graphiques chart.js
async function graphTachesAccomplies() {
    const ctx = document.getElementById('myChart');
    const response = await fetch("./php/tachesFaites.php", {
                method : "POST",
                headers : {"content-type" : "application/json"},
                body : JSON.stringify({user_id:user_id})
            })
        const tachesFaites = await response.json();
        const nbListe = tachesFaites.map(tf => tf.liste);
        const totalTaches = tachesFaites.map(tt => tt.total);
        const tachesAccomplies = tachesFaites.map(ta => ta.done);
        new Chart(ctx, {
        type: 'bar',
        data: {
        labels: [...nbListe],
        datasets: [
            {
            label: 'Tâches totales',
            data: [...totalTaches],
            borderWidth: 1,
            backgroundColor: 'blue',
            },
            {
            label: 'Tâches faites',
            data: [...tachesAccomplies],
            borderWidth: 1,
            backgroundColor: 'green',
            }
    ]
        },
        options: {
        scales: {
            y: {
            beginAtZero: true
            }
        }
        }
    })
  }

async function typeWriterMessage() {
    let h2 = document.querySelector("main h2");
    const welcomeArray = [
    `Bonjour, ${profileInfoList.prenom} ! `,
    `Content de vous revoir, ${profileInfoList.prenom} ! `,
    `Quoi de neuf aujourd'hui, ${profileInfoList.prenom} ? `,
    `Voici les dernières infos, ${profileInfoList.prenom} ! `,
    `Allez au boulot, ${profileInfoList.prenom} ! `,
    `Il est l'heure d'être productif, ${profileInfoList.prenom} ! `
    ]
    let welcomeMsg =  welcomeArray[Math.floor(Math.random() * welcomeArray.length)]
    let i = 0;
    const animTypeWriter = new Promise(resolve => {
    const typewriterId = setInterval(() => {
    if (i<welcomeMsg.length) {
        h2.innerHTML += `<span>${welcomeMsg.charAt(i)}</span>`
        i++
    } else {
        clearInterval(typewriterId)
        resolve(true);
        welcomeMsg = '';
    }
    }, 70);
    })
    await animTypeWriter
}


