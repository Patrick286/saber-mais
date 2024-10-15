<template>
  <body>
    <h1 class="logo no-select">Saber+</h1>
    <div class="container no-select">
      <form @submit.prevent="handleLogin">
        <label for="email">E-mail</label>
        <input type="email" id="email" v-model="email">
        <label for="password">Senha</label>
        <input type="password" id="password" v-model="senha">
        <button type="submit" >Entrar</button>
      </form>
      <div class="divider"><span>Novo na Saber+?</span></div>
      <button @click="goToRegister" class="create-account">Criar nova conta</button>
      <div class="divider2"></div>
        <button @click= "goEsqueciSenha" class="forgot-password">Esqueci minha senha</button>
    </div>
    <div @click="goToSaberMais" class="info-text no-select">O que é o Saber+?</div>


    <div v-if="showCancelPopup" class="overlay"></div>
<div v-if="showCancelPopup" class="modalin no-select">
        <h2>Credenciais inválidas.</h2>
        <button @click="closeCancel">Fechar</button>
    </div>
    <div v-if="erroregister" class="overlay"></div>
    <div v-if="erroregister" class="modalin no-select">
      <h2>Erro.</h2>
      <p>Erro ao tentar efetuar o login.</p>
      <button @click="closeCancel">Fechar</button>
    </div>
</body>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      senha: '',
      showCancelPopup: false,
      erroregister: false,
    };
  },
  mounted() {
    // Verifica se já existe um email armazenado no localStorage
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      // Se existir, redireciona diretamente para o dashboard
      this.$router.push('/dashboard');
    }
  },
  methods: {
    closeCancel(){
      this.showCancelPopup = false;
    },
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:8080/api/login', {
          email: this.email,
          senha: this.senha,
        });

        if (response.data && response.data.success) {
          const user = response.data.user; // Assumindo que a API retorna o usuário e um campo de sucesso
          localStorage.setItem('user', JSON.stringify(user)); // Armazena o usuário no localStorage
          localStorage.setItem('email', this.email); // Armazena o email no localStorage
          this.$router.push('/dashboard'); // Redireciona para o dashboard
        } else {
          this.showCancelPopup = true;
        }
      } catch (error) {
        this.erroregister = true;
      }
    },
    goToRegister() {
      this.$router.push('/register');
    },
    goToSaberMais() {
      this.$router.push('/sabermais');
    },
    goEsqueciSenha() {
        this.$router.push('/esquecisenha'); // Redireciona para a página de registro
      }
  },
};
</script>
  
<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Commissioner:wght@400;700&display=swap');

body {
  background-color: #0d161b;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  font-family: 'Commissioner', sans-serif;
  flex-direction: column;
}

.logo {
  color: #becc78;
  font-size: 72px;
  margin-bottom: 20px;
  font-family: 'Commissioner', sans-serif;
}

.container {
  background-color: #8b7d6b;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  width: 300px;
  margin-bottom: 5vh;
}

.container label {
  color: #1f272a;
  font-weight: bold;
  display: block;
  text-align: left;
  margin: 10px 0 5px 0;
}

.container input[type="email"],
.container input[type="password"] {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: #dee3e4;
}

.container button {
  background-color: #6b7d4b;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin: 10px 0;
}

.container .divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
}

.container .divider::before,
.container .divider::after {
  content: '';
  flex: 1;
  border-bottom: 4px solid #736149;
}

.container .divider::before {
  margin-right: 10px;
}

.container .divider::after {
  margin-left: 10px;
}

.container .divider span {
  color: #404950;
}

.container .create-account {
  background-color: #4d5040;
  color: #bbbcaf;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.container .forgot-password {
  background: none;
  color: #bbbcaf;
  padding: 5px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  width: auto;
}

body, h1, label, input, button, .divider span, .info-text {
  font-family: 'Commissioner', sans-serif;
}
.info-text {
  color: #becc79;
  cursor: pointer;
  font-size: 48px;
  margin-bottom: 10vh;
  align-items: center;
}
.modalin {
        background-color: #e0e1dd;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 300px;
    text-align: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 101;
    max-width: 90%;
    box-sizing: border-box;
        }
        .modalin h2 {
            margin: 0;
            font-size: 24px;
            color: #000000;
        }
        .modalin h1 {
            margin: 20px 0;
            font-size: 36px;
        }
        .modalin p {
            margin: 20px 0;
            font-size: 16px;
        }
        .modalin button {
            background-color: #757e4a;
            color: #ffffff;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 5px;
            margin-top: 10px;
            margin-right: 10px; /* Espaçamento horizontal entre os botões */
}

/* Para o último botão, você pode remover o espaçamento à direita */
.modalin button:last-child {
    margin-right: 0;
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
    .no-select {
        user-select: none; /* Impede a seleção de texto */
        -webkit-user-select: none;
        -ms-user-select: none;
    }
</style>