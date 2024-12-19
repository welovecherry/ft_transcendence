async function fetchTranslations(language) {
	const response = await fetch(`lang/${language}.json`);
	if (!response.ok) {
		console.error(`Error loading language file: ${language}`);
		return null;
	}
	return response.json();
}

const languageSelector = document.getElementById('languageSelector');

async function updateLanguage() {
	const selectedLanguage = languageSelector.value || 'ko'; // 기본 언어 설정
	const text = await fetchTranslations(selectedLanguage);

	if (!text) return;

	document.querySelector('h1').textContent = text.title;
	document.getElementById('single-player-btn').textContent =
		text.singlePlayer;
	document.getElementById('multi-player-btn').textContent = text.multiPlayer;
	document.getElementById('tournament-btn').textContent = text.tournament;
	document.querySelector("label[for='player1-name']").textContent =
		text.player1Name;
	document.querySelector("label[for='player2-name']").textContent =
		text.player2Name;
	document.querySelector("label[for='player3-name']").textContent =
		text.player3Name;
	document.querySelector("label[for='player4-name']").textContent =
		text.player4Name;
	document.querySelector("label[for='game-speed']").textContent =
		text.gameSpeed;
	document.querySelector("#game-speed option[value='normal']").textContent =
		text.normal;
	document.querySelector("#game-speed option[value='fast']").textContent =
		text.fast;
	document.getElementById('start-game-btn').textContent = text.startGame;
	document.getElementById('reset-game-btn').textContent = text.playAgain;
	document.getElementById('game-result').textContent = text.win;

	// Update placeholder texts using a single key
	document.getElementById('player1-name').placeholder =
		text.playerPlaceholder;
	document.getElementById('player2-name').placeholder =
		text.playerPlaceholder;
	document.getElementById('player3-name').placeholder =
		text.playerPlaceholder;
	document.getElementById('player4-name').placeholder =
		text.playerPlaceholder;
}

// Ensure DOM is loaded before running script
document.addEventListener('DOMContentLoaded', () => {
	languageSelector.addEventListener('change', updateLanguage);
	updateLanguage(); // Initialize default language
});
