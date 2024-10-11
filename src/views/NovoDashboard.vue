<template>
    <body>
      <div class="header">
        <h1>Saber+</h1>
        <div>
        <button class="simulado-button" @click="startSimuladoUm" :disabled="userActivities.simuladosUmRealizado === 1">1º Simulado</button>
        <button class="simulado-button" @click="startSimuladoDois" :disabled="userActivities.simuladosUmRealizado === 0 || userActivities.simuladosDoisRealizado === 1">2º Simulado</button>
        <button @click="toggleAtividadesPopup">Minha atividade</button>
        <button @click="handleLogout">Sair</button>
        </div>
      </div>
      <div class="content">
    <p>Flashcards:</p>
    <div class="cards-container">
      <button class="arrow left" @click="scrollLeft"><i class="fas fa-chevron-left"></i></button>

      <div class="cards" id="cards">
        <!-- Gerar os flashcards como activycards -->
        <div class="activycard" v-for="(flashcard, index) in flashcards" :key="index" @click="showFlashcard(index)">
          <div class="card-text">Flashcard {{ index + 1 }}</div> <!-- Mostra o número do flashcard -->
        </div>
      </div>
      <button class="arrow right" @click="scrollRight"><i class="fas fa-chevron-right"></i></button>
    </div>
  </div>
    </body>

    <div v-if="currentFlashcard" class="overlay"></div>

    <!-- Pop-up do Flashcard -->
    <div v-if="currentFlashcard !== null" class="flashcard-popup">
      <div v-if="!showBack">
        <div class="flashcard-front">
          <p>{{ currentFlashcard.enunciado }}</p>
          <button @click="flipCard">Girar</button>
        </div>
      </div>
      <div v-else>
        <div class="flashcard-back">
          <p>{{ currentFlashcard.resposta }}</p>
          <button @click="handleRemember('nao')">Não lembrei</button>
          <button @click="handleRemember('lembrei')">Lembrei</button>
        </div>
      </div>
    </div>

    <!-- Sobreposição do Simulado -->
    <div v-if="showSimulado" class="overlay"></div>

    <!-- Pop-up do Simulado -->
<div v-if="showSimulado" class="simulado-popup">
  <div class="scontent">
    <h1>Simulado</h1>
    <p v-for="(text, index) in getQuestionTexts" :key="index" class="question-textt">{{ text }}</p>
    <div class="options">
      <button v-for="(option, index) in currentQuestion.alternativas" :key="index" @click="submitAnswer(option)" class="option-button">
        {{ option }}
      </button>
    </div>
    <button @click="desistirSimulado" class="quit-button">Desistir</button>
  </div>
</div>

<!-- Pop-up de Resumo do Simulado -->
<div v-if="showSummary" class="overlay"></div>
<div v-if="showSummary" class="modal">
    <h2>Resumo do Simulado</h2>
    <h1>{{ correctAnswers }}/{{ totalQuestions }}</h1>
    <p>Muito bem! Você completou o simulado, agora podemos trabalhar juntos nos assuntos.</p>
    <p>Feche essa janela e comece a usar os <i>flashcards</i>!</p>
    <button @click="closeSummary">Fechar</button>
</div>

<!-- Pop-up de Atividades -->
<div v-if="showAtividades" class="atividades-popup">
  <div class="atividades-content">
    <h2>Minhas Atividades</h2>
    <p>1º Simulado: {{ userActivities.simuladosUmRealizado ? 'Feito.' : 'Não Fez.' }}</p>
    <p>Respostas corretas: {{ userActivities.respostasSimuladoUmCorretas + '.' }}</p>
    <p>Respostas incorretas: {{ userActivities.respostasSimuladoUmIncorretas + '.' }}</p>
    <p>2º Simulado: {{ userActivities.simuladosDoisRealizado ? 'Feito.' : 'Não fez.' }}</p>
    <p>Respostas corretas: {{ userActivities.respostasSimuladoDoisCorretas + '.' }}</p>
    <p>Respostas incorretas: {{ userActivities.respostasSimuladoDoisIncorretas + '.' }}</p>
    <p>Flashcards:</p>
    <p>Flashcards - Lembrei: {{ userActivities.flashcardLembrei + '.' }}</p>
    <p>Flashcards - Não lembrei: {{ userActivities.flashcardNaoLembrei + '.' }}</p>
    <button @click="toggleAtividadesPopup" class="btn btn-close">Fechar</button>
  </div>
