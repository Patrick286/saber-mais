// src/database.js
export const infoUsers = [
  {
    email: 'patrickmiguel286@gmail.com',
    nome: 'Patrick Miguel Silva de Jesus Santos',
    date: '07/07/1999',
    college: 'Unijorge',
    course: 'Engenharia da computação',
    password: 'p01016161',
    simuladosUmRealizado: true,
    respostasSimuladoUmCorretas: 11,
    respostasSimuladoUmIncorretas: 10,
    simuladosDoisRealizado: false,
    respostasSimuladoDoisCorretas: 0,
    respostasSimuladoDoisIncorretas: 0,
    flashcardsRealizados: 0,
    flashcardLembrei: 0,
    flashcardQuaseNaoLembrei: 0,
    flashcardNaoLembrei: 0,
  }
  ];

  export function findUserByEmail(email) {
    return infoUsers.find(user => user.email === email);
  }
  
  export function addUser(user) {
    infoUsers.push(user);
  }