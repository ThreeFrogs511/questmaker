import { générerListe, msgInfo, afficherListeRecenteParDefaut} from "./global.js";


let toDoListContainer = document.querySelector(".toDoListContainer") 
let btnSort = document.querySelector(".fa-arrow-up-z-a")
let menuFilter = document.querySelector(".menuFilter")
let currentFilterHandler = null;
let currentSortHandler = null;
let searchIcon = document.querySelector(".searchIcon")
let inputSearchSpan = document.querySelector(".searchInput")
let searchContainer = document.querySelector(".searchBar")


// objet global pour gérer le filtre et tri en même temps. Chaque propriété est un interrupteur sauf "content"
// qui contient une liste temporaire pour la réutiliser si besoin
let listeCustom = {
    deadline: false,
    faites: false,
    nonFaites: false,
    sort: false,
    content: null
};





// affichage du sous menu de filtre

export function affichageMenuFiltre(btnFilter) { 
    btnFilter.addEventListener("click", () => {
        if (!document.querySelector(".fa-plus").classList.contains("on") && 
            document.querySelector(".toDoListContainer").innerHTML !== msgInfo.msgAucuneTache) {
            menuFilter.classList.toggle("hidden")     
        }
    })

    document.addEventListener("click", (event) => {
        if (!menuFilter.contains(event.target) && !btnFilter.contains(event.target) ) {
            menuFilter.classList.add("hidden")
            
        }
    })
}

// icône filtre bleu si filtre activé
function iconeFiltreBleu() {
if (listeCustom["deadline"] || listeCustom["faites"] || listeCustom["nonFaites"]) {
    document.querySelector(".fa-filter").classList.add("on")
} else if (!listeCustom["deadline"] && !listeCustom["faites"] && !listeCustom["nonFaites"]) {
    document.querySelector(".fa-filter").classList.remove("on")
}}

// fct qui gère le système de filtre
export function systemeDeFiltre() {
    if (currentFilterHandler) { menuFilter.removeEventListener("click", currentFilterHandler);}
    currentFilterHandler = function handleClickFilter(event) {
        if (event.target.classList.contains("filterDeadline")) {
            event.target.classList.toggle("filterChoisiEnBleu")
            filtreDeadline(event);
            iconeFiltreBleu()
        }
            //SYSTEME DE FILTRE
        if (event.target.classList.contains("filterDone")) {
            jonglerEntreFiltresEtTri(event, listeCustom, "nonFaites", "faites", 1)
        } else if (event.target.classList.contains("filterNotDone")) {
            jonglerEntreFiltresEtTri(event, listeCustom, "faites", "nonFaites", 0)
        }
    }
    menuFilter.addEventListener("click", currentFilterHandler);
}


