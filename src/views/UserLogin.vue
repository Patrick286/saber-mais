<template>
  <body>
    <h1 class="logo">Saber+</h1>
    <div class="container">
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
    <div @click="goToSaberMais" class="info-text">O que é o Saber+?</div>
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
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://18.220.93.161:8080/api/login', {
          email: this.email,
          senha: this.senha,
        });

        if (response.data && response.data.success) {
          const user = response.data.user; // Assumindo que a API retorna o usuário e um campo de sucesso
          localStorage.setItem('user', JSON.stringify(user)); // Armazena o usuário no localStorage
          localStorage.setItem('email', this.email); // Armazena o email no localStorage
          console.log('Email armazenado no localStorage:', localStorage.getItem('email'));
          this.$router.push('/dashboard'); // Redireciona para o dashboard
        } else {
          alert('Credenciais inválidas');
        }
      } catch (error) {
        console.error('Erro ao tentar login:', error);
        alert('Erro ao conectar ao servidor');
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
</style>