</div>

</template>

<script>
import axios from 'axios'; // Importa o axios

const API_URL = 'http://3.138.85.177:8080/api';
const TIME_INTERVAL = 30000; // 10 segundos
const MAX_FLASHCARDS = 90;

export default {
  name: 'UserDashboard',
  
  data() {
    return {
      inactivityTimeout: 60 * 60 * 1000, // 15 minutos de inatividade
      showSimulado: false,
      showSummary: false,
      showAtividades: false,
      currentQuestionIndex: 0,
      currentQuestion: null,
      userAnswers: [],
      totalQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      userActivities: {
        simuladosUmRealizado: 0,
        respostasSimuladoUmCorretas: 0,
        respostasSimuladoUmIncorretas: 0,
        simuladosDoisRealizado: 0,
        respostasSimuladoDoisCorretas: 0,
        respostasSimuladoDoisIncorretas: 0,
        flashcardsRealizados: 0,
        flashcardLembrei: 0,
        flashcardNaoLembrei: 0,
    },
      flashcards: [],
      currentFlashcard: null,
      currentFlashcardIndex: null,
      showBack: false,
      flashcardCooldowns: {},
      questionsFromAPI: [], // Armazena as questões vindas da API
      flashcardsFromAPI: [],
      currentSimulado: null,
      limiteFlashcards: MAX_FLASHCARDS,
      notRememberedFlashcards: [],
      currentTime: '',
      lastTimeDifferenceCalculation: null,
    };
  },
  computed: {
    getQuestionTexts() {
      return [
        this.currentQuestion?.enunciadoUm,
        this.currentQuestion?.enunciadoDois,
        this.currentQuestion?.enunciadoTres,
        this.currentQuestion?.enunciadoQuatro,
        this.currentQuestion?.enunciadoCinco,
        this.currentQuestion?.enunciadoSeis,
        this.currentQuestion?.enunciadoSete,
        this.currentQuestion?.enunciadoOito,
        this.currentQuestion?.enunciadoNove,
      ].filter(Boolean);
    },
  },

  mounted() {
  this.checkSimuladoStatus();
  this.carregarFlashcards();
  this.loadFlashcardsFromLocalStorage();
  this.loadNotRememberedFlashcards();
  this.startUpdateLastExit();
  this.getUserLastExitTimeInterval(); // Atualiza a última saída antes de atualizar a hora atual
  setTimeout(() => {
    this.loadFlashcardsBasedOnTimeDifference();
  }, 100); // aguarda 100ms para garantir que a última saída foi atualizada
},

  methods: {
    loadFlashcardsBasedOnTimeDifference() {
  const timeDifference = this.calculateTimeDifference();
  if (this.lastTimeDifferenceCalculation !== null && timeDifference <= this.lastTimeDifferenceCalculation) {
    return;
  }
  this.lastTimeDifferenceCalculation = timeDifference;

  const flashcardsToLoad = Math.min(timeDifference, this.limiteFlashcards - this.flashcards.length);

  // Verifica se já existem flashcards armazenados no localstorage
  const storedFlashcards = localStorage.getItem('flash');
  if (storedFlashcards) {
    this.flashcards = JSON.parse(storedFlashcards);
  }

  // Carrega os flashcards adicionais com base no tempo decorrido
  for (let i = 0; i < flashcardsToLoad; i++) {
    this.loadNextFlashcard();
    location.reload();
  }
  this.updateLastExit();
},
    calculateTimeDifference() {
      const lastExitTime = localStorage.getItem('ultima_saida_hora');
      const currentTime = this.updateCurrentTime();
      if (lastExitTime && currentTime) {
        const differenceInMinutes = this.getMinutesDifference(lastExitTime, currentTime);
        return differenceInMinutes;
      } else {
        console.error('Erro ao calcular a diferença de tempo.');
      }
    },
    getMinutesDifference(lastTime, currentTime) {
    try {
      const lastExitDate = new Date(`1970-01-01T${lastTime}:00`);
      const currentDate = new Date(`1970-01-01T${currentTime}:00`);
      const diffMs = currentDate - lastExitDate;
      return Math.floor(diffMs / 60000);
    } catch (error) {
      console.error('Erro ao calcular a diferença de tempo:', error);
    }
  },
  updateLastExit() {
    try {
      const userEmail = localStorage.getItem('email');
      if (userEmail) {
        axios.put(`${API_URL}/user/update-last-exit?email=${userEmail}`)
          .then(() => console.log('Última saída atualizada'))
          .catch(error => console.error('Erro ao atualizar última saída:', error));
      }
    } catch (error) {
      console.error('Erro ao atualizar última saída:', error);
    }
  },

  updateCurrentTime() {
    try {
      const now = new Date();
      now.setHours(now.getHours() + 3);
      const horas = now.getHours().toString().padStart(2, '0');
      const minutos = now.getMinutes().toString().padStart(2, '0');
      const horaMinuto = `${horas}:${minutos}`;
      console.log(`Hora atual: ${horaMinuto}`);
      return horaMinuto;
    } catch (error) {
      console.error('Erro ao atualizar hora atual:', error);
    }
  },

  startUpdateLastExit() {
    try {
      this.getUserLastExitTime();
      setInterval(this.updateLastExit, TIME_INTERVAL);
    } catch (error) {
      console.error('Erro ao iniciar atualização de última saída:', error);
    }
  },

  startUpdateCurrentTime() {
    try {
      setInterval(this.updateCurrentTime, TIME_INTERVAL);
    } catch (error) {
      console.error('Erro ao iniciar atualização de hora atual:', error);
    }
  },

  getUserLastExitTime() {
    try {
      const userEmail = localStorage.getItem('email');
      if (userEmail) {
        axios.get(`${API_URL}/user/by-email?email=${userEmail}`)
          .then(response => {
            const ultimaSaida = new Date(response.data.ultimaSaida);
            const horas = ultimaSaida.getHours().toString().padStart(2, '0');
            const minutos = ultimaSaida.getMinutes().toString().padStart(2, '0');
            const horaMinuto = `${horas}:${minutos}`;
            localStorage.setItem('ultima_saida_hora', horaMinuto);
            console.log(`Última saída: ${horaMinuto}`);
          })
          .catch(error => console.error('Erro ao obter última saída:', error));
      }
    } catch (error) {
      console.error ('Erro ao obter última saída:', error);
    }
  },
  getUserLastExitTimeInterval() {
    try {
      setInterval(this.getUserLastExitTime, TIME_INTERVAL);
    } catch (error) {
      console.error('Erro ao iniciar intervalo de última saída:', error);
    }
  },
    scrollLeft() {
      document.getElementById('cards').scrollBy({
        left: -150,
        behavior: 'smooth',
      });
    },
    scrollRight() {
      document.getElementById('cards').scrollBy({
        left: 150,
        behavior: 'smooth',
      });
    },
    carregarFlashcards() {
  axios.get('http://3.138.85.177:8080/api/flashcards')
    .then(response => {
      this.flashcardsFromAPI = response.data; // Armazena todos os flashcards recebidos da API
      console.log('Flashcards carregados do banco de dados:', this.flashcardsFromAPI);
      this.limiteFlashcards = this.flashcardsFromAPI.length;
      
      // Se o número de flashcards carregados for maior que o limite, ajusta o array
      if (this.flashcards.length > this.limiteFlashcards) {
        this.flashcards = this.flashcards.slice(0, this.limiteFlashcards);
      }
    })
    .catch(error => {
      console.error('Erro ao carregar flashcards:', error);
    });
},
    checkSimuladoStatus() {
      const userEmail = localStorage.getItem('email'); // Obtém o email do usuário
      if (userEmail) {
        axios.get(`http://3.138.85.177:8080/api/user/by-email?email=${userEmail}`)
          .then((response) => {
            const { simuladosUmRealizado } = response.data;
            this.userActivities.simuladosUmRealizado = simuladosUmRealizado;
            
            // Somente inicia os flashcards se o simulado 1 tiver sido realizado
            if (simuladosUmRealizado === 1) {
              this.startFlashcardInterval();
            } else{
              this.flashcards = [];
            }
          })
          .catch((error) => {
            console.error('Erro ao buscar status do simulado:', error);
          });
      }
    },
    startFlashcardInterval() {
  const storedNextFlashcardTime = localStorage.getItem('nextFlashcardTime');
  const currentTime = Date.now();
  let timeUntilNextFlashcard = 60000; // 15 minutos de intervalo por padrão

  // Se existir um tempo armazenado no localStorage, calcule o tempo restante
  if (storedNextFlashcardTime) {
    const storedTime = parseInt(storedNextFlashcardTime, 10);
    timeUntilNextFlashcard = storedTime - currentTime;
    if (timeUntilNextFlashcard < 0) {
      timeUntilNextFlashcard = 0; // Se o tempo já passou, exibir imediatamente o próximo flashcard
    }
  }

  // Verifica se o tempo decorrido é maior que o intervalo de tempo definido
  const timeDifference = this.calculateTimeDifference();
  if (timeDifference > timeUntilNextFlashcard / 60000) {
    this.loadFlashcardsBasedOnTimeDifference();
  }

  setTimeout(() => {
    this.loadNextFlashcard(); // Função para carregar o próximo flashcard

    // Defina um novo tempo para o próximo flashcard
    const newNextFlashcardTime = Date.now() + 60000; // Próximo intervalo de 15 minutos
    localStorage.setItem('nextFlashcardTime', newNextFlashcardTime);

    // Continue chamando o intervalo após exibir um flashcard
    this.startFlashcardInterval();
  }, timeUntilNextFlashcard);
},

loadNextFlashcard() {
    if (this.flashcards.length >= this.limiteFlashcards || this.flashcardsFromAPI.length === 0) {
      console.log('Todos os flashcards foram carregados ou limite atingido');
      return;
    }

    if (this.notRememberedFlashcards.length > 0) {
      const nextFlashcard = this.notRememberedFlashcards.shift();
      this.flashcards.push(nextFlashcard);
      this.saveNotRememberedFlashcardsToLocalStorage();
      console.log('Flashcard não lembrado carregado:', nextFlashcard);
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.flashcardsFromAPI.length);
    const nextFlashcard = this.flashcardsFromAPI[randomIndex];

    this.flashcards.push(nextFlashcard);
    this.saveFlashcardsToLocalStorage();
    this.flashcardsFromAPI.splice(randomIndex, 1);
    console.log('Flashcard carregado:', nextFlashcard);
  },

    saveFlashcardsToLocalStorage() {
      localStorage.setItem('flash', JSON.stringify(this.flashcards));
      console.log('LocalStorage "flash" atualizado:', JSON.parse(localStorage.getItem('flash')));
    },

    loadFlashcardsFromLocalStorage() {
      const storedFlashcards = localStorage.getItem('flash');
      if (storedFlashcards) {
        this.flashcards = JSON.parse(storedFlashcards);
        
      }
      console.log('LocalStorage "flash":', JSON.parse(localStorage.getItem('flash')));
    },
    
    getAvailableFlashcards() {
      const availableFlashcards = this.flashcards.filter((_, index) => !this.flashcardCooldowns[index] || this.flashcardCooldowns[index] === 0);
      
      if (availableFlashcards.length === 0) {
        // Se todas as questões estiverem em cooldown, reinicialize os cooldowns
        this.resetAllCooldowns();
        return this.flashcards;
      }

      return availableFlashcards;
    },

    resetAllCooldowns() {
      for (let key in this.flashcardCooldowns) {
        this.flashcardCooldowns[key] = 0;
      }
    },

    updateCooldowns() {
      for (let key in this.flashcardCooldowns) {
        if (this.flashcardCooldowns[key] > 0) {
          this.flashcardCooldowns[key]--;
        }
      }
    },

    showFlashcard(index) {
  const userEmail = localStorage.getItem('email'); // Pegue o email do localStorage
  const flashcardId = this.flashcards[index].id; // Pega o ID do flashcard selecionado
  if (userEmail) {
    // Verifique se o 1º Simulado foi realizado
    if (this.userActivities.simuladosUmRealizado === 1) {
      // Requisição GET para pegar os dados do flashcard do usuário
      axios.get(`http://3.138.85.177:8080/api/flashcards/?id=${flashcardId}`)
        .then((response) => {
          const { id, enunciado, resposta } = response.data;

          // Atualiza o flashcard atual com os dados recebidos
          this.currentFlashcard = { id, enunciado, resposta };

          this.currentFlashcardIndex = index;

          this.showBack = false;
        })
      axios.get(`http://3.138.85.177:8080/api/user/by-email?email=${userEmail}`)
        .then((response) => {
          console.log('Dados do flashcard:', response.data);
          const { flashcardLembrei, flashcardQuaseNaoLembrei, flashcardNaoLembrei } = response.data;
          
          // Armazene os valores no localStorage
          localStorage.setItem('flashcardLembrei', flashcardLembrei);
          localStorage.setItem('flashcardQuaseNaoLembrei', flashcardQuaseNaoLembrei);
          localStorage.setItem('flashcardNaoLembrei', flashcardNaoLembrei);
        })
        .catch((error) => {
          console.error('Erro ao buscar dados do flashcard:', error);
        });
    } else {
      alert("Você precisa realizar o 1º Simulado antes de ver os flashcards.");
    }
  } else {
    console.error('Nenhum email de usuário encontrado no localStorage');
  }
},

    flipCard() {
      this.showBack = !this.showBack;
    },

    saveNotRememberedFlashcardsToLocalStorage() {
    localStorage.setItem('notRememberedFlashcards', JSON.stringify(this.notRememberedFlashcards));
  },

  // Função para carregar flashcards não lembrados do localStorage
  loadNotRememberedFlashcards() {
    const storedNotRememberedFlashcards = localStorage.getItem('notRememberedFlashcards');
    if (storedNotRememberedFlashcards) {
      this.notRememberedFlashcards = JSON.parse(storedNotRememberedFlashcards);
    }
  },

    handleRemember(rememberType) {
  const userEmail = localStorage.getItem('email');
  let key = '';
  let value = parseInt(localStorage.getItem(`flashcard${rememberType.charAt(0).toUpperCase() + rememberType.slice(1)}`)) + 1;

  if (rememberType === 'lembrei') {
    key = 'flashcardLembrei';
  } else if (rememberType === 'nao') {
    key = 'flashcardNaoLembrei';

    const notRememberedCard = {
        id: this.currentFlashcard.id,
        enunciado: this.currentFlashcard.enunciado,
        resposta: this.currentFlashcard.resposta,
      };
      this.notRememberedFlashcards.push(notRememberedCard);
      this.saveNotRememberedFlashcardsToLocalStorage();
  }

  value = parseInt(localStorage.getItem(key)) || 0;
  value += 1;

  if (userEmail && key) {
    // Requisição PUT para atualizar o campo correspondente no banco de dados
    axios.put(`http://3.138.85.177:8080/api/user/updateField?email=${userEmail}`, {
      chave: key,
      valor: value.toString(), // Incrementa o valor
    })
    .then(() => {
      // Atualize o localStorage com o novo valor
      localStorage.setItem(key, value);

      // Gerencia o cooldown do flashcard e remove o flashcard atual
      this.flashcardCooldowns[this.currentFlashcardIndex] = rememberType === 'lembrei' ? 5 : 1;
      this.flashcards.splice(this.currentFlashcardIndex, 1);

      // Atualiza o localStorage após a remoção
      this.saveFlashcardsToLocalStorage();
      this.currentFlashcard = null;
      this.currentFlashcardIndex = null; // Reseta o índice após a remoção
    })
    .catch((error) => {
      console.error('Erro ao atualizar o flashcard:', error);
    });
  }
},
    handleLogout() {
      localStorage.removeItem('user'); // Limpa a sessão do usuário
      this.$router.push('/login');
      location.reload()
    },
    resetInactivityTimer() {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.handleLogout();
      }, this.inactivityTimeout);
    },
    async startSimuladoUm() {
    const userEmail = localStorage.getItem('email');

    try {
      const response = await axios.get(`http://3.138.85.177:8080/api/user/by-email?email=${userEmail}`);
      const userData = response.data;

      // Armazenando os dados do 1º Simulado
      localStorage.setItem('simuladosUmRealizado', userData.simuladosUmRealizado);
      localStorage.setItem('respostasSimuladoUmCorretas', userData.respostasSimuladoUmCorretas);
      localStorage.setItem('respostasSimuladoUmIncorretas', userData.respostasSimuladoUmIncorretas);

      this.currentSimulado = 1;

      this.showSimulado = true;
      this.showSummary = false;
      this.currentQuestionIndex = 0;
      this.userAnswers = [];
      this.totalQuestions = 0;
      this.correctAnswers = 0;
      this.wrongAnswers = 0;
      this.loadNextQuestion();
    } catch (error) {
      console.error('Erro ao buscar os dados do usuário:', error);
    }
  },
  async startSimuladoDois() {
    const userEmail = localStorage.getItem('email');

    try {
      const response = await axios.get(`http://3.138.85.177:8080/api/user/by-email?email=${userEmail}`);
      const userData = response.data;

      // Armazenando os dados do 2º Simulado
      localStorage.setItem('simuladosDoisRealizado', userData.simuladosDoisRealizado);
      localStorage.setItem('respostasSimuladoDoisCorretas', userData.respostasSimuladoDoisCorretas);
      localStorage.setItem('respostasSimuladoDoisIncorretas', userData.respostasSimuladoDoisIncorretas);

      this.currentSimulado = 2;

      this.showSimulado = true;
      this.showSummary = false;
      this.currentQuestionIndex = 0;
      this.userAnswers = [];
      this.totalQuestions = 0;
      this.correctAnswers = 0;
      this.wrongAnswers = 0;
      this.loadNextQuestion();
    } catch (error) {
      console.error('Erro ao buscar os dados do usuário:', error);
    }
  },
    loadNextQuestion() {
      if (this.currentQuestionIndex < this.questionsFromAPI.length) {
        this.currentQuestion = this.questionsFromAPI[this.currentQuestionIndex];
        this.totalQuestions++;
        this.$nextTick(() => {
          const simuladoPopup = document.querySelector('.simulado-popup');
          if (simuladoPopup) {
            simuladoPopup.scrollTop = 0;
          }
        });
      } else {
        this.endSimulado();
      }
    },
    submitAnswer(answer) {
      this.userAnswers.push({
        question: this.currentQuestion.enunciadoUm,
        answer: answer,
        correct: answer === this.currentQuestion.resposta,
      });
      if (answer === this.currentQuestion.resposta) {
        this.correctAnswers++;
      } else {
        this.wrongAnswers++;
      }
      this.currentQuestionIndex++;
      this.loadNextQuestion();
    },
    async endSimulado() {
      // Calcula questões corretas e erradas
      this.correctAnswers = this.userAnswers.filter(answer => answer.correct).length;
      this.wrongAnswers = this.userAnswers.length - this.correctAnswers;

      // Atualiza os valores das respostas corretas e incorretas
      this.userActivities.respostasSimuladoUmCorretas = this.correctAnswers;
      this.userActivities.respostasSimuladoUmIncorretas = this.wrongAnswers;

      // Atualiza simuladosUmRealizado para 1 (indica que o simulado foi feito)
      this.userActivities.simuladosUmRealizado = 1;

      const userEmail = localStorage.getItem('email');

      // Fazendo uma requisição PUT para atualizar os dados do usuário
      try {
        if (this.currentSimulado === 1) {
        // Atualiza simuladosUmRealizado
        await axios.put(`http://3.138.85.177:8080/api/user/updateField?email=${userEmail}`, {
          chave: 'simuladosUmRealizado',
          valor: '1',
        });

        // Atualiza respostasSimuladoUmCorretas
        await axios.put(`http://3.138.85.177:8080/api/user/updateField?email=${userEmail}`, {
          chave: 'respostasSimuladoUmCorretas',
          valor: this.correctAnswers.toString(),
        });

        // Atualiza respostasSimuladoUmIncorretas
        await axios.put(`http://3.138.85.177:8080/api/user/updateField?email=${userEmail}`, {
          chave: 'respostasSimuladoUmIncorretas',
          valor: this.wrongAnswers.toString(),
        });
      } else if (this.currentSimulado === 2) {
        await axios.put(`http://3.138.85.177:8080/api/user/updateField?email=${userEmail}`, {
          chave: 'simuladosDoisRealizado',
          valor: '1',
        });

        // Atualiza respostasSimuladoUmCorretas
        await axios.put(`http://3.138.85.177:8080/api/user/updateField?email=${userEmail}`, {
          chave: 'respostasSimuladoDoisCorretas',
          valor: this.correctAnswers.toString(),
        });

        // Atualiza respostasSimuladoUmIncorretas
        await axios.put(`http://3.138.85.177:8080/api/user/updateField?email=${userEmail}`, {
          chave: 'respostasSimuladoDoisIncorretas',
          valor: this.wrongAnswers.toString(),
        });
      }

        console.log('Dados do simulado atualizados com sucesso!');

      } catch (error) {
        console.error('Erro ao atualizar os dados do simulado:', error);
      }

      // Exibe o resumo do simulado
      this.showSimulado = false;
      this.showSummary = true;
      console.log('Respostas:', this.userAnswers);
    },
    desistirSimulado() {
      if (confirm('Tem certeza de que deseja desistir do simulado?')) {
        this.showSimulado = false;
        this.showSummary = false;
      }
    },
    closeSummary() {
      this.showSummary = false;
      location.reload()
    },
    toggleAtividadesPopup() {
      this.showAtividades = !this.showAtividades;
      if (this.showAtividades) {
      this.loadUserActivities();
    }
    },
    loadUserActivities() {
  const userEmail = localStorage.getItem('email'); // Pegue o email do localStorage
  if (userEmail) {
    axios.get(`http://3.138.85.177:8080/api/user/by-email?email=${userEmail}`) // Faz a requisição GET para buscar as atividades do usuário
      .then((response) => {
        console.log('Resposta da API:', response.data);
        const user = response.data;
        if (user) {
          // Atualizando as atividades do usuário no estado do componente
          this.userActivities = {
            simuladosUmRealizado: user.simuladosUmRealizado,
            respostasSimuladoUmCorretas: user.respostasSimuladoUmCorretas,
            respostasSimuladoUmIncorretas: user.respostasSimuladoUmIncorretas,
            simuladosDoisRealizado: user.simuladosDoisRealizado,
            respostasSimuladoDoisCorretas: user.respostasSimuladoDoisCorretas,
            respostasSimuladoDoisIncorretas: user.respostasSimuladoDoisIncorretas,
            flashcardsRealizados: user.flashcardsRealizados,
            flashcardLembrei: user.flashcardLembrei,
            flashcardNaoLembrei: user.flashcardNaoLembrei,
          };
        } else {
          console.error('Usuário não encontrado na API');
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar atividades do usuário:', error);
      });
  } else {
    console.error('Nenhum email de usuário encontrado no localStorage');
  }
},
    fetchQuestions() {
      axios.get(`http://3.138.85.177:8080/api/questions`) // Faz a requisição GET para o endpoint
        .then(response => {
          this.questionsFromAPI = response.data; // Armazena as questões no estado
        })
        .catch(error => {
          console.error('Erro ao buscar questões:', error);
        });
    },
  },
  created() {
    this.resetInactivityTimer();
    this.loadUserActivities();
    this.fetchQuestions(); // Chama a função para buscar as questões do simulado
    document.addEventListener('mousemove', this.resetInactivityTimer);
    document.addEventListener('keydown', this.resetInactivityTimer);
  },
  beforeUnmount() {
    clearTimeout(this.timeoutId);
    document.removeEventListener('mousemove', this.resetInactivityTimer);
    document.removeEventListener('keydown', this.resetInactivityTimer);
  }
};
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Commissioner:wght@400;700&display=swap');

    body {
        font-family: 'Commissioner', sans-serif;
        background-color: #0d161b;
        color: #a3b18a;
        margin: 0;
        padding: 0;
    }
    
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
    }

    .header h1 {
        font-size: 2em;
        font-weight: bold;
        color: #becc79;
        margin-top: 1px;
    }

    .header button {
        background-color: #757e4a;
        color: #dee3e4;
        border: none;
        padding: 10px 20px;
        margin-left: 10px;
        margin-bottom: 28px;
        cursor: pointer;
        border-radius: 5px;
    }

    .header button:last-child {
        background-color: #996750;
        color: #dee3e4;
    }

    .header .simulado-button {
        background-color: #79adcc;
        color:#ffffff;
    }

    .content {
        text-align: center;
        margin-top: 50px;
        margin-bottom: 400px;
    }

    .content p {
        font-size: 1.5em;
        font-weight: bold;
        color: #757e4a;
        margin-bottom: 40px;
    }

    .cards-container {
        display: flex;
        align-items: center;
        padding: 20px;
        position: relative;
    }

    .cards {
        display: flex;
        gap: 20px;
        overflow: hidden;
        width: 100%;
    }

    .card {
        min-width: 150px;
        height: 200px;
        background-color: #1c2b2d;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
    }

    .arrow {
        position: absolute;
        bottom: -30px;
        background-color: #757e4a;
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
        border-radius: 50%;
        z-index: 1;
    }

    .arrow.left {
        left: 50%;
        transform: translateX(-250%);
    }

    .arrow.right {
        right: 50%;
        transform: translateX(250%);
    }

    .scontent {
        background-color: #e0e1dd;
        color: #0d1b2a;
        padding: 20px;
        border-radius: 10px;
        width: 700px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        overflow-y: auto;
        max-height: 80vh;
        margin: 50px auto;
    }

    .scontent h1 {
        font-size: 24px;
        margin-bottom: 20px;
        text-align: center;
        color: #0d161b;
    }

    .scontent p {
        margin-bottom: 20px;
        text-align: justify;
    }

    .scontent .options {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .scontent .options button {
        background-color: #79adcc;
        color: #0d161b;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        text-align: left;
    }

    .scontent .options button:hover {
        background-color: #219ebc;
    }

    .scontent .quit-button {
        background-color: #996750;
        color: #ffffff;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 20px;
    }

    .scontent::-webkit-scrollbar {
        width: 12px;
    }

    .scontent::-webkit-scrollbar-track {
        background: #bbbcaf;
        border-radius: 10px;
    }

    .scontent::-webkit-scrollbar-thumb {
        background-color: #8f897b;
        border-radius: 10px;
        border: 3px solid #bbbcaf;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
    }

    .simulado-popup {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #0d161b;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 101;
        overflow-y: auto;
    }

    .simulado-popup .question-box,
    .summary-popup .summary-content {
        margin-bottom: 1rem;
    }

    .question-textt {
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }

    .activycard {
        min-width: 150px;
        height: 200px;
        background-color: #79adcc;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .activycard .card-text {
        font-size: 24px;
        font-weight: bold;
        color: #ffffff;
    }

    .flashcard-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 101;
    width: 90%; /* Ajustado para ser responsivo */
    max-width: 500px; /* Limitar tamanho máximo */
    max-height: 80vh; /* Altura máxima relativa à tela */
    overflow-y: auto; /* Permitir rolagem se necessário */
    text-align: justify;
    padding: 20px; /* Espaçamento interno */
}

    .flashcard-popup .question-box {
        margin-bottom: 1rem;
    }

    .flashcard-popup .question-text {
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }

    .flashcard-popup .options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .flashcard-popup .option-button {
        padding: 0.5rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        text-align: left;
        transition: background-color 0.3s;
    }
    /* Para telas muito pequenas */
