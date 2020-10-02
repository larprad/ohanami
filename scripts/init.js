//-------------------------------------------------------------------------
//------------------------GLOBAL VARIABLES---------------------------------
//-------------------------------------------------------------------------

let easterEgg = 0; // Go find what does this mean :p

// Variables initialization
let deck = [];
let cpu_deck = []; 
let player_deck = [];
let player_card_selected;
let cpu_card_selected;
let player_garden = [[],[],[]];
let cpu_garden = [[],[],[]];
let player_trash = [];
let cpu_trash = [];
let player_score = [0, 0, 0];
let player_total_score = 0;
let cpu_score = [0, 0, 0];
let cpu_total_score = 0;
let cardsPlayedThisTurn = 0;
let goldenElement = 'water';
let gamePause = false;
let gameSetNumber = 1;
let offsetY = 18;
let sakuraPrompt = false;
let optionsPrompt = false;

// Game parameters
let water_count = 34;
let grass_count = 35;
let rock_count = 17;
let sakura_count = 34;
let initial_deck_size = 2;
let cardsPlayedByTurn = 1;
let total_cards_count = water_count + grass_count + rock_count + sakura_count;

// Default Ai parameters
let cpu_min_thresh = 10;
let cpu_max_thresh = 110;
let trash_thresh = 30;
let water_coeff = 1;
let sakura_coeff = 1;
let grass_coeff = 1.5;
let rock_coeff = 2;
let sakura_coeff_inc = 0.2;
let goldElement_coeff = 2.5;
let defaultLevel = 'medium';


//-------------------------------------------------------------------------
//----------------------------CREATING DECKS-------------------------------
//-------------------------------------------------------------------------


function sleep(milliseconds) {
    let start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
        }
    }
}

// Building a consistent array of n number of element string.
const elementInitArr = (element, num, arr) => {
    for (let i = 0; i < num; i++) {
        arr.push(element);
    }
    return arr;
}

// Building an array of all elements randomely sorted.
const elementsInit = (arr) => {
    arr = elementInitArr('water', water_count, arr);
    arr = elementInitArr('grass', grass_count, arr);
    arr = elementInitArr('rock', rock_count, arr);
    arr = elementInitArr('sakura', sakura_count, arr);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr
}

// Creating starting deck.
const generateRandomDeck = () => 
{   
    const elementArr = elementsInit([]);
    for (let i = 0; i < elementArr.length; i++) {
        deck[i] = {
            number: i+1,
            card_id: 'none',
            type: elementArr[i],
            selectable: true,
            posY: 0,
        }
    }
    console.log("The deck have been initialized:")
    console.log(deck);
    return deck
}

// Distribute n cards to player from deck.
const distributeNCards = (n, player) => {
    console.log("------------------------------------");
    console.log("-> Distributing " + n + " cards for: " + player);
    const dist_deck = [];
    for (let i = 0; i < n; i++) {
        const cardNum = Math.floor(Math.random()*deck.length) + 1
        displayCard(i, cardNum, player);
        const fullId = 'card' + '_' + player[0] +'_'+ i.toString();
        dist_deck[i] = deck.splice(cardNum-1, 1)[0];
        dist_deck[i].card_id = fullId;
    };
    return dist_deck
}

// return background image url [string] of a card
const getBackground = card => {
    const url = 'url("./ressources/card_' + card.type +'.png")';
    return url;
}

const getColor = card => {
    switch(card.type) {
        case 'water' :
            return 'var(--color-water-700)';
        case 'grass' :
            return 'var(--color-grass-900)';
        case 'sakura' :
            return 'var(--color-sakura-700)';
        case 'rock' :
            return 'var(--color-rock-700)';
        default :
            return '#000'
    }
}

//-------------------------------------------------------------------------
//----------------------------SELECTING OPTIONS----------------------------
//-------------------------------------------------------------------------


 const optionSelect = (optionId) => {
     document.getElementById(optionId).style.border = "3px solid var(--color-sakura-900";
}

 const optionUnselect = (optionId) => {
    document.getElementById(optionId).style.border = "3px solid var(--color-gray-hollow)";
}

const setCpuLevel = (level) => {
    switch (level) {
        case "easy" :
            defaultLevel = "easy";
            cpu_min_thresh = 10;
            cpu_max_thresh = 110;
            trash_thresh = 10;
            water_coeff = 1;
            sakura_coeff = 1;
            grass_coeff = 1;
            rock_coeff = 1.5;
            sakura_coeff_inc = 0;
            goldElement_coeff = 1.2;
            document.getElementById("cpu_level_info_text").innerHTML = "Le Jardinateur est un fainéant !"
            document.getElementById("cpu_level").innerHTML = " Débutant"
            console.log("Cpu level: easy.");
            break;
        case "medium" :
            defaultLevel = "medium";
            cpu_min_thresh = 10;
            cpu_max_thresh = 110;
            trash_thresh = 20;
            water_coeff = 1;
            sakura_coeff = 1.4;
            grass_coeff = 1.5;
            rock_coeff = 2;
            sakura_coeff_inc = 0.1;
            goldElement_coeff = 2;
            console.log("Cpu level: medium.");
            document.getElementById("cpu_level_info_text").innerHTML = "Le Jardinateur s'y connait pas mal en jardinage !"
            document.getElementById("cpu_level").innerHTML = " Main verte"
            break;
        case "hard" :
            defaultLevel = "hard";
            cpu_min_thresh = 10;
            cpu_max_thresh = 110;
            trash_thresh = 30;
            water_coeff = 1;
            sakura_coeff = 1.8;
            grass_coeff = 1.4;
            rock_coeff = 1.6;
            sakura_coeff_inc = 0.2;
            goldElement_coeff = 2.5;
            console.log("Cpu level: hard.");
            document.getElementById("cpu_level_info_text").innerHTML = "Le Jardinateur est la nature incarnée, il vous faudra faire des merveilles pour le battre !"
            document.getElementById("cpu_level").innerHTML = " Mère nature"
            break;
        default :
            defaultLevel = "hard";
            cpu_min_thresh = 10;
            cpu_max_thresh = 110;
            trash_thresh = 30;
            water_coeff = 1;
            sakura_coeff = 1.8;
            grass_coeff = 1.4;
            rock_coeff = 1.6;
            sakura_coeff_inc = 0.2;
            goldElement_coeff = 2.5;
            console.log("Cpu level: hard.");
            document.getElementById("cpu_level_info_text").innerHTML = "Le Jardinateur est la nature incarnée, il vous faudra faire des merveilles pour le battre !"
            document.getElementById("cpu_level").innerHTML = " Mère nature"
            break;
    }
}

