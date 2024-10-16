<template>
    <body>
      <h1 class="logo">Saber+</h1>
      <div class="container">
        <form @submit.prevent="handlePasswordRecovery">
          <div class="register-title">Esqueci minha senha</div>
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model="email" required>
          <label for="data-nascimento">Data de nascimento</label>
          <input type="date" id="data-nascimento" v-model="birthdate" required>
          <button type="submit" class="btn btn-register">Recuperar senha</button>
        </form>
        <button @click="goBack" class="back">Voltar</button>
      </div>
  
      <!-- Pop-up para exibir a senha -->
    <div v-if="showPasswordPopup" class="overlay"></div>
    <div v-if="showPasswordPopup" class="modal">
      <h2>Recuperação de Senha</h2>
      <p>Sua senha foi recuperada com sucesso!</p>
      <div class="password" id="password">{{ maskedPassword }}</div>
      <button id="toggleButton" @click="togglePassword">{{ toggleButtonText }}</button>
      <button @click="closePopup">Fechar</button>
    </div>
    <!-- Pop-up para mensagem de erro -->
    <div v-if="showErrorPopup" class="overlay"></div>
    <div v-if="showErrorPopup" class="modal">
      <h2>Erro</h2>
      <p>O e-mail ou a data de nascimento estão incorretos.</p>
      <p>Por favor, tente novamente.</p>
      <button @click="closeErrorPopup">Fechar</button>
    </div>
    </body>
  </template>
  
  <script>
  export default {
    name: 'EsqueciPage',
    data() {
      return {
        email: '',
        birthdate: '',
        recoveredPassword: '', // Senha recuperada
        maskedPassword: '********', // Senha mascarada exibida no modal
        isPasswordVisible: false, // Controle de visibilidade da senha
        toggleButtonText: 'Mostrar',
        showPasswordPopup: false, // Controle de exibição do popup
        showErrorPopup: false,
      };
    },
    methods: {
        togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
    if (this.isPasswordVisible) {
      this.maskedPassword = this.recoveredPassword;
      this.toggleButtonText = 'Ocultar';
    } else {
      this.maskedPassword = '********';
      this.toggleButtonText = 'Mostrar';
    }
},
        closePopup() {
      this.showPasswordPopup = false; // Fecha o popup
    },
    closeErrorPopup() {
      this.showErrorPopup = false; // Fecha o popup de erro
    },
      formatDate(date) {
        const [day, month, year] = date.split('-');
        return `${day}/${month}/${year}`; // Formata a data para dd/MM/yyyy
      },
      async handlePasswordRecovery() {
  try {
    if (!this.email || !this.birthdate) {
      alert('Por favor, insira todos os dados.');
      return;
    }

    // Faz uma requisição GET para pegar todos os usuários
    const response = await fetch('http://3.19.208.176:8080/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const users = await response.json();

    // Filtra o usuário com o e-mail e data de nascimento correspondentes
    const user = users.find((user) => 
      user.email === this.email && this.convertDateToIso(user.data) === this.birthdate
    );

    if (user) {
      this.recoveredPassword = user.senha; // Recupera a senha
      this.showPasswordPopup = true; // Exibe o popup com a senha
    } else {
      this.showErrorPopup = true; // Exibe o popup de erro
    }
  } catch (error) {
    console.error(error.message);
    this.showErrorPopup = true;
  }
},

// Método para converter uma data no formato dd/MM/yyyy para o formato yyyy-MM-dd
    convertDateToIso(date) {
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`; // Converte para o formato yyyy-MM-dd
      },
    goBack() {
        this.$router.push('/'); // Redireciona para a página de registro
      }
    },
  };
  </script>
  
  <style scoped>
  
  @import url('https://fonts.googleapis.com/css2?family=Commissioner:wght@400;700&display=swap');
  
  body, .logo, .container label, .container input, .container button, .container .divider span, .container .forgot-password, .container .back, .container, .modal, .h2, .p, .password .register-title {
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

  .modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #e0e0e0;
  color: #000000;
  padding: 20px;
  border-radius: 10px;
  z-index: 101;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 300px;
  box-sizing: border-box;
  text-align: center; /* Adicionado */
}

.modal h2 {
  margin: 0;
  font-size: 24px;
}

.modal p {
  margin: 20px 0;
  font-size: 16px;
}

.modal .password {
  font-size: 24px;
  margin: 20px 0;
}

.modal button {
  background-color: #757e4a;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
  </style>