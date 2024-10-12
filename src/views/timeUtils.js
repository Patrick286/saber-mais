import axios from 'axios'; // Importa o axios
const TIME_INTERVAL = 60000; // 10 segundos

export function calculateTimeDifference() {
  const lastExitTime = localStorage.getItem('ultima_saida_hora');
  const currentTime = updateCurrentTime();
  const reloadFlag = localStorage.getItem('reload_flag');

  if (lastExitTime && currentTime) {
    const differenceInMinutes = getMinutesDifference(lastExitTime, currentTime);
    return differenceInMinutes;
  } else {
    // Verifica se o reload já foi feito
    if (!reloadFlag) {
      localStorage.setItem('reload_flag', 'true'); // Seta o flag para indicar que já recarregou
      location.reload(); // Recarrega a página
    } else {
      console.log("A página já foi recarregada uma vez. Evitando loop.");
    }
  }
}

export function startCalculateTimeDifference() {
    calculateTimeDifference();
    setInterval(calculateTimeDifference, TIME_INTERVAL);
  }

export function getMinutesDifference(lastTime, currentTime) {
    const lastExitDate = new Date(`1970-01-01T${lastTime}:00`);
    const currentDate = new Date(`1970-01-01T${currentTime}:00`);
    const diffMs = currentDate - lastExitDate;
    return Math.floor(diffMs / 60000);
}

export function updateLastExit(userEmail, API_URL) {
  if (userEmail) {
    axios.put(`${API_URL}/user/update-last-exit?email=${userEmail}`)
      .then(() => console.log('Última saída atualizada'))
      .catch(error => console.error('Erro ao atualizar última saída:', error));
  }
}

export function updateCurrentTime() {
  const now = new Date();
  now.setHours(now.getHours() + 3);

  // Formatar horas e minutos
  const horas = now.getHours().toString().padStart(2, '0');
  const minutos = now.getMinutes().toString().padStart(2, '0');
  const horaMinuto = `${horas}:${minutos}`;
  const dataCompleta = `${horaMinuto}`;
  localStorage.setItem('tempo_atual', dataCompleta);
  return dataCompleta;
}

export function startUpdateLastExit(userEmail, API_URL) {
  getUserLastExitTime(userEmail, API_URL);
  setInterval(updateLastExit, TIME_INTERVAL, userEmail, API_URL);
}

export function startUpdateCurrentTime() {
  setInterval(updateCurrentTime, TIME_INTERVAL);
}

export function getUserLastExitTime(userEmail, API_URL) {
  if (userEmail) {
    axios.get(`${API_URL}/user/by-email?email=${userEmail}`)
      .then(response => {
        const ultimaSaida = new Date(response.data.ultimaSaida);

        // Formatar horas e minutos
        const horas = ultimaSaida.getHours().toString().padStart(2, '0');
        const minutos = ultimaSaida.getMinutes().toString().padStart(2, '0');
        const horaMinuto = `${horas}:${minutos}`;

        const dataCompleta = `${horaMinuto}`;

        localStorage.setItem('ultima_saida_hora', dataCompleta);
        console.log(`Última saída: ${dataCompleta}`);
      })
      .catch(error => console.error('Erro ao obter última saída:', error));
  }
}

export function getUserLastExitTimeInterval(userEmail, API_URL) {
    setInterval(getUserLastExitTime, TIME_INTERVAL, userEmail, API_URL);
  }