<template>
  <div class="dashboard-container">
    <!-- Cabeçalho (Header) -->
    <header class="dashboard-header">
      <div class="logo">Saber+</div>
      <nav class="main-nav"></nav>
      <div class="user-info">

        <!-- Botão "Suas Atividades" -->
        <button class="btn-atividades" @click="toggleAtividadesPopup">Minhas atividades</button>
        <button @click="handleLogout" class="btn-logout">Sair</button>
      </div>
    </header>

    <!-- Área Principal (Main Content) -->
    <main class="dashboard-main">
      <!-- Seção de Funcionalidades -->
      <section class="features">
        <div class="feature-box">
          <h3>Simulado</h3>
          <button 
          class="btn-start-simulado" 
          @click="startSimuladoUm" 
          :disabled="userActivities.simuladosUmRealizado === 1">
          Iniciar 1º Simulado
        </button>
        <button 
          class="btn-start-simulado" 
          @click="startSimuladoDois" 
          :disabled="userActivities.simuladosUmRealizado === 0 || userActivities.simuladosDoisRealizado === 1">
          Iniciar 2º Simulado
        </button>
        </div>
        <div class="feature-box flashcards-box">
          <h3>Flashcards</h3>
          <div v-for="(flashcard, index) in flashcards" :key="index" class="flashcard-preview">
            <span>Pergunta {{ index + 1 }}</span>
            <button @click="showFlashcard(index)">▶️</button>
          </div>
        </div>
      </section>
    </main>

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
      <div class="simulado-content">
        <h2>Simulado</h2>
        <div v-if="currentQuestion" class="question-box">
          <p v-for="(text, index) in getQuestionTexts" :key="index" class="question-text">{{ text }}</p>
          <div class="options">
            <button v-for="option in currentQuestion.alternativas" :key="option" @click="submitAnswer(option)" class="option-button">
              {{ option }}
            </button>
          </div>
        </div>
        <button @click="desistirSimulado" class="btn btn-cancel">Desistir</button>
      </div>
    </div>

    <!-- Pop-up de Resumo do Simulado -->
    <div v-if="showSummary" class="summary-popup">
      <div class="summary-content">
        <h2>Resumo do Simulado</h2>
        <p>Questões Feitas: {{ totalQuestions }}</p>
        <p>Questões Acertadas: {{ correctAnswers }}</p>
        <p>Questões Erradas: {{ wrongAnswers }}</p>
        <button @click="closeSummary" class="btn btn-close">Fechar</button>
      </div>
    </div>

    <!-- Pop-up de Atividades -->
<div v-if="showAtividades" class="atividades-popup">
  <div class="atividades-content">
    <h2>Minhas Atividades</h2>
    <p>1º Simulado: {{ userActivities.simuladosUmRealizado ? 'Feito.' : 'Não Fez.' }}</p>
    <p>1º Simulado - Respostas corretas: {{ userActivities.respostasSimuladoUmCorretas }}</p>
    <p>1º Simulado - Respostas incorretas: {{ userActivities.respostasSimuladoUmIncorretas }}</p>
    <p>2º Simulado: {{ userActivities.simuladosDoisRealizado ? 'Feito.' : 'Não fez.' }}</p>
    <p>2º Simulado - Respostas corretas: {{ userActivities.respostasSimuladoDoisCorretas }}</p>
    <p>2º Simulado - Respostas incorretas: {{ userActivities.respostasSimuladoDoisIncorretas }}</p>
    <p>Flashcards: {{ userActivities.flashcardsRealizados }}</p>
    <p>Flashcards - Lembrei: {{ userActivities.flashcardLembrei }}</p>
    <p>Flashcards - Não lembrei: {{ userActivities.flashcardNaoLembrei }}</p>
    <button @click="toggleAtividadesPopup" class="btn btn-close">Fechar</button>
  </div>
</div>
  </div>
</template>

<script>
import axios from 'axios'; // Importa o axios