const setGameType = (type) => {
    switch (type) {
        case "flash" :
            initial_deck_size = 4;
            cardsPlayedByTurn = 1;
            console.log("Game type: flash.");
            document.getElementById("game_type_info_text").innerHTML = "Vous avez 4 cartes par saisons, et jouez 1 carte par tour.</p><br>C'est une partie rapide, où il faudra compter sur la chance ! <p>"
            document.getElementById("game_type").innerHTML = " Bouture";
            break;
        case "quick" :
            initial_deck_size = 6;
            cardsPlayedByTurn = 2;
            console.log("Game type: quick.");
            document.getElementById("game_type_info_text").innerHTML = "Vous avez 6 cartes par saisons, et jouez 2 cartes par tour.</p><br>C'est un bon compromis entre rapidité et maîtrise de son jardin ! <p>"
            document.getElementById("game_type").innerHTML = " Potager";
            break;
        case "standard" :
            initial_deck_size = 10;
            cardsPlayedByTurn = 2;
            console.log("Game type: standard.");
            document.getElementById("game_type_info_text").innerHTML = "Vous avez 10 cartes par saisons, et jouez 2 cartes par tour.</p><br>C'est le type de partie des vrais jardinniers ! <p>"
            document.getElementById("game_type").innerHTML = " Jardin";
            break;
        default :
            initial_deck_size = 10;
            cardsPlayedByTurn = 2;
            console.log("Game type by default: standard.");
            document.getElementById("game_type_info_text").innerHTML = "Vous avez 10 cartes par saisons, et jouez 2 cartes par tour.</p><br>C'est le type de partie des vrais jardinniers ! <p>"
            document.getElementById("game_type").innerHTML = " Jardin";
            break;
    }
}

const defaultOption = (cpuLevel, gameType) => {
    const typeG = "game_" + gameType;
    const typeC = "cpu_" + cpuLevel;
    optionSelect(typeG);
    optionSelect(typeC);
    setCpuLevel(cpuLevel);
    setGameType(gameType);
}
//-------------------------------------------------------------------------
//--------------------------------DISPLAY----------------------------------
//-------------------------------------------------------------------------

// Display card "num" from deck to player.
const displayCard = (cardId, num, player) => {
    const fullId = 'card_' + player[0] +'_'+ cardId.toString();
    const topNumber = (fullId + "_TN").toString();
    const bottomNumber = (fullId + "_BN").toString();
    console.log(topNumber);
    console.log(bottomNumber);
    document.getElementById(fullId).style.display = 'block';
    if (player[0] == 'p' ) {
        document.getElementById(fullId).innerHTML = '<h1>' + deck[num-1].number + '</h1><h1 class="reverse">' + deck[num-1].number + '</h1>';
        document.getElementById(fullId).style.color = getColor(deck[num-1]);
        document.getElementById(fullId).style.backgroundImage = getBackground(deck[num-1]);
        
    } else {
        document.getElementById(fullId).style.backgroundImage = 'url("./ressources/card_back.png")';
    }
}

// Create card in element.
const createCard = (card, gardenSpot) => {
    const garden = document.getElementById(gardenSpot); 
    garden.style.opacity = "1";
    const gardenCard = document.createElement("DIV");
    garden.appendChild(gardenCard);
    gardenCard.style.backgroundImage = getBackground(card);
    gardenCard.style.zIndex = card.number.toString();
    gardenCard.style.top = card.posY.toString() + '%';
    gardenCard.style.color = getColor(card);
    gardenCard.innerHTML = card.number;
    gardenCard.className = gardenSpot + " drop";
}

const deleteGarden = (gardenNumber, player) => {
    gardenName = 'gard_' + player[0] +'_';
    let gardenId = gardenName + gardenNumber.toString();
    let child = document.getElementById(gardenId).lastElementChild;
    while (child) { 
        document.getElementById(gardenId).removeChild(child); 
        child = document.getElementById(gardenId).lastElementChild; 
    }
}

