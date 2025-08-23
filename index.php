<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Questmaker</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=IM+Fell+English+SC&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lora:ital,wght@0,400..700;1,400..700&family=Lustria&family=Manrope:wght@200..800&family=MedievalSharp&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:wght@490&family=Pixelify+Sans&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
        <!-- feuilles de style globale et axé mobile et tablette -->
        <link href="./styles/styles.css" rel="stylesheet">
        <link href="./styles/stylesMobileTablette.css" rel="stylesheet">
         <!-- mes scripts -->
        <script type="module" src="./scripts/global.js" defer></script>
        <script type="module" src="./scripts/pc.js" defer></script>
        <script type="module" src="./scripts/toolbar.js" defer></script>
        <script type="module" src="./scripts/mobile.js" defer></script>
        <!-- version Font Awesome stable -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
        <!-- librairies -->
        <script src="https://cdn.jsdelivr.net/npm/pikaday/pikaday.js"></script>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css">
    </head>
    <body>
        <!-- container dynamique d'action pour tâche et liste sur mobile -->
        <div class="popUpMobile">
           
        </div>
        <!-- fin -->        
        <div class="globalWrapper">
            <header>
                <a href="index.php"><h1>Questmaker</h1></a>
                <nav>
                    <a href="index.php">Accueil</a>
                    <a href="dashboard.php">Dashboard</a>
                    <span class="identification">Déconnexion</span>
                </nav>
                <div class="hamburger">
                    <i class="fa-solid fa-bars"></i>
                </div>
            </header>
            <main>
                <section class="champToDo">
                    <div class="toolBar">
                        <div><input type="text" class="titleList" maxlength="25" placeholder="Ma nouvelle liste" value=""></div>
                        <div class="iconToolBar">
                            <i class="fa-solid fa-filter"></i>
                                <div class="menuFilter hidden">
                                    <div class="filterDeadline filterOption">Filtrer par deadline </div>
                                    <div class="filterDone filterOption">Filtrer par tâches faites </div>
                                    <div class="filterNotDone filterOption">Filtrer par tâches non faites</div>
                                </div>
                            <i class="fa-solid fa-arrow-up-z-a"></i>
                            <i class="fa-solid fa-plus"></i>
                            <i class="fa-solid fa-trash"></i>
                        </div>
                        <!-- menu pour mobile tool bar-->
                         <div id="barsContainer">
                            <i class="fa-solid fa-bars"></i> 
                        </div>
                        <!-- fin -->
                        <div class="searchBarContainer">
                            <i class="fa-solid fa-rectangle-xmark"></i>
                            <div class="searchBar">
                                <span class="searchInput"></span>
                                <i class="fa-solid fa-magnifying-glass searchIcon"></i>         
                            </div>
                        </div>
                    </div>
                    <div class="taskSetUpContainer">
                        <input type="text" class="taskInput" id="taskInput" name="taskInput" placeholder="Nouvelle tâche" minlength="1" maxlength="50" required autofocus>
                    </div>
                </section>
                <ul class="toDoListContainer"> </ul>
            </main>
        </div>
    </body>

    <!-------------------------------------- MOBILE ONLY ----------------------------------------->
        <!-- menu nav mobile -->
        <div class="menuMobile">
            <a href="index.php"><i class="fa-solid fa-house"></i>Accueil</a>
            <span class="rechercheDeListe"><i class="fa-solid fa-magnifying-glass"></i>Mes listes</span>
            <a href="dashboard.php"><i class="fa-solid fa-table"></i>Dashboard</a>
            <span class="deconnexionMobile"><i class="fa-solid fa-right-from-bracket"></i>Déconnexion</span>
        </div>
      

        <!-- menu toolbar mobile -->
        <div class="iconToolBarMobile">
            <div id="filtrer">
                <i class="fa-solid fa-filter no-hover"></i> Filtrer
            </div>
            <div id="tri">
                <i class="fa-solid fa-arrow-up-z-a no-hover"></i> Trier
            </div>
            <div id="new">
                <i class="fa-solid fa-plus no-hover"></i></span>Nouvelle tâche </span>
            </div>
            <div id="liste">
                <i class="fa-solid fa-list"></i></span>Nouvelle liste</span>
            </div>
            <div id="titreListe">
                <i class="fa-solid fa-pen-to-square"></i></span>Modifier la liste</span>
            </div>
            <div id="trash">
                <i class="fa-solid fa-trash no-hover"></i> Supprimer la liste
            </div>
            </div>
        </div>

</html>
