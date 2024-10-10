<template>
  <body>
    <h1 class="logo">Saber+</h1>
    <div class="container">
      <form @submit.prevent="handleRegister">
        <div class="register-title">Registrar</div>
        <label for="nome-completo">Nome completo</label>
        <input type="text" id="nome-completo" v-model="fullName">
        <label for="data-nascimento">Data de nascimento</label>
        <input type="date" id="data-nascimento" v-model="birthdate">
        <label for="curso">Curso</label>
        <input type="text" id="curso" v-model="course">
        <label for="email">E-mail</label>
        <input type="email" id="email" v-model="email">
        <label for="senha">Senha</label>
        <input type="password" id="senha" v-model="password">
        <button type="submit" class="btn btn-register">Registrar</button>
      </form>
      <button @click="goBack" class="back">Voltar</button>
    </div>
</body>
</template>

<script>
//<button @click="goBack" class="back-button">Voltar</button>
export default {
  name: 'RegisterPage',
  data() {
    return {
      fullName: '',
      email: '',
      birthdate: '',
      college: '',
      course: '',
      password: '',
    };
  },
  methods: {
    formatDate(date) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`; // Formata a data para dd/MM/yyyy
    },
    async handleRegister() {
      try {
        const formattedDate = this.formatDate(this.birthdate);

        const response = await fetch('http://3.138.85.177:8080/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: this.fullName,
            email: this.email,
            curso: this.course,
            faculdade: this.college,
            senha: this.password,
            data: formattedDate,  // Envia a data formatada
            simuladosUmRealizado: 0,
            respostasSimuladoUmCorretas: 0,
            respostasSimuladoUmIncorretas: 0,
            flashcardsRealizados: 0,
            flashcardLembrei: 0,
            flashcardQuaseNaoLembrei: 0,
            flashcardNaoLembrei: 0,
            simuladosDoisRealizado: 0,
            respostasSimuladoDoisCorretas: 0,
            respostasSimuladoDoisIncorretas: 0,
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao registrar usuário');
        }

        alert('Registro realizado com sucesso!');
        this.$router.push('/login');
      } catch (error) {
        console.error(error);
        alert('Erro ao tentar registrar');
      }
    },
    goBack() {
      this.$router.push('/'); // Redireciona para a página de registro
    }
  },
};
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Commissioner:wght@400;700&display=swap');

body, .logo, .container label, .container input, .container button, .container .divider span, .container .forgot-password, .container .back, .container .register-title {
  font-family: 'Commissioner', sans-serif;
}

body {
  background-color: #0d161b;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  flex-direction: column;
}

.logo {
  color: #becc78;
  font-size: 72px;
  margin-bottom: 10px;
  text-align: center;
}

.container {
  background-color: #8b7d6b;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: left;
  width: 300px;
  margin-bottom: 10vh;
}

.container label {
  color: #1f272a;
  margin-top: 10px;
  display: block;
  font-weight: bold;
}

.container input[type="text"],
.container input[type="email"],
.container input[type="password"],
.container input[type="date"] {
  width: 100%;
  padding: 10px;
  margin: 5px 0 10px 0;
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
  border-bottom: 2px solid #6b4b3b;
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

.container .forgot-password {
  background: none;
  color: #bbbcaf;
  padding: 5px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  width: auto;
}

.container .back {
  background-color: #4d5040;
  color: #bbbcaf;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.container .register-title {
  color: #1f272a;
  margin-bottom: 10px;
  font-size: 18px;
  text-align: center;
  font-weight: bold;
}

</style>