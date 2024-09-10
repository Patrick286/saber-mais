<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Saber+</h2>
      <form @submit.prevent="handleLogin">
        <div class="textbox">
          <input type="email" v-model="email" placeholder="Email" required />
        </div>
        <div class="textbox">
          <input type="password" v-model="senha" placeholder="Senha" required />
        </div>
        <button type="submit" class="btn btn-login">Entrar</button>
        <router-link to="/register" class="btn btn-register">Registrar</router-link>
      </form>
    </div>
  </div>
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
        const response = await axios.post('http://localhost:8080/api/login', {
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
  },
};
</script>
  
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0; /* Tema claro padrão */
}

.login-box {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza horizontalmente */
}

.login-box h2 {
  margin-bottom: 1rem;
}

.textbox {
  width: 100%; /* Garante que o textbox ocupe toda a largura disponível */
  margin-bottom: 1rem;
  display: flex;
  justify-content: center; /* Centraliza horizontalmente */
}

.textbox input {
  width: 100%; /* Faz com que o campo de entrada ocupe toda a largura do textbox */
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.btn {
  width: 100%;
  padding: 0.8rem;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-login {
  background-color: #007bff;
  margin-bottom: 1rem; /* Espaçamento entre botões */
}

.btn-login:hover {
  background-color: #0056b3;
}

.btn-register {
  background-color: #28a745;
}

.btn-register:hover {
  background-color: #218838;
}
</style>