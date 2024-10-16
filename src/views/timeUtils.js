import axios from 'axios'; // Importa o axios
const TIME_INTERVAL = 10000; // 10 segundos

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
    }
  }
}

export function startCalculateTimeDifference() {
    calculateTimeDifference();
    setInterval(calculateTimeDifference, TIME_INTERVAL);
  }

  export function getMinutesDifference(lastTime, currentTime) {
    // `lastTime` e `currentTime` já devem estar no formato completo: "YYYY-MM-DDTHH:mm"
    const lastExitDate = new Date(lastTime);
    const currentDate = new Date(currentTime);
    
    // Diferença em milissegundos
    const diffMs = currentDate - lastExitDate;
    
    // Converter a diferença de milissegundos para minutos
    return Math.floor(diffMs / 60000);
}

export function updateLastExit(userEmail, API_URL) {
  if (userEmail) {
    axios.put(`${API_URL}/user/update-last-exit?email=${userEmail}`)
      .catch(error => console.error('Erro ao atualizar última saída:', error));
  }
}

export function updateCurrentTime() {
  const now = new Date();
  
  // Formatar data, horas e minutos
  const dia = now.getDate().toString().padStart(2, '0');
  const mes = (now.getMonth() + 1).toString().padStart(2, '0'); // Mês começa do 0
  const ano = now.getFullYear();
  const horas = now.getHours().toString().padStart(2, '0');
  const minutos = now.getMinutes().toString().padStart(2, '0');
  
  // Criar string da data completa
  const dataCompleta = `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  localStorage.setItem('tempo_atual', dataCompleta);
  return dataCompleta;
}

export function startUpdateLastExit(userEmail, API_URL) {
  getUserLastExitTime(userEmail, API_URL);
  setInterval(updateLastExit, TIME_INTERVAL, userEmail, API_URL);
}

export function getUserLastExitTime(userEmail, API_URL) {
  if (userEmail) {
    axios.get(`${API_URL}/user/by-email?email=${userEmail}`)
      .then(response => {
        const ultimaSaida = response.data.ultimaSaida;
        const parsedDate = parseDate(ultimaSaida);
        if (parsedDate) {
          const ultimaSaidaDate = new Date(parsedDate);
          
          // Formatar a data completa
          const dia = ultimaSaidaDate.getDate().toString().padStart(2, '0');
          const mes = (ultimaSaidaDate.getMonth() + 1).toString().padStart(2, '0');
          const ano = ultimaSaidaDate.getFullYear();
          const horas = ultimaSaidaDate.getHours().toString().padStart(2, '0');
          const minutos = ultimaSaidaDate.getMinutes().toString().padStart(2, '0');
          
          // Criar string no formato "YYYY-MM-DDTHH:mm"
          const dataCompleta = `${ano}-${mes}-${dia}T${horas}:${minutos}`;
          localStorage.setItem('ultima_saida_hora', dataCompleta);
        } else {
          console.error('Invalid date string:', ultimaSaida);
        }
      })
      .catch(error => console.error('Erro ao obter última saída:', error));
  }
}

function parseDate(dateString) {
  const parts = dateString.split(' ');
  const dateParts = parts[0].split('/');
  const timeParts = parts[1].split(':');
  const year = dateParts[2];
  const month = dateParts[1];
  const day = dateParts[0];
  const hour = timeParts[0];
  const minute = timeParts[1];
  const second = timeParts[2];
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}Z`;
}

export function getUserLastExitTimeInterval(userEmail, API_URL) {
    setInterval(getUserLastExitTime, TIME_INTERVAL, userEmail, API_URL);
  }