@media (max-width: 600px) {
    .flashcard-popup {
        width: 95%; /* Mais largura em telas pequenas */
        max-width: none; /* Remove o limite máximo */
        padding: 15px;
    }

    .flashcard-popup .flashcard-front button, 
    .flashcard-popup .flashcard-back button {
        width: 80%; /* Botões ocupando toda a largura no celular */
    }
}
    /* Estilo geral do Pop-up */
.atividades-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #e0e1dd;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 101;
    width: 90%;
    max-width: 320px;
    max-height: 80vh;
    overflow-y: auto;
    text-align: center;
}

/* Estilo do Título "Minhas Atividades" */
.atividades-content h2 {
    color: #0d161b; /* Cor customizável */
    font-size: 1.5rem;
}

/* Estilo do conteúdo (parágrafos) */
.atividades-content p {
    color: #0d161b; /* Cor dos textos */
    text-align: center;
}

/* Estilo do botão Fechar */
.btn-close {
  background-color: #996750;
        color: #dee3e4;
        border: none;
        padding: 10px 20px;
        margin-left: 10px;
        margin-bottom: 28px;
        cursor: pointer;
        border-radius: 5px;
}

    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #e0e1dd;
        z-index: 101;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        width: 300px;
        max-width: 90%;
        text-align: center;
        box-sizing: border-box;
    }

    .modal h2 {
        margin: 0;
        font-size: 24px;
        text-align: center;
    }

    .modal h1 {
        margin: 20px 0;
        font-size: 48px;
        text-align: center;
    }

    .modal p {
        margin: 20px 0;
        font-size: 16px;
        text-align: center;
    }

    .modal h2,
    .modal h1,
    .modal p {
        text-align: center;
        margin: 0 auto;
        color: #000000;
    }

    .modal button {
        background-color: #757e4a;
        color: #dee3e4;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 5px;
        display: block;
        margin: 20px auto 0 auto;
    }

    .flashcard-back {
        background-color: #e0e1dd;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    .flashcard-back button {
        background-color: #79adcc;
        color: #dee3e4;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        width: 50%;
        text-align: center;
    }

    .flashcard-back button:hover {
        background-color: #219ebc;
    }

    .flashcard-front {
        background-color: #e0e1dd;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    .flashcard-front button {
        background-color: #79adcc;
        color: #dee3e4;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        width: 50%;
        text-align: center;
    }

    .flashcard-front button:hover {
        background-color: #219ebc;
    }
</style>
