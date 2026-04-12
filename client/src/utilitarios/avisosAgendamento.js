// Verifica se o agendamento pertence ao usuario atual, considerando tanto `idsUsuarios` quanto `idUsuario`.
export function pertenceAoUsuarioLogado(agendamento, idUsuarioLogado) {
  const idsUsuarios = Array.isArray(agendamento.idsUsuarios)
    ? agendamento.idsUsuarios.map(String)
    : [];

  if (idsUsuarios.length > 0) {
    return idsUsuarios.includes(String(idUsuarioLogado));
  }

  return String(agendamento.idUsuario) === String(idUsuarioLogado);
}

// Converte a data e o horario do agendamento em um objeto `Date` unico para facilitar comparacoes no frontend.
export function criarDataHorarioAgendamento(data, horario) {
  if (!data || !horario) {
    return null;
  }

  return new Date(`${data}T${horario}:00`);
}

// Gera uma chave textual estavel para evitar mostrar o mesmo aviso de agendamento mais de uma vez.
export function criarChaveAvisoAgendamento(agendamento) {
  return `${agendamento.idAgendamento}-${agendamento.data}-${agendamento.horaInicio}`;
}

// Monta a mensagem principal exibida no popup conforme a proximidade do compromisso.
export function criarMensagemPopupAgendamento(agendamento) {
  if (agendamento.diferencaMinutos === 0) {
    return 'Seu compromisso comeca agora.';
  }

  if (agendamento.diferencaMinutos === 1) {
    return 'Seu compromisso comeca em 1 minuto.';
  }

  return `Seu compromisso comeca em ${agendamento.diferencaMinutos} minutos.`;
}

// Monta a linha secundaria do popup com faixa de horario e tipo do compromisso quando existir.
export function criarDetalhePopupAgendamento(agendamento) {
  const partes = [`${agendamento.horaInicio} - ${agendamento.horaFim}`];

  if (agendamento.tipo) {
    partes.push(agendamento.tipo);
  }

  return partes.join(' | ');
}
