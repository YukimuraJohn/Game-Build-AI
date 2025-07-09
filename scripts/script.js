const form = document.getElementById('form');
const ApiKeyInput = document.getElementById('apiKey');
const GameSelect = document.getElementById('gameSelect');
const QuestionInput = document.getElementById('questionInput');
const AskButton = document.getElementById('askButton');
const AiResponse = document.getElementById('AiResponse');

const enviarPergunta = async (event) => {
  console.log('Enviando pergunta...');
}

form.addEventListener('submit', enviarPergunta);