// Display card from "card_id" to "garden_spot" for Player (OPTI NEEDED)
const displayCardOnGarden = (gardenSpot, card) => {
    const gardenNumber = gardenSpot.slice(-1);
    if (player_garden[gardenNumber][0]) {

        if (card.number < player_garden[gardenNumber][0].number) {    
             
            console.log("Card number is lower than the lowest card of the Garden");
            // Getting Y position of the lower card of the garden 
            const posY = player_garden[gardenNumber][0].posY;
            card.posY = posY - offsetY;

            createCard(card, gardenSpot);

            unselectPlayerCard(card.card_id);
            getCardOnGarden(gardenSpot, card);
            removeCard(card, player_deck);
            cleanCard(card.card_id);
            
        } else if (card.number > player_garden[gardenNumber][player_garden[gardenNumber].length - 1].number) {

            console.log("Card number is bigger than the highest card of the Garden");
            // Getting Y position of the lower card of the garden
            const posY = player_garden[gardenNumber][player_garden[gardenNumber].length - 1].posY;
            card.posY = posY + offsetY;

            createCard(card, gardenSpot);

            unselectPlayerCard(card.card_id);
            getCardOnGarden(gardenSpot, card,'max');
            removeCard(card, player_deck);
            cleanCard(card.card_id);

        } else {
            console.log("Card number can't be placed on the Garden because it's in-between Min & Max Garden values.");
        }
    } else {

        createCard(card, gardenSpot);
        
        unselectPlayerCard(card.card_id);
        getCardOnGarden(gardenSpot, card);
        removeCard(card, player_deck);
        cleanCard(card.card_id);
    }
}

// ajusting vertical position of garden cards
const adjustCardPosY = (garden, player) => {
    for (let i = 0; i < 3; i++) {
        // If garden is not empty...
        gardenSpot = ('gard_' + player[0] + '_' + i).toString();
        if (garden[i].length > 2) {
            if (Math.abs(garden[i][0].posY) > Math.abs(garden[i][garden[i].length - 1].posY)) {
                deleteGarden(i, player);
                garden[i].forEach(x => {
                     x.posY = x.posY + offsetY;
                     createCard(x, gardenSpot);
                });
                console.log("adjusting Y position of garden.");
            } else if (Math.abs(garden[i][0].posY) < Math.abs(garden[i][garden[i].length - 1].posY)) {
                deleteGarden(i, player);
                garden[i].forEach(x => {
                     x.posY = x.posY - offsetY;
                     createCard(x, gardenSpot);
                });
                console.log("adjusting Y position of garden.");
            } else {
                console.log("no need to adjust Y position of garden.")
            }
        }
    }
}

// Display card from "card_id" to "garden_spot" for Cpu (OPTI NEEDED)
const displayCpuCardOnGarden = (gardenSpot, card) => {
    const gardenNumber = gardenSpot.slice(-1);
    if (cpu_garden[gardenNumber][0]) {

        if (card.number < cpu_garden[gardenNumber][0].number) {    
             
            console.log("Card number is lower than the lowest card of the Garden");
            // Getting Y position of the lower card of the garden 
            const posY = cpu_garden[gardenNumber][0].posY;
            card.posY = posY - offsetY;


            createCard(card, gardenSpot);
            getCardOnGarden(gardenSpot, card);
            removeCard(card, cpu_deck);
            cleanCard(card.card_id);
            
        } else if (card.number > cpu_garden[gardenNumber][cpu_garden[gardenNumber].length - 1].number) {

            console.log("Card number is bigger than the highest card of the Garden");
            // Getting Y position of the lower card of the garden
            const posY = cpu_garden[gardenNumber][cpu_garden[gardenNumber].length - 1].posY;
            card.posY = posY + offsetY;

            createCard(card, gardenSpot);
            getCardOnGarden(gardenSpot, card,'max');
            removeCard(card, cpu_deck);
            cleanCard(card.card_id);

        } else {
            console.log("Card number can't be placed on the Garden because it's in-between Min & Max Garden values.");
        }
    } else {

        createCard(card, gardenSpot);
        getCardOnGarden(gardenSpot, card);
        removeCard(card, cpu_deck);
        cleanCard(card.card_id);
    }
}

// Update display to show that a card have been selected
const displayCardSelected = (cardId) => {
    document.getElementById(cardId).style.boxShadow = "0 7px 14px rgba(0,0,0,0.25), 0 7px 7px rgba(0,0,0,0.22)";
    document.getElementById(cardId).style.transform = "translate(0, -3px)"
    document.getElementById("space_player_garden").style.border = "5px solid var(--color-sakura-700)";
    document.getElementById("space_player_garden").style.opacity = '1';
}

// Update display to show that a card have been unselected
const displayCardUnselected = (cardId) => {
    document.getElementById(cardId).style.boxShadow = "var(--box-shadow-big)";
    document.getElementById(cardId).style.transform = "translate(0, 3px)"
    document.getElementById("space_player_garden").style.border = "5px solid var(--color-water-600)";
    document.getElementById("space_player_garden").style.opacity = '0.8';
}

// Remove card from display and clean its content
const cleanCard = (cardId) => {
    document.getElementById(cardId).innerHTML = null;
    document.getElementById(cardId).style.display = 'none';
}

// Remove card from player deck
const removeCard = (card, deck) => {
    deck.splice(deck.indexOf(card),1)
    cardsPlayedThisTurn++;
    console.log("-----------------------------------");
    console.log("Card played this turn: " + cardsPlayedThisTurn);
    console.log("-----------------------------------");
}

// Get card on Garden array (player = string) on beggining or end (pos) of garden array
const getCardOnGarden = (gardenSpot, card, pos) => {
    const gardenNumber = gardenSpot.slice(-1);
    if (pos == 'max') {
        gardenSpot.includes('p') ? player_garden[gardenNumber].push(card) : cpu_garden[gardenNumber].push(card);
        console.log("The following card have been hadded in last position of: " + gardenSpot);
        console.log(card);
    } else {
        gardenSpot.includes('p') ? player_garden[gardenNumber].unshift(card) : cpu_garden[gardenNumber].unshift(card);
        console.log("The following card have been hadded in last position of: " + gardenSpot);
        console.log(card);
    }
}

// Clean card space for both players
const cleanCardSpace = () => {
    for (let i = 0; i < 10; i++) {
        const fullIdPlayer = 'card_p_'+ i.toString();
        const fullIdCpu = 'card_c_'+ i.toString();
        cleanCard(fullIdPlayer);
        cleanCard(fullIdCpu);
    }
    console.log("Cards space display have been cleared.");
}

// Clean garden space for both players
const cleanGardenSpace = () => {
    for (let i = 0; i < 3; i++) {
        let gardenId = 'gard_p_' + i.toString();
        let child = document.getElementById(gardenId).lastElementChild;
        document.getElementById(gardenId).style.opacity = "0.5";
        while (child) { 
        document.getElementById(gardenId).removeChild(child); 
        child = document.getElementById(gardenId).lastElementChild; 
        }
    }
    for (let i = 0; i < 3; i++) {
        let gardenId = 'gard_c_' + i.toString();
        let child = document.getElementById(gardenId).lastElementChild;
        document.getElementById(gardenId).style.opacity = "0.5";  
        while (child) { 
            document.getElementById(gardenId).removeChild(child); 
            child = document.getElementById(gardenId).lastElementChild; 
        }
    }
    document.getElementById("trash_p").innerHTML = '';
    document.getElementById("trash_c").innerHTML = '';
}

// display score
const displayScore = () => {
    document.getElementById("cpu_score_1").innerHTML = cpu_score[0];
    document.getElementById("player_score_1").innerHTML = player_score[0];

    document.getElementById("cpu_score_2").innerHTML = cpu_score[1];
    document.getElementById("player_score_2").innerHTML = player_score[1];

    document.getElementById("cpu_score_3").innerHTML = cpu_score[2];
    document.getElementById("player_score_3").innerHTML = player_score[2];

    document.getElementById("cpu_score_total").innerHTML = cpu_total_score;
    document.getElementById("player_score_total").innerHTML = player_total_score;
}

//-------------------------------------------------------------------------
//----------------------------GAME EVENTS----------------------------------
//-------------------------------------------------------------------------

// Exchange & display Cpu & Player deck
const exchangeDeck = () => {
    let tmp_deck = cpu_deck;   
    cpu_deck = player_deck;
    player_deck = tmp_deck;
    // Display exchanged decks
    for (let i = 0; i < player_deck.length; i++) {
        // Making sure card_id of cpu and player decks remain consistent (kind of dirty fix)
        let tmp_card_id = cpu_deck[i].card_id;   
        cpu_deck[i].card_id = player_deck[i].card_id;
        player_deck[i].card_id = tmp_card_id;

        document.getElementById(cpu_deck[i].card_id).innerHTML = ' ';
        document.getElementById(cpu_deck[i].card_id).style.backgroundImage = 'url("./ressources/card_back.png")';
        document.getElementById(cpu_deck[i].card_id).style.display = 'block';
        
        // document.getElementById(player_deck[i].card_id).innerHTML = player_deck[i].type + ' ' + player_deck[i].number;
        document.getElementById(player_deck[i].card_id).innerHTML = '<h1>' + player_deck[i].number + '</h1><h1 class="reverse">' + player_deck[i].number + '</h1>';
        document.getElementById(player_deck[i].card_id).style.color = getColor(player_deck[i]);
        document.getElementById(player_deck[i].card_id).style.backgroundImage = getBackground(player_deck[i]);
        document.getElementById(player_deck[i].card_id).style.display = 'block';
    }
    console.log("------------------------------------");
    console.log("Cpu and player decks have been exchanged.");
    console.log("------------------------------------");
}

// If end turn conditions are met, cpu is playing its turn;
const endTurn = () => {
    if (cardsPlayedThisTurn >= cardsPlayedByTurn) {
        gamePause = true;
        // showPrompt("cpu_turn");
        aiTurn(cpu_garden, cpu_deck);
        cardsPlayedThisTurn = 0;
        exchangeDeck();
        adjustCardPosY(player_garden, 'player');
        adjustCardPosY(cpu_garden, 'cpu');
        gamePause = false;   
    }
}

const endSet = () => {
    if(player_deck.length == 0 && cpu_deck.length == 0)
    {   
        console.log("-----------------------------------");
        console.log("Set is ended.");
        console.log("-----------------------------------");
        document.getElementById("set_end_tips").innerHTML = generateTips();
        switch (gameSetNumber) {
            case 1 :
                document.getElementById("set_end_text").innerHTML = "C'est la fin de l'Automne !";
                document.getElementById("button_end_set").innerHTML = "Débuter l'Hiver";
                document.getElementById("season_winter").style.display = "block";
                document.getElementById("season_spring").style.display = "none";
                document.getElementById("display_blur").style.display = "block";
                
                break;
            case 2 :
                document.getElementById("set_end_text").innerHTML = "L'hiver est terminé, place à la floraison printanière !";
                document.getElementById("button_end_set").innerHTML = "Le printemps commence";
                document.getElementById("season_winter").style.display = "none";
                document.getElementById("season_spring").style.display = "block";
                document.getElementById("display_blur").style.display = "block";
                
                trash_thresh = 7;
                break;
        }
        player_score[gameSetNumber - 1] = calculScore(player_garden);
        player_total_score = player_score.reduce((x, y) => x + y);
        cpu_score[gameSetNumber - 1] = calculScore(cpu_garden);
        cpu_total_score = cpu_score.reduce((x, y) => x + y);
        displayScore();
        gameSetNumber == 3 ? endGame() : showPrompt("set_end");
    }
}