function filtreDeadline(event) {
    if (event.target.classList.contains("filterChoisiEnBleu")) {
            //si filtre "deadline" activé, on teste si d'autres filtres ne sont pas déjà activés
            toDoListContainer.innerHTML = ""
            if (listeCustom["faites"]) {
                    listeCustom["nonFaites"] = false;
                    let listeAvecDeadline = [];
                    const liste = JSON.parse(window.localStorage.getItem("liste"))
                    if (listeCustom["sort"]) {
                        const listeAvecDeadlineTri = liste.filter(l => l.deadline !== null && l.done === 1)
                        listeCustom["content"] = [...listeAvecDeadlineTri];
                        
                        listeAvecDeadline = listeAvecDeadlineTri.sort((a, b) => {
                            const dateA = a.deadline ? Date.parse(a.deadline) : Infinity;
                            const dateB = b.deadline ? Date.parse(b.deadline) : Infinity;
                            return dateA - dateB;})
                            générerListe(listeAvecDeadline);
                    } else {
                        listeAvecDeadline = liste.filter(l => l.deadline !== null && l.done === 1)
                        générerListe(listeAvecDeadline);
                        listeCustom["content"] = [...listeAvecDeadline];
                        
                    }
                    
                    listeCustom["deadline"] = true;
                    
            }
            if (listeCustom["nonFaites"]) {
                    let listeAvecDeadline = [];
                    listeCustom["faites"] = false;
                    const liste = JSON.parse(window.localStorage.getItem("liste"))
                    if (listeCustom["sort"]) {
                        const listeAvecDeadlineTri = liste.filter(l => l.deadline !== null && l.done === 0)
                         listeCustom["content"] = [...listeAvecDeadlineTri];
                         
                         listeAvecDeadline = listeAvecDeadlineTri.sort((a, b) => {
                            const dateA = a.deadline ? Date.parse(a.deadline) : Infinity;
                            const dateB = b.deadline ? Date.parse(b.deadline) : Infinity;
                            return dateA - dateB;})
                            générerListe(listeAvecDeadline);
                    } else {
                        listeAvecDeadline = liste.filter(l => l.deadline !== null && l.done === 0)
                        listeCustom["content"] = [...listeAvecDeadline];
                       
                        générerListe(listeAvecDeadline);
                    }
                    
                    listeCustom["deadline"] = true;
                    
                    
            }
            if (!listeCustom["faites"] && !listeCustom["nonFaites"]) {
                // si pas d'autres filtres
                    let listeAvecDeadline = []; 
                    const liste = JSON.parse(window.localStorage.getItem("liste"))
                    if (listeCustom["sort"]) {
                        const listeAvecDeadlineTri = liste.filter(l => l.deadline !== null)
                        listeCustom["content"] = [...listeAvecDeadlineTri]
                        
                        listeAvecDeadline = listeAvecDeadlineTri.sort((a, b) => {
                            const dateA = a.deadline ? Date.parse(a.deadline) : Infinity;
                            const dateB = b.deadline ? Date.parse(b.deadline) : Infinity;
                            return dateA - dateB;})
                            générerListe(listeAvecDeadline);
                    } else {
                        listeAvecDeadline = liste.filter(l => l.deadline !== null)
                        générerListe(listeAvecDeadline);
                        listeCustom["content"] = [...listeAvecDeadline]
                       
                    }
                    
                    listeCustom["deadline"] = true;
                  
                    
            }
           
        } else {
            // si on désactive le filtre "deadline", on check si il n'y a pas d'autre filtres activés ou de tri
            listeCustom["deadline"] = false;
            toDoListContainer.innerHTML = ""
             if (listeCustom["faites"]) {
                let listeSansDeadline = [];
                 listeCustom["nonFaites"] = false;
                const liste = JSON.parse(window.localStorage.getItem("liste"))
                if (listeCustom["sort"]) {
                    const listeSansDeadlineTri = liste.filter(l => l.done === 1)
                    listeCustom["content"] = [...listeSansDeadlineTri];
                  
                    listeSansDeadline = listeSansDeadlineTri.sort((a, b) => {
                            const dateA = a.deadline ? Date.parse(a.deadline) : Infinity;
                            const dateB = b.deadline ? Date.parse(b.deadline) : Infinity;
                            return dateA - dateB;})
                    générerListe(listeSansDeadline);
                } else {
                    listeSansDeadline = liste.filter(l => l.done === 1)
                    générerListe(listeSansDeadline);
                    listeCustom["content"] = [...listeSansDeadline];
                    
                }
                
            }
            if (listeCustom["nonFaites"]) {
                let listeSansDeadline = [];
                 listeCustom["faites"] = false;
                const liste = JSON.parse(window.localStorage.getItem("liste"))
                  if (listeCustom["sort"]) {
                    const listeSansDeadlineTri = liste.filter(l => l.done === 0)
                    listeCustom["content"] = [...listeSansDeadlineTri];
                   
                    listeSansDeadline = listeSansDeadlineTri.sort((a, b) => {
                            const dateA = a.deadline ? Date.parse(a.deadline) : Infinity;
                            const dateB = b.deadline ? Date.parse(b.deadline) : Infinity;
                            return dateA - dateB;})
                    générerListe(listeSansDeadline);
                } else {
                    listeSansDeadline = liste.filter(l => l.done === 0)
                    générerListe(listeSansDeadline);
                    listeCustom["content"] = [...listeSansDeadline];
                    

                }
            }
            if (!listeCustom["faites"] && !listeCustom["nonFaites"]) {
                // 0 filtre, on reset et on ressort la liste vierge
                  if (listeCustom["sort"]) {
                    const listeViergeSansTri = JSON.parse(window.localStorage.getItem("liste"))
                    let listeViergeAvecTri = listeViergeSansTri.sort((a, b) => {
                            const dateA = a.deadline ? Date.parse(a.deadline) : Infinity;
                            const dateB = b.deadline ? Date.parse(b.deadline) : Infinity;
                            return dateA - dateB;})
                    générerListe(listeViergeAvecTri)
                } else {
                    générerListe(JSON.parse(window.localStorage.getItem("liste")))
                }
                listeCustom["content"] = null;
              
                listeCustom["deadline"] = false;
            }
            
          
        }
}

