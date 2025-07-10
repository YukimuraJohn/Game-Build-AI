const form = document.getElementById('form');
const ApiKeyInput = document.getElementById('apiKey');
const GameSelect = document.getElementById('gameSelect');
const QuestionInput = document.getElementById('questionInput');
const AskButton = document.getElementById('askButton');
const aiResponse = document.getElementById('aiResponse');

const markdownConverter = (text) => {
  const converter = new showdown.Converter();
  return converter.makeHtml(text);
}

// AIzaSyC4luDYNlNXxj4-V5pIxRKpdQkHsfh93HQ
const perguntarIA = async (question, game, apiKey) => {
  const model = 'gemini-2.0-flash';
  const urlIA = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const questionModel = `
    ## Especialidade
    Você é um especialista assistente para o jogo ${game}.
    
    ## Tarefa
    Você deve responder as perguntas do usuário sobre o jogo ${game} com base no seu conhecimento, estratégias e mecânicas do jogo, builds e dicas de forma clara e objetiva, sem rodeios.

    ## Regras
    - Se você não souber a resposta, responda "Desculpe, não sei a resposta para essa pergunta." e não tente inventar uma resposta para agradar o usuário.
    - Se a pergunta não for sobre o jogo ${game}, responda "Desculpe, essa pergunta não é sobre o jogo ${game}." e não tente responder.
    - Considere utilizar o nomes do itens e campeões oficiais que estão presentes no jogo em português, a menos que o usuário tenha perguntado especificamente sobre o nome em inglês.
    - Considere sempre a data atual ${new Date().toLocaleDateString('pt-BR')} para responder as perguntas, não é necessário informar a data, apenas utilize-a para responder a pergunta.
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responda itens que você não tenha certeza de que existe no patch atual, sempre busque informações atualizadas.

    ## Resposta
    - Economize na resposta, seja direto e objetivo. Responda apenas o necessário para responder a pergunta do usuário. Evite respostas longas e complexas.
    - Responda em markdown.
    - Não há necessidade de se apresentar ou dizer que é um assistente, apenas responda a pergunta do usuário.

    ## Exemplo de resposta
    pergunta do usuário: "Qual é a melhor build para a Ahri mid ?"
    resposta: A build mais atual é: \n\n **Itens**: \n\n coloque os itens aqui. \n\n **Runas**: \n\n coloque as runas aqui. \n\n **Feitiços**: \n\n coloque os feitiços aqui. \n\n **Dicas**: \n\n coloque as dicas aqui. \n\n **Combos**: \n\n coloque os combos aqui. \n\n **Counters**: \n\n coloque os counters aqui.

    ---

    Aqui está a pergunta do usuário: ${question}
  `;

  const contents = [{
    role: 'user',
    parts: [{
      text: questionModel
    }]
  }]

  const tools = [{
    google_search: {}
  }]

  const response = await fetch(urlIA, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents,
      tools
    })
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;

};

const enviarPergunta = async (event) => {
  event.preventDefault();
  const apiKey = ApiKeyInput.value;
  const game = GameSelect.value;
  const question = QuestionInput.value;


  if (!apiKey || !game || !question) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  AskButton.disabled = true;
  AskButton.textContent = 'Perguntando...';
  AskButton.classList.add('loading');

  try {
    const text = await perguntarIA(question, game, apiKey);
    aiResponse.querySelector('.response-content').innerHTML = markdownConverter(text);
    aiResponse.classList.remove('hidden');
  } catch (error) {
    console.error('Erro ao enviar pergunta:', error);
    // aiResponse.textContent = 'Erro ao enviar pergunta. Por favor, tente novamente.';
  } finally {
    AskButton.disabled = false;
    AskButton.textContent = 'Perguntar';
    AskButton.classList.remove('loading');
  }
}

form.addEventListener('submit', enviarPergunta);