const generateTips = () => {
    switch (Math.floor(Math.random()*5)) {
        case 0 :
            return "N'oubliez pas de planter quelques cerisiers..."
        case 1 :
            return "Parfois il faut savoir éliminer les mauvaises herbes."
        case 2 :
            return "Pour avoir un beau jardin, il faut veiller à bien l'arroser."
        case 3 :
            return "Quelques rochers seraient parfaits pour égailler votre jardin."
        case 4 :
            return "Il faut cultiver son jardin."
    }
}

const startNewSet = () => {
    gameSetNumber ++
    switch (gameSetNumber) {
        case 2 :
            goldenElement = "grass";
            player_deck = distributeNCards(initial_deck_size, 'player');
            cpu_deck = distributeNCards(initial_deck_size, 'cpu');
            document.getElementsByClassName('winter')[0].style.opacity = "1";
            document.getElementsByClassName('winter')[1].style.opacity = "1";
            gamePause = false;
            break;

        case 3 :
            goldenElement = "rock";
            player_deck = distributeNCards(initial_deck_size, 'player');
            cpu_deck = distributeNCards(initial_deck_size, 'cpu');
            document.getElementsByClassName('spring')[0].style.opacity = "1";
            document.getElementsByClassName('spring')[1].style.opacity = "1";
            gamePause = false;
            break;
    }
}

const endGame = () => {
    document.getElementById("cpu_score_prompt").innerHTML = cpu_total_score
    document.getElementById("player_score_prompt").innerHTML = player_total_score
    if (player_total_score > cpu_total_score) {
        document.getElementById("winner").innerHTML = "Vous avez Gagné !"
        document.getElementById("winner_txt").innerHTML = "Le jardinateur est au sol, il n'a plus de piles."
        document.getElementById("player_win_img").style.display = "block";
        document.getElementById("cpu_win_img").style.display = "none";
        document.getElementById("game_end").style.background = "radial-gradient(circle, rgba(255,255,255,1) 60%, rgba(247,247,233,1) 81%, rgba(255,253,207,1) 100%)";
    } else if (player_total_score < cpu_total_score) {
        document.getElementById("winner").innerHTML = "Victoire du Jardinateur !"
        document.getElementById("winner_txt").innerHTML = "Il va falloir sérieusement bosser votre coup de rateau..."
        document.getElementById("player_win_img").style.display = "none";
        document.getElementById("cpu_win_img").style.display = "block";
        document.getElementById("game_end").style.background = "radial-gradient(circle, rgba(255,255,255,1) 60%, rgba(247,233,233,1) 81%, rgba(255,207,207,1) 100%)";
    } else {
        document.getElementById("winner").innerHTML = "Egalité !"
        document.getElementById("winner_txt").innerHTML = "Impossible de départager vos jardins, ils sont tous les deux magnifiques."
        document.getElementById("game_end").style.background = "#FFF";
    }
    document.getElementById("display_blur").style.display = "block";
    showPrompt("game_end");
}

const aiTurn = (garden, deck) => {
    console.log("------------------------------------")
    console.log("Starting Cpu's turn.")
    console.log("------------------------------------")
    for (let i = 0; i <cardsPlayedByTurn; i++) {
        aiPlayCard(garden, deck);
    }
    console.log("------------------------------------")
    console.log("Cpu's turn is over.")
    console.log("------------------------------------")
}

// Reset all data
const resetGame = () => {
    player_deck.map(x => displayCardUnselected(x.card_id));
    console.log("------------------------------------");
    console.log("Reset on going.");
    deck = [];
    cpu_deck = []; 
    player_deck = [];
    player_garden = [[],[],[]];
    cpu_garden = [[],[],[]];
    player_card_selected = null;
    cpu_card_selected = null;
    player_trash = [];
    cpu_trash = [];
    cardsPlayedThisTurn = 0;
    gameSetNumber = 1;
    goldenElement = 'water';

    clearScore();
    displayScore();
    console.log("Player and cpu deck have been cleared.");
    cleanCardSpace();
    cleanGardenSpace();
    hidePrompt("set_end");
    hidePrompt("game_end");
    hidePrompt("sakura_prompt");
    document.getElementById("display_blur").style.display = "none";
    sakuraPrompt = false;
}

// clear score
const clearScore = () => {
    document.getElementsByClassName('autumn')[0].style.opacity = "0.5";
    document.getElementsByClassName('autumn')[1].style.opacity = "0.5";
    document.getElementsByClassName('spring')[0].style.opacity = "0.5";
    document.getElementsByClassName('spring')[1].style.opacity = "0.5";
    document.getElementsByClassName('winter')[0].style.opacity = "0.5";
    document.getElementsByClassName('winter')[1].style.opacity = "0.5";
    player_score = [0, 0, 0];
    player_total_score = 0;
    cpu_score = [0, 0, 0];
    cpu_total_score = 0;
}