export default {
  name: 'UserDashboard',
  
  data() {
    return {
      inactivityTimeout: 15 * 60 * 1000, // 15 minutos de inatividade
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
      limiteFlashcards: 0,
      notRememberedFlashcards: [],
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
  },

  methods: {
    carregarFlashcards() {
  axios.get('http://18.225.32.96/api/flashcards')
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
        axios.get(`http://18.225.32.96/api/user/by-email?email=${userEmail}`)
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
    
    let timeUntilNextFlashcard = 900000; // 15 minutos de intervalo por padrão

    // Se existir um tempo armazenado no localStorage, calcule o tempo restante
    if (storedNextFlashcardTime) {
      const storedTime = parseInt(storedNextFlashcardTime, 10);
      timeUntilNextFlashcard = storedTime - currentTime;
      if (timeUntilNextFlashcard < 0) {
        timeUntilNextFlashcard = 0; // Se o tempo já passou, exibir imediatamente o próximo flashcard
      }
    }

    setTimeout(() => {
      this.loadNextFlashcard(); // Função para carregar o próximo flashcard

      // Defina um novo tempo para o próximo flashcard
      const newNextFlashcardTime = Date.now() + 900000; // Próximo intervalo de 15 minutos
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
      axios.get(`http://18.225.32.96/api/flashcards/?id=${flashcardId}`)
        .then((response) => {
          const { id, enunciado, resposta } = response.data;

          // Atualiza o flashcard atual com os dados recebidos
          this.currentFlashcard = { id, enunciado, resposta };

          this.currentFlashcardIndex = index;

          this.showBack = false;
        })
      axios.get(`http://18.225.32.96/api/user/by-email?email=${userEmail}`)
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
    axios.put(`http://18.225.32.96/api/user/updateField?email=${userEmail}`, {
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
      const response = await axios.get(`http://18.225.32.96/api/user/by-email?email=${userEmail}`);
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
      const response = await axios.get(`http://18.225.32.96/api/user/by-email?email=${userEmail}`);
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
        await axios.put(`http://18.225.32.96/api/user/updateField?email=${userEmail}`, {
          chave: 'simuladosUmRealizado',
          valor: '1',
        });

        // Atualiza respostasSimuladoUmCorretas
        await axios.put(`http://18.225.32.96/api/user/updateField?email=${userEmail}`, {
          chave: 'respostasSimuladoUmCorretas',
          valor: this.correctAnswers.toString(),
        });

        // Atualiza respostasSimuladoUmIncorretas
        await axios.put(`http://18.225.32.96/api/user/updateField?email=${userEmail}`, {
          chave: 'respostasSimuladoUmIncorretas',
          valor: this.wrongAnswers.toString(),
        });
      } else if (this.currentSimulado === 2) {
        await axios.put(`http://18.225.32.96/api/user/updateField?email=${userEmail}`, {
          chave: 'simuladosDoisRealizado',
          valor: '1',
        });

        // Atualiza respostasSimuladoUmCorretas
        await axios.put(`http://18.225.32.96/api/user/updateField?email=${userEmail}`, {
          chave: 'respostasSimuladoDoisCorretas',
          valor: this.correctAnswers.toString(),
        });

        // Atualiza respostasSimuladoUmIncorretas
        await axios.put(`http://18.225.32.96/api/user/updateField?email=${userEmail}`, {
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
    axios.get(`http://18.225.32.96/api/user/by-email?email=${userEmail}`) // Faz a requisição GET para buscar as atividades do usuário
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
      axios.get(`http://18.225.32.96/api/questions`) // Faz a requisição GET para o endpoint
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


<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f0f0;
  color: #333;
}

/* Cabeçalho */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #007bff;
  color: #fff;
}

.logo {
  font-size: 1.5rem;
}

.main-nav a {
  margin: 0 1rem;
  color: #fff;
  text-decoration: none;
}

.user-info {
  display: flex;
  align-items: center;
}

.btn-logout {
  background-color: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-logout:hover {
  background-color: #c82333;
}

/* Área Principal */
.dashboard-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  padding: 1rem;
}

.features {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.feature-box {
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
}

.btn-start-simulado {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-start-simulado:hover {
  background-color: #0069d9;
}

/* Pop-up do Simulado */
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 101;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  text-align: justify;
}

.summary-popup .summary-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 101;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}


.summary-popup p {
  text-align: center;
}

.simulado-popup .question-box,
.summary-popup .summary-content {
  margin-bottom: 1rem;
}

.question-text {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-button {
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.3s;
}

.option-button:hover {
  background-color: #0056b3;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
  margin-top: 1rem;
}

.btn-cancel:hover {
  background-color: #c82333;
}

.btn-close {
  background-color: #007bff;
  color: white;
}

.btn-close:hover {
  background-color: #0056b3;
}

.btn-atividades {
  background-color: #ffc107;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 1rem;
}

.btn-atividades:hover {
  background-color: #e0a800;
}

/* Pop-up de Atividades */
.atividades-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 101;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  text-align: center;
}

.flashcards-box {
  max-height: 200px;
  overflow-y: scroll;
  background-color: #fff;
  padding: 10px;
  margin-top: 20px;
}

.flashcard-preview {
  background-color: white;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flashcard-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff; /* Altere a cor de fundo */
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 101;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  text-align: justify;
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
</style>