//système de tri de deadline 
export function systemeDeTri() {
    if (currentSortHandler) {
        btnSort.removeEventListener("click", currentSortHandler)
    }
    currentSortHandler = function handleClickSort() { 
        if (!document.querySelector(".fa-plus").classList.contains("on") && 
            document.querySelector(".toDoListContainer").innerHTML !== msgInfo.msgAucuneTache) {
            btnSort.classList.toggle("on")
            // le bouton activé, on lance l'algo
            if (btnSort.classList.contains("on")) {
                listeCustom["sort"] = true;
                toDoListContainer.innerHTML = "";
                if (listeCustom["content"] === null) {
                    const list = JSON.parse(window.localStorage.getItem("liste"))
                    const listSorted = list.sort((a, b) => {
                        const dateA = a.deadline ? Date.parse(a.deadline) : Infinity;
                        const dateB = b.deadline ? Date.parse(b.deadline) : Infinity;
                        return dateA - dateB;})
                    générerListe(listSorted)
                } else {
                    let list = [...listeCustom["content"]];
                    const listSorted = list.sort((a, b) => {
                        const dateA = a.deadline ? Date.parse(a.deadline) : Infinity;
                        const dateB = b.deadline ? Date.parse(b.deadline) : Infinity;
                        return dateA - dateB;})
                    générerListe(listSorted)
                }
                
            } else {
                listeCustom["sort"] = false;
                toDoListContainer.innerHTML = "";
                if (listeCustom["content"] === null) {
                    générerListe(JSON.parse(window.localStorage.getItem("liste")))
                } else {
                    générerListe(listeCustom.content)
                    console.log(listeCustom)
                
                }
                
            
            }
        }
    };
btnSort.addEventListener("click", currentSortHandler)
}


// ouverture de l'input de recherche de liste
export function ouvertureBarreDeRechercheDeListe() { 
    searchIcon.addEventListener("click",  async () => {
    !document.querySelector(".fa-plus").classList.contains("on") && searchContainer.classList.toggle("searchOpen")
    if (searchContainer.classList.contains("searchOpen")) {
        // écrire une promesse pour gérer l'apparition de l'input pour faire la suite
        const inputDisplay = 
            new Promise((resolve) => {
                setTimeout(() => {
                    inputSearchSpan.innerHTML = `<input type="text" name="search" id="search" class="search" placeholder="Appuyez sur Entrée pour choisir une liste...">`;
                    document.querySelector(".fa-rectangle-xmark").style.setProperty("opacity", "1");
                    document.querySelector(".fa-rectangle-xmark").style.setProperty("cursor", "pointer");
                    resolve();}
                    , 150)
            })
        await inputDisplay;
        let searchBarInput = document.querySelector(".search")
        if (searchBarInput) {
            searchBarInput.focus();
            chercherDesCorrespondancesDeListe(searchBarInput)
        }
       
    } else {
        inputSearchSpan.innerHTML= '';   
        document.querySelector(".fa-rectangle-xmark").style.setProperty("opacity", "0");
        document.querySelector(".fa-rectangle-xmark").style.removeProperty("cursor");

    }

    })   
}

// fonction utilisée pour gérer l'input de l'user dans la barre de recherche de liste
function chercherDesCorrespondancesDeListe(searchBarInput) {
    // on capte l'input
    searchBarInput.addEventListener("input", async () => {
        if (searchBarInput.value.trim()) {
            // on reset les filtres et tri précédents si besoin 
            !menuFilter.classList.contains("hidden") && menuFilter.classList.add("hidden");
            btnSort.classList.contains("on") && btnSort.classList.remove("on");
            const user_id = JSON.parse(window.localStorage.getItem("user_id"))
            const response = await fetch("./php/searchList.php", {
                method:"POST",
                headers:{"content-type":"application/JSON"},
                body: JSON.stringify({user_id:user_id})
            });
            const listeStmts = await response.json();
            //on filtre la liste pr ne garder que les correspondances
            const correspondance = listeStmts.filter(liste => 
            liste.liste_titre.toLowerCase() === (searchBarInput.value.toLowerCase()))
            // si 0 correspondance = msg d'erreur, sinon on efface le container et on liste toutes les tâches associées
            if (correspondance.length>0 ) {
                toDoListContainer.innerHTML = ""
                générerListe(correspondance)
            } else {
                toDoListContainer.innerHTML = `<div class="aucuneListeTrouvee"><div>😟</div>Aucune liste trouvée. Veuillez réessayer.</div>`
            }
            searchBarInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter" && correspondance.length>0) {
                    inputSearchSpan.innerHTML = '';
                    window.localStorage.setItem("liste", JSON.stringify(correspondance))
                    searchContainer.classList.remove("searchOpen")
                    document.querySelector(".fa-rectangle-xmark").style.setProperty("opacity", "0");
                    document.querySelector(".fa-rectangle-xmark").style.removeProperty("cursor");
                }
            })
           
        } else {
            //si l'user efface le champ, on réaffiche la liste par défaut
            toDoListContainer.innerHTML = "";
            afficherListeRecenteParDefaut();
        }
            
    })
    //pour annuler la recherche
     if (document.querySelector(".fa-rectangle-xmark") !== null) {
            document.querySelector(".searchBarContainer").addEventListener("click", (event)=> {
                if (event.target.classList.contains("fa-rectangle-xmark")) {
                    inputSearchSpan.innerHTML = '';
                    toDoListContainer.innerHTML = "";
                    afficherListeRecenteParDefaut();
                    searchContainer.classList.remove("searchOpen")
                    event.target.style.setProperty("opacity", "0");
                    event.target.style.removeProperty("cursor");
                }
            })
        }
}


