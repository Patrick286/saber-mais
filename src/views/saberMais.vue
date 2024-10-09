<template>
    <body>
        <button @click="goToLogin" class="back-button">Voltar</button>
  <h1>
   O que é o
   <i>
    Saber+
   </i>
   ?
  </h1>
  <p class="special-highlight">
   O Saber+ é um projeto cujo objetivo é ajudar estudantes a se prepararem para o ENADE através de simulados e flashcards que reforçam os conteúdos.
  </p>
  <p style="color: #8b9fb3;">
   Mas o que são os "flashcards"?
  </p>
  <p class="special-highlight">
   Os flashcards são um método de memorização espaçada, ou seja, cartinhas como as de um jogo que contêm perguntas relacionadas ao assunto de um lado e a resposta atrás.
  </p>
  <p class="highlight">
   E como o site funciona?
  </p>
  <p class="special-highlight">
    O primeiro passo obrigatório para o usuário é realizar o primeiro simulado. Esse simulado consiste em um conjunto de questões retiradas das provas do Exame Nacional de Desempenho dos Estudantes (Enade). Ele serve como uma avaliação inicial do nível de conhecimento do usuário.
  </p>
  <p class="special-highlight">
    Após a conclusão do primeiro simulado, os flashcards serão liberados. Esses flashcards são ferramentas de revisão que, em intervalos de tempo regulares, apresentarão questões relacionadas ao conteúdo do simulado realizado. A seleção dos flashcards é feita de forma aleatória, abrangendo questões específicas já respondidas no simulado.
  </p>
  <p class="special-highlight">
    O segundo simulado só será liberado após um determinado período. Esse intervalo será para que o usuário tenha tempo para revisar e consolidar o conteúdo através dos flashcards.
  </p>
  <p class="special-highlight">
    Após o usuário realizar o segundo simulado, será feita a comparação do desempenho do usuário antes e depois do período de estudo focado nas questões do Enade. Essa análise fornecerá uma visão clara sobre o impacto do uso dos flashcards no processo de aprendizagem, sendo possível avaliar a eficácia da aplicação na retenção de conteúdo e na melhora do desempenho.
  </p>
  <h2>
   Quem somos nós?
  </h2>
  <div class="profile-container">
   <div class="profile">
    <p class="profile-name">Ronald V. Jesus</p>
    <img alt="Foto de Ronald V. Jesus" height="200" src="../components/ronald.png" width="200"/>
    <p>
     Clique para Saber+
    </p>
   </div>
   <div class="profile">
    <p class="profile-name">Patrick M. Santos</p>
    <img alt="Foto de Patrick M. Santos" height="200" src="../components/patrick.png" width="200"/>
    <p>
     Clique para Saber+
    </p>
   </div>
   <div class="profile">
    <p class="profile-name">Amanda H. Lara</p>
    <img alt="Foto de Amanda H. Lara" height="200" src="../components/kk.jpg" width="200"/>
    <p>
     Clique para Saber+
    </p>
   </div>
  </div>
 </body>
</template>

<script>

export default {

  methods: {

    goToLogin() {
      this.$router.push('/');
    }
  },
};

</script>

<style>
/* Importando a fonte Commissioner */
@import url('https://fonts.googleapis.com/css2?family=Commissioner:wght@300;400;600&display=swap');

body {
    background-color: #0d161b;
    color: #d1d1d1;
    text-align: center;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: 'Commissioner', sans-serif; /* Aplicando a fonte Commissioner */
}

h1, h2 {
    color: #8b9fb3;
}

h1 {
    font-size: 2.5em;
    margin-top: 50px;
}

h2 {
    font-size: 2em;
    margin-top: 50px;
}

p {
    font-size: 1.2em;
    margin: 20px auto;
    width: 80%;
    line-height: 1.5em;
}

.highlight {
    color: #8b9fb3;
}

.special-highlight {
    color: #8f897b;
}

.profile-container {
    display: flex;
    justify-content: center;
    margin-top: 50px;
    flex-wrap: wrap;
}

.profile {
    background-color: #bbbcaf;
    color: #1f272a;
    width: 200px;
    height: 300px;
    margin: 20px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.profile img {
    width: 100%;
    height: 200px;
    background-color: #1a1a1a;
    border-radius: 5px;
}

.profile p {
    margin: 10px 0 0 0;
    font-size: 1em;
}

.profile-name {
    margin-bottom: 10px;
    font-size: 1.2em;
    font-weight: bold;
}

@media (max-width: 600px) {
    .profile-container {
        flex-direction: column;
        align-items: center;
    }

    .profile {
        margin: 10px 0;
    }
}

.back-button {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #4d5040;
    color: #8f897b;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
}
</style>