// Select one card 
const selectPlayerCard = (cardId) => {
    const card = player_deck.find(x => x.card_id == cardId);
    if (card.selectable == false) {
        unselectPlayerCard(card.card_id);
        card.selectable = true;
    } else if (card.selectable && !player_card_selected) {
        card.selectable = false;
        player_card_selected = card;
        displayCardSelected(cardId);
        console.log("The following card have been selected: ");
        console.log(card);
    } else {
        unselectPlayerCard(player_card_selected.card_id);
        card.selectable = false;
        player_card_selected = card;
        displayCardSelected(cardId);
        console.log("The following card have been selected: ");
        console.log(card);
    }
}

// Unselect one card
const unselectPlayerCard = (cardId) => {
    const card = player_deck.find(x => x.card_id == cardId);
    player_card_selected = null;
    displayCardUnselected(cardId);
    card.selectable = true;
    console.log("The following card have been unselected: ");
    console.log(card);
}

// Discard a card
const discardCard = (card, trash) => {
    if (trash == 'trash_p') {
        player_trash.push(card); 
        document.getElementById(trash).innerHTML = player_trash.length.toString();
        unselectPlayerCard(card.card_id);
        removeCard(card, player_deck);
    } else {
        cpu_trash.push(card);
        document.getElementById(trash).innerHTML = cpu_trash.length.toString();
        removeCard(card, cpu_deck);
    }
    cleanCard(card.card_id);
}

// Return garden score
const calculScore = (garden) => {
    let totalPoints = 0;
    if (gameSetNumber == 1) {
        const reducer = (acc, currentCard) => currentCard.type == 'water' ? acc + 3 : acc + 0;
        for (let i = 0; i < 3; i++) {
            if (garden[i].length != 0) {
                totalPoints = totalPoints + garden[i].reduce(reducer, 0);
            }
        }
    } else if (gameSetNumber == 2) {
        const reducer1 = (acc, currentCard) => currentCard.type == 'water' ? acc + 3 : acc + 0;
        const reducer2 = (acc, currentCard) => currentCard.type == 'grass' ? acc + 4 : acc + 0;
        for (let i = 0; i < 3; i++) {
            if (garden[i].length != 0) {
                totalPoints = totalPoints + garden[i].reduce(reducer1, 0) + garden[i].reduce(reducer2, 0);
            }
        }
    } else {
        const reducer1 = (acc, currentCard) => currentCard.type == 'water' ? acc + 3 : acc + 0;
        const reducer2 = (acc, currentCard) => currentCard.type == 'grass' ? acc + 4 : acc + 0;
        const reducer3 = (acc, currentCard) => currentCard.type == 'rock' ? acc + 7 : acc + 0;
        const reducer4 = (acc, currentCard) => currentCard.type == 'sakura' ? acc + 1 : acc + 0;
        let sakuraNumber = 0;
        for (let i = 0; i < 3; i++) {
            if (garden[i].length != 0) {
                totalPoints = totalPoints + garden[i].reduce(reducer1, 0) + garden[i].reduce(reducer2, 0) + garden[i].reduce(reducer3, 0);
                sakuraNumber = sakuraNumber + garden[i].reduce(reducer4, 0);
                console.log("There are " + garden[i].reduce(reducer4, 0) + " sakura in the garden n° " + i )
            }
        }
        totalPoints += sakuraScore(sakuraNumber);
        console.log("Total of " + sakuraNumber + " sakura." );
        console.log("Sakura score is: " + sakuraScore(sakuraNumber));
    }
    return totalPoints;
}

const sakuraScore =  (num) => {
    if (num >= 15) {
        return 120;
    } else {
        switch (num) {
            case 0 :
                return 0;
            case 1 :
                return 1;
            case 2 :
                return 3;
            case 3 :
                return 6;
            case 4 :
                return 10;
            case 5 :
                return 15;
            case 6 :
                return 21;
            case 7 :
                return 28;
            case 8 :
                return 36;
            case 9 :
                return 45;
            case 10 :
                return 55;
            case 11 :
                return 66;
            case 12 :
                return 78;
            case 13 :
                return 91;
            case 14 :
                return 105;
        }
    }
}

const newGame = () => {
    resetGame();
    setCpuLevel(defaultLevel);
    generateRandomDeck();
    player_deck = distributeNCards(initial_deck_size, 'player');
    cpu_deck = distributeNCards(initial_deck_size, 'cpu');
    console.log("------------------------------------");
    console.log("Distributing have been done.");
    console.log("Player Deck:");
    console.log(player_deck);
    console.log("Cpu Deck:");
    console.log(cpu_deck);
    document.getElementsByClassName('autumn')[0].style.opacity = "1";
    document.getElementsByClassName('autumn')[1].style.opacity = "1";
    gamePause = false;
}


//-------------------------------------------------------------------------
//--------------------------IA SCRIPTS-------------------------------------
//-------------------------------------------------------------------------

const minDeckCard = (deck) => {
    let minCard = deck[0];
    for (let i = 0; i < deck.length-1; i++) {
        if (minCard.number > deck[i+1].number) {
            minCard = deck[i+1];
        }
    }
    return minCard;
}

const maxDeckCard = (deck) => {
    let maxCard  = deck[0];
    for (let i = 0; i < deck.length-1; i++) {
        if (maxCard.number < deck[i+1].number) {
            maxCard = deck[i+1];
        }
    }
    return maxCard;
}

const selectCardsBelow = (deck, card) => {
    let cardsBelow = [];
    for (let i = 0; i < deck.length; i++) {
        deck[i].number < card.number ? cardsBelow.push(deck[i]) : null;
    }
    return cardsBelow;
}

const selectCardsAbove = (deck, card) => {
    let cardsAbove = [];
    for (let i = 0; i < deck.length; i++) {
        deck[i].number > card.number ? cardsAbove.push(deck[i]) : null;
    }
    return cardsAbove;
}

const selectClosestGardenCard = (garden, card) => {
    const lowestGardenCard = minDeckCard(garden);
    const highestGardenCard = maxDeckCard(garden);
    if (card.number < lowestGardenCard.number) {
        return lowestGardenCard;
    } else if (card.number > highestGardenCard.number) {
        return highestGardenCard;
    } else {
        return false;
    }
}

const getCoeffElement = card => {
    if (card.type == goldenElement) {
        return goldElement_coeff;
    } else {
        switch (card.type) {
            case 'water':
                return water_coeff;
            case 'grass':
                return grass_coeff;
            case 'rock':
                return rock_coeff;
            case 'sakura':
                return sakura_coeff;
        }
    }
}

const calculateCardPoints = (garden, card) => {
    console.log(" ");
    console.log("Checking points for card: ");
    console.log(card);
    const cardPoints = [0, 0, card];
    let points = 0;
    let closestCard;
    for (let i = 0; i < 3; i++) {
        console.log("Checking garden n°" + i + ":");
        if(garden[i].length > 0) {
            console.log("garden " + i + " is not empty.")
            closestCard = selectClosestGardenCard(garden[i], card);
            if (closestCard) {
                points = Math.floor((1000 / Math.abs(closestCard.number - card.number))) * getCoeffElement(card);
                console.log("Puting the selected card on this garden would make: " + points + " points.")
            } else {
                console.log("Not possible to put card on garden");
            }
        } else {
            console.log("garden n°" + i + " is empty.")
            if (card.number < (total_cards_count / 2 + 3) && card.number > (total_cards_count / 2 - 3))
            {
                points = Math.floor(1000 / Math.abs(card.number - total_cards_count / 2)) * getCoeffElement(card) 
            } else if (card.number < 60) {
                points = Math.floor((1000 / card.number)) * getCoeffElement(card);
            } else {
                points = Math.floor((1000 / ((total_cards_count + 1) - card.number))) * getCoeffElement(card);
            }
            
            console.log("Puting the selected card on this garden would make: " + points + " points.")
        }
        if (points > cardPoints[0]) {
            cardPoints[0] = points;
            cardPoints[1] = i;
            cardPoints[2] = card;
            console.log("At this point, this is the best option for this card.");
        }
    }
    // Trashing card if not good enough
    cardPoints[0] < trash_thresh ? cardPoints[1] = 4 : null;
    return cardPoints;
}

// return bestCard [points, garden number, card] to be played on given deck/garden context.
const selectBestCard = (garden, deck) => {
    console.log("------------------------------------")
    console.log("Selecting best card to be played.")
    console.log("------------------------------------")
    let cardsPoint = deck.map(x => calculateCardPoints(garden, x));
    console.log("Deck points:");
    console.log(cardsPoint);
    const bestCard = cardsPoint.reduce((highCard, candidate) => highCard[0] > candidate[0] ? highCard : candidate);
    console.log("With " + bestCard[0] + " points, the best card is:")
    console.log(bestCard[2])
    return bestCard;

}

const aiPlayCard = (garden, deck) => {
    const bestCard = selectBestCard(garden, deck);
    let gardenSpot;
    // Checking if card is trash
    if (bestCard[1] == 4) {
        gardenSpot = 'trash_c';
        discardCard(bestCard[2], gardenSpot);
        console.log("Card was not good enough and have been trashed");
    } else {
        gardenSpot = "gard_c_" + bestCard[1].toString();
        displayCpuCardOnGarden(gardenSpot, bestCard[2]);
        // If sakura selected, sakura coeff increase
        bestCard[2].type == "sakura" ? Math.round(sakura_coeff += sakura_coeff_inc) : null;
    }
}

//-------------------------------------------------------------------------
//----------------------------PROMPTS--------------------------------------
//-------------------------------------------------------------------------

const showPrompt = promptId => {
    document.getElementById(promptId).style.display = 'block';
}

const showPromptFlex = promptId => {
    document.getElementById(promptId).style.display = 'flex';
}

const hidePrompt = promptId => {
    document.getElementById(promptId).style.display = 'none';
    document.getElementById("display_blur").style.display = "none"
}

//-------------------------------------------------------------------------
//------------------------ONCLICK EVENT------------------------------------
//-------------------------------------------------------------------------

document.getElementById("sakura_deco").onclick = () => {
    easterEgg ++
    easterEgg > 10 ? document.body.style.backgroundImage = "url(./ressources/arches.png), linear-gradient(to right,#" + (Math.floor(Math.random()*65000)).toString(16) +',#'+(Math.floor(Math.random()*65000)).toString(16) + ')'  : null;
}

// ----------------------- Menu

document.getElementById("button_menu").onclick = () => {
    resetGame();
    showPromptFlex("menu_page");
}

document.getElementById("menu_new_game").onclick = () => {
    hidePrompt("options_box");
    optionsPrompt = false;
    hidePrompt("menu_page");
    showPrompt("game_start");
    document.getElementById("display_blur").style.display = "block";
}

document.getElementById("button_game_start").onclick = () => {
    hidePrompt("game_start");
    newGame();
}

document.getElementById("button_reset").onclick = () => {
    resetGame();
    document.getElementById("display_blur").style.display = "block";
    showPrompt("game_start")
}

document.getElementById("button_instructions").onclick = () => {
    document.getElementById("display_blur").style.display = "block";
    showPrompt("instructions_prompt")
}

document.getElementById("close_instructions").onclick = () => {
    document.getElementById("display_blur").style.display = "none";
    hidePrompt("instructions_prompt")
}

document.getElementById("button_sakura").onclick = () => {
    if(!sakuraPrompt) {
        showPrompt("sakura_prompt");
    } else {
        hidePrompt("sakura_prompt");
    }
    sakuraPrompt = !sakuraPrompt;
}

document.getElementById("instructions").onclick = () => {
    document.getElementById("display_blur").style.display = "block";
    showPrompt("instructions_prompt")
}

// ------------------------Options

document.getElementById("options").onclick = () => {
    if(!optionsPrompt) {
        showPrompt("options_box");
    } else {
        hidePrompt("options_box");
    }
    optionsPrompt = !optionsPrompt;
}

document.getElementById("cpu_easy").onclick = () => {
    optionUnselect("cpu_medium");
    optionUnselect("cpu_hard");
    optionSelect("cpu_easy");
    setCpuLevel("easy")
}

document.getElementById("cpu_medium").onclick = () => {
    optionUnselect("cpu_easy");
    optionUnselect("cpu_hard");
    optionSelect("cpu_medium");
    setCpuLevel("medium")
}

document.getElementById("cpu_hard").onclick = () => {
    optionUnselect("cpu_easy");
    optionUnselect("cpu_medium");
    optionSelect("cpu_hard");
    setCpuLevel("hard");
}

document.getElementById("game_flash").onclick = () => {
    optionUnselect("game_quick");
    optionUnselect("game_standard");
    optionSelect("game_flash");
    setGameType("flash");
}

document.getElementById("game_quick").onclick = () => {
    optionUnselect("game_flash");
    optionUnselect("game_standard");
    optionSelect("game_quick");
    setGameType("quick");
}

document.getElementById("game_standard").onclick = () => {
    optionUnselect("game_quick");
    optionUnselect("game_flash");
    optionSelect("game_standard");
    setGameType("standard");
}

document.getElementById("options_valid").onclick = () => {
    hidePrompt("options_box");
    optionsPrompt = false;
}


//----------------------- Player Deck

document.getElementById("card_p_0").onclick = () => {
    !gamePause ? selectPlayerCard("card_p_0") : console.log("You can't click here!");
}
document.getElementById("card_p_1").onclick = () => {
    !gamePause ? selectPlayerCard("card_p_1") : console.log("You can't click here!");
}
document.getElementById("card_p_2").onclick = () => {
    !gamePause ? selectPlayerCard("card_p_2") : console.log("You can't click here!");
}
document.getElementById("card_p_3").onclick = () => {
    !gamePause ? selectPlayerCard("card_p_3") : console.log("You can't click here!");
}
document.getElementById("card_p_4").onclick = () => {
    !gamePause ? selectPlayerCard("card_p_4") : console.log("You can't click here!");
}
document.getElementById("card_p_5").onclick = () => {
    !gamePause ? selectPlayerCard("card_p_5") : console.log("You can't click here!");
}
document.getElementById("card_p_6").onclick = () => {
    !gamePause ? selectPlayerCard("card_p_6") : console.log("You can't click here!");
}
document.getElementById("card_p_7").onclick = () => {
    !gamePause ? selectPlayerCard("card_p_7") : console.log("You can't click here!");
}
document.getElementById("card_p_8").onclick = () => {
    !gamePause ? selectPlayerCard("card_p_8") : console.log("You can't click here!");
}
document.getElementById("card_p_9").onclick = () => {
    !gamePause ? selectPlayerCard("card_p_9") : console.log("You can't click here!");
}

//----------------------- Player Garden

document.getElementById("gard_p_0").onclick = () => {
    if (player_card_selected) {
        displayCardOnGarden("gard_p_0", player_card_selected);
        endTurn();
        endSet();
    } else {
        console.log("You can't click here!");
    }
}
document.getElementById("gard_p_1").onclick = () => {
    if (player_card_selected) {
        displayCardOnGarden("gard_p_1", player_card_selected);
        endTurn();
        endSet();
    } else {
        console.log("You can't click here!")
    }
}
document.getElementById("gard_p_2").onclick = () => {
    if (player_card_selected) {
        displayCardOnGarden("gard_p_2", player_card_selected);
        endTurn();
        endSet();
    } else {
    console.log("You can't click here!");
    }
}
document.getElementById("trash_p").onclick = () => {
    if (player_card_selected) {
        discardCard(player_card_selected, 'trash_p');
        endTurn();
        endSet();
    } else {
    console.log("You can't click here!");
    }
}

//----------------------- Prompt

document.getElementById("button_end_set").onclick = () => {
    hidePrompt("set_end");
    startNewSet();
}
document.getElementById("button_end_match_retry").onclick = () => {
    hidePrompt("game_end");
    resetGame();
    showPrompt("game_start");
}
document.getElementById("button_end_match_menu").onclick = () => {
    hidePrompt("game_end");
    resetGame();
    showPromptFlex("menu_page");
}

//-------------------------------------------------------------------------
//-------------------------------INIT--------------------------------------
//-------------------------------------------------------------------------

defaultOption(defaultLevel, "standard");

