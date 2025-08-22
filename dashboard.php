<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Questmaker</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=IM+Fell+English+SC&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lora:ital,wght@0,400..700;1,400..700&family=Lustria&family=Manrope:wght@200..800&family=MedievalSharp&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:wght@490&family=Pixelify+Sans&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
        <!-- librairie Chart.js = nécessaire de la charger en 1er pour éviter les bugs -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
        <!-- mes scripts -->
        <script type="module" src="./scripts/global.js" defer></script>
        <script type="module" src="./scripts/pc.js" defer></script>
        <script type="module" src="./scripts/mobile.js" defer></script>
        <script type="module" src="./scripts/dashboard.js" defer></script>
       
        <!-- version Font Awesome stable -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
       <!-- feuilles de style globale et axé mobile et tablette -->
        <link href="./styles/styles.css" rel="stylesheet">
        <link href="./styles/stylesMobileTablette.css" rel="stylesheet">
        <!-- librairies -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/pikaday/pikaday.js"></script>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css">
    </head>
    
    <body>

           <!-- pop up création tâche et liste sur mobile -->
        <div class="popUpMobile">
           
        </div>
        <!-- fin -->
        <header>
            <a href="index.php"><h1>Questmaker</h1></a>
            <nav>
                <a href="index.php">Accueil</a>
                <a href="dashboard.php">Dashboard</a>
                <span class="identification">Déconnexion</span>
            </nav>
          
        </header>
        <main class="mainDashboard">
            <h2></h2>
            <section class="dashboardContainer">
                
              
                <div class="tachesNonFaites">
                    <div class="toolbarDashboard">
                        <h3>Vos tâches à faire ✍️</h3>
                    </div>
                    <div>
                        <i class="fa-solid fa-arrow-left"></i>
                        <ul>
                            <div class="sousContainerNonFaites">
                            </div>
                        </ul>
                        <i class="fa-solid fa-arrow-right"></i>
                    </div>
                </div>

                <div class="tachesFaites">
                    <div class="toolbarDashboard">
                        <h3>Historique de tâches accomplies ✅</h3>
                    </div>
                        <div class="sousContainerFaites">
                           <canvas id="myChart"></canvas>
                        </div>
                    </div>
                </div>

        
                
            </section>

        </main>
         <div class="menuMobile">
            <a href="index.php"><i class="fa-solid fa-house"></i>Accueil</a>
            <span class="rechercheDeListe"><i class="fa-solid fa-magnifying-glass"></i>Mes listes</span>
            <a href="dashboard.php"><i class="fa-solid fa-table"></i>Dashboard</a>
            <span class="deconnexionMobile"><i class="fa-solid fa-right-from-bracket"></i>Déconnexion</span>
        </div>
    </body>
</html>