// fonction pour jongler entre le système de filtre et le système de tri
function jonglerEntreFiltresEtTri(event, listeCustom, antagoniste, actuel, number) {
    event.target.classList.toggle("filterChoisiEnBleu")
    let notDone = event.target.classList.contains("filterDone") ? event.target.nextElementSibling : event.target.previousElementSibling;
    notDone.classList.contains("filterChoisiEnBleu") && notDone.classList.remove("filterChoisiEnBleu");
    if (event.target.classList.contains("filterChoisiEnBleu")) {
        listeCustom[antagoniste] = false; // on désactive le filtre antagoniste
        toDoListContainer.innerHTML = ""
        // si le filtre "deadline" est déjà activé
        if (listeCustom["deadline"]) {
            const liste = JSON.parse(window.localStorage.getItem("liste"))
            let listeTachesFaites = [];
            // on teste si le tri n'est pas déjà activé
            if (listeCustom["sort"]) {
                const listeTachesFaitesTri = liste.filter(l => l.done === number && l.deadline !== null)
                listeCustom["content"] = [...listeTachesFaitesTri];
                listeTachesFaites = listeTachesFaitesTri.sort((a, b) => {
                const dateA = a.deadline ? Date.parse(a.deadline) : Infinity;
                const dateB = b.deadline ? Date.parse(b.deadline) : Infinity;
                return dateA - dateB;})
            } else {
                listeTachesFaites = liste.filter(l => l.done === number && l.deadline !== null)
                listeCustom["content"] = [...listeTachesFaites];
            }
            listeCustom[actuel] = true; // on active le filtre dans l'objet
            iconeFiltreBleu()
            générerListe(listeTachesFaites)
        } else {
            // si filtre "deadline" est non activé
            let listeTachesFaites = [];
            const liste = JSON.parse(window.localStorage.getItem("liste"))
            // on teste si le tri n'est pas déjà activé
            if (listeCustom["sort"]) {
                const listeTachesFaitesTri= liste.filter(l => l.done === number)
                listeCustom["content"] = [...listeTachesFaitesTri];
                listeTachesFaites = listeTachesFaitesTri.sort((a, b) => {
                const dateA = a.deadline ? Date.parse(a.deadline) : Infinity;
                const dateB = b.deadline ? Date.parse(b.deadline) : Infinity;
                return dateA - dateB;})
            } else {
                listeTachesFaites = liste.filter(l => l.done === number)
                listeCustom["content"] = [...listeTachesFaites];
            }
            listeCustom[actuel] = true;
            iconeFiltreBleu()
            générerListe(listeTachesFaites)
        }
    } else {
        //si on désactive le filtre "tâches faites", on teste si "deadline" n'est pas activé
        toDoListContainer.innerHTML = ""
        let listeDeadline = []
        listeCustom[actuel] = false;
        if (listeCustom["deadline"]) {
            const liste = JSON.parse(window.localStorage.getItem("liste"))
            if (listeCustom["sort"]) {
                const listeDeadlineTri = liste.filter(l => l.deadline !== null)
                listeCustom["content"] = [...listeDeadlineTri];
                
                listeDeadline = listeDeadlineTri.sort((a, b) => {
                const dateA = a.deadline ? Date.parse(a.deadline) : Infinity;
                const dateB = b.deadline ? Date.parse(b.deadline) : Infinity;
                return dateA - dateB;})
            } else {
                    listeDeadline= liste.filter(l => l.deadline !== null)
                    listeCustom["content"] = [...listeDeadline];
                    
            }
            générerListe(listeDeadline)
            iconeFiltreBleu()
        } else {
            // si 0 filtre, on reset et ressort la liste vierge MAIS on teste si le tri n'est pas encore activé
            if (listeCustom["sort"]) {
                const liste = JSON.parse(window.localStorage.getItem("liste"))
                let listeViergeAvecTri = liste.sort((a, b) => {
                const dateA = a.deadline ? Date.parse(a.deadline) : Infinity;
                const dateB = b.deadline ? Date.parse(b.deadline) : Infinity;
                return dateA - dateB;})
                générerListe(listeViergeAvecTri)
            } else {
                const liste = JSON.parse(window.localStorage.getItem("liste"))
                générerListe(liste)
            }
            listeCustom["content"] = null;
            iconeFiltreBleu()
        }
    }
}



export function supprimerLaListe() {
    document.querySelector(".fa-trash").addEventListener("click", async () => {
        if (!document.querySelector(".fa-plus").classList.contains("on") && getComputedStyle(document.querySelector(".fa-bars")).getPropertyValue("display") === "none") {
            let confirmation = confirm("Êtes-vous sûr de vouloir supprimer cette liste ?");
            if (confirmation) {
                const response = await fetch("./php/deleteList.php", {
                    method: "POST",
                    headers:{"content-type":"application/JSON"},
                    body: JSON.stringify({liste_id: document.querySelector(".titleList").dataset.id})
                })
                    const feedback = await response.json();
                    if (feedback['success']) {
                        window.localStorage.removeItem("liste");
                        document.querySelector(".toDoListContainer").innerHTML = '';
                        document.querySelector(".titleList").value = "";
                        location.reload(true);
                    } else {
                        console.log("bug suppression")
                    };
            }
        }
    })
}
