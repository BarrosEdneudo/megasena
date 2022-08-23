var state = {
	board: [],
	currentGame: [],
	savedGames: [],
};

function main() {
	readLocalStorage();
	createBoard();
	newGame();
	render();
}

function readLocalStorage() {
	if (!window.localStorage) {
		return;
	}

	var savedGamesFromLocalStorage = window.localStorage.getItem("savedGames");
	if (savedGamesFromLocalStorage) {
		state.savedGames = JSON.parse(savedGamesFromLocalStorage);
	}
}

function writeToLocalStorage() {
	window.localStorage.setItem("savedGames", JSON.stringify(state.savedGames));
}

function deleteLocalStorage() {
	window.localStorage.setItem("savedGames", "");
}

function cleanGames() {
	//esta função apaga todos os jogos já salvos pelo usuário

	deleteLocalStorage();
	state.savedGames = [];

	var ttSavedGames = document.querySelector("#ttSavedGames");
	ttSavedGames.classList.add("hidden");

	newGame();
	render();
}

function deleteGame(event) {
	//esta função apaga um jogo específico, clicado pelo usuário na relação de jogos salvos.

	var indexOfGameToDelete = parseInt(event.currentTarget.id);

	console.log(indexOfGameToDelete);

	state.savedGames.splice(indexOfGameToDelete, 1);
	deleteLocalStorage();
	writeToLocalStorage();

	if (state.savedGames < 1) {
		var ttSavedGames = document.querySelector("#ttSavedGames");
		ttSavedGames.classList.add("hidden");
	}

	render();
}

function addNumber(numberToAdd) {
	if (foraRegras(numberToAdd)) {
		return;
	}
	if (isComplete()) {
		return;
	}
	state.currentGame.push(numberToAdd);
}

function removeNumber(numberToRemove) {
	var newGame = [];
	for (var i = 0; i < state.currentGame.length; i++) {
		if (state.currentGame[i] === numberToRemove) {
			continue;
		}
		newGame.push(state.currentGame[i]);
	}

	state.currentGame = newGame;
	renderBoard();
}

function jaExite(numberToAdd) {
	return state.currentGame.includes(numberToAdd);
}

function isGameSaved(gameToSave) {
	var CurrentSum = 0;
	var SavedSum = 0;

	for (var i = 0; i < gameToSave.length; i++) {
		CurrentSum += gameToSave[i];
	}

	for (var i = 0; i < state.savedGames.length; i++) {
		for (j = 0; j < state.savedGames[i].length; j++) {
			SavedSum += state.savedGames[i][j];

			if (CurrentSum == SavedSum) {
				return true;
			}
		}
		SavedSum = 0;
	}
}

function foraRegras(numberToAdd) {
	if (numberToAdd < 1 || numberToAdd > 60 || jaExite(numberToAdd)) {
		return true;
	}
}

function isComplete() {
	return state.currentGame.length == 6;
}

function resetGame() {
	//esta função apaga os números selecionados pelo usuário
	state.currentGame = [];
	render();
}

function saveGame() {
	var orderedGame = state.currentGame.sort(sortFunction);

	if (isGameSaved(orderedGame)) {
		resetGame();
		return;
	}

	if (isComplete()) {
		state.savedGames.push(orderedGame);

		writeToLocalStorage();
		newGame();
	}

	render();
}

function createBoard() {
	for (var i = 1; i <= 60; i++) {
		state.board.push(i);
	}
}

function newGame() {
	resetGame();
}

function render() {
	renderBoard();
	renderButtons();
	renderSavedGames();
}

function renderBoard() {
	var divBorder = document.querySelector("#board"); //recebe a div
	divBorder.innerHTML = ""; //zera a div
	var ulNumbers = document.createElement("ul"); //cria a lista
	ulNumbers.classList.add("numbers");

	for (var i = 0; i < state.board.length; i++) {
		var currentNumber = state.board[i];
		var liNumber = document.createElement("li"); //cria um item da lista
		liNumber.classList.add("liNumber");

		if (jaExite(currentNumber)) {
			liNumber.classList.add("selectedNumber");
		}

		liNumber.textContent = currentNumber;
		liNumber.addEventListener("click", handleNumberClick);
		ulNumbers.appendChild(liNumber); //adiciona o item à lista
	}
	divBorder.appendChild(ulNumbers);
}

function renderButtons() {
	var btNewGame = document.querySelector("#btNovoJogo");
	btNewGame.addEventListener("click", newGame);

	var btRandomGame = document.querySelector("#btJogoAleatorio");
	btRandomGame.addEventListener("click", createRandomGame);

	var btSaveGame = document.querySelector("#btSalvarJogo");
	if (!isComplete()) {
		btSaveGame.classList.add("hidden");
	} else {
		btSaveGame.classList.remove("hidden");
	}
	btSaveGame.addEventListener("click", saveGame);

	var btZerarGame = document.querySelector("#btZerarJogo");

	if (state.savedGames == "") {
		btZerarGame.classList.add("hidden");
	} else {
		btZerarGame.classList.remove("hidden");
	}
	btZerarGame.addEventListener("click", cleanGames);
}

function createRandomGame() {
	resetGame();
	while (!isComplete()) {
		var randomNumber = Math.ceil(Math.random() * 60);
		addNumber(randomNumber);
	}
	render();
}

function renderSavedGames() {
	var divSavedGames = document.querySelector("#jogosSalvos");
	divSavedGames.innerHTML = "";

	if (state.savedGames.length > 0) {
		var ttSavedGames = document.querySelector("#ttSavedGames");
		ttSavedGames.classList.remove("hidden");
	}

	var ulSavedGames = document.createElement("ul");
	ulSavedGames.classList.add("jogosSalvos");

	for (var i = 0; i < state.savedGames.length; i++) {
		var currentGame = state.savedGames[i];
		var liGame = document.createElement("li");
		liGame.classList.add("jogoSalvo");
		liGame.id = i;
		liGame.addEventListener("click", deleteGame);

		liGame.textContent = currentGame.join("  -  ");
		ulSavedGames.appendChild(liGame);
	}

	divSavedGames.appendChild(ulSavedGames);
}

function handleNumberClick(event) {
	var clickedNumber = parseInt(event.currentTarget.textContent);
	if (jaExite(clickedNumber)) {
		removeNumber(clickedNumber);
		render();
		return;
	}
	addNumber(clickedNumber);

	render();
}

function testFunction() {
	console.log("Função executada");
}

function TODO() {
	console.log("TODO");
}

function sortFunction(a, b) {
	return a - b; //faz com que o array seja ordenado numericamente e de ordem crescente.
}

main();
