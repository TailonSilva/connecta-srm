import { useEffect, useRef, useState } from 'react';

import { listarAgendamentos } from '../servicos/agenda';
import {
  criarChaveAvisoAgendamento,
  criarDataHorarioAgendamento,
  criarDetalhePopupAgendamento,
  criarMensagemPopupAgendamento,
  pertenceAoUsuarioLogado
} from '../utilitarios/avisosAgendamento';

// Controla a fila de avisos de agenda do usuario ativo, incluindo polling, expiracao e fechamento manual.
export function useAvisosAgendamento(usuarioLogado) {
  // Guarda os popups visiveis no momento para renderizacao da camada global de avisos.
  const [avisosPopup, definirAvisosPopup] = useState([]);

  // Guarda as chaves dos avisos ja mostrados para nao repetir o mesmo compromisso.
  const avisosNotificadosRef = useRef(new Set());

  // Quando o usuario muda, limpamos o historico e a fila atual para isolar os contextos.
  useEffect(() => {
    avisosNotificadosRef.current = new Set();
    definirAvisosPopup([]);
  }, [usuarioLogado?.idUsuario]);

  // Busca periodicamente compromissos proximos do usuario atual para gerar novos avisos.
  useEffect(() => {
    if (!usuarioLogado?.idUsuario) {
      return undefined;
    }

    let desmontado = false;

    async function verificarCompromissosProximos() {
      try {
        const agendamentos = await listarAgendamentos();

        if (desmontado) {
          return;
        }

        const agora = new Date();
        const proximosAvisos = agendamentos
          .filter((agendamento) => pertenceAoUsuarioLogado(agendamento, usuarioLogado.idUsuario))
          .map((agendamento) => ({
            ...agendamento,
            dataHorarioInicio: criarDataHorarioAgendamento(agendamento.data, agendamento.horaInicio)
          }))
          .filter((agendamento) => agendamento.dataHorarioInicio instanceof Date && !Number.isNaN(agendamento.dataHorarioInicio.getTime()))
          .map((agendamento) => ({
            ...agendamento,
            diferencaMinutos: Math.round((agendamento.dataHorarioInicio.getTime() - agora.getTime()) / 60000)
          }))
          .filter((agendamento) => agendamento.diferencaMinutos >= 0 && agendamento.diferencaMinutos <= 15)
          .sort((primeiro, segundo) => primeiro.dataHorarioInicio - segundo.dataHorarioInicio);

        const novosAvisos = proximosAvisos
          .filter((agendamento) => {
            const chaveAviso = criarChaveAvisoAgendamento(agendamento);
            return !avisosNotificadosRef.current.has(chaveAviso);
          })
          .map((agendamento) => {
            const chaveAviso = criarChaveAvisoAgendamento(agendamento);
            avisosNotificadosRef.current.add(chaveAviso);

            return {
              id: chaveAviso,
              icone: agendamento.iconeStatusVisita || 'Agenda',
              titulo: agendamento.assunto || 'Compromisso na agenda',
              subtitulo: agendamento.tipo || 'Agendamento',
              mensagem: criarMensagemPopupAgendamento(agendamento),
              detalhe: criarDetalhePopupAgendamento(agendamento)
            };
          });

        if (novosAvisos.length > 0) {
          definirAvisosPopup((estadoAtual) => [...novosAvisos, ...estadoAtual].slice(0, 4));
        }
      } catch (_erro) {
        return;
      }
    }

    verificarCompromissosProximos();
    const intervalo = window.setInterval(verificarCompromissosProximos, 60000);

    return () => {
      desmontado = true;
      window.clearInterval(intervalo);
    };
  }, [usuarioLogado]);

  // Remove os avisos automaticamente depois de alguns segundos para manter a pilha enxuta.
  useEffect(() => {
    if (avisosPopup.length === 0) {
      return undefined;
    }

    const temporizadores = avisosPopup.map((aviso) => window.setTimeout(() => {
      definirAvisosPopup((estadoAtual) => estadoAtual.filter((item) => item.id !== aviso.id));
    }, 12000));

    return () => {
      temporizadores.forEach((temporizador) => window.clearTimeout(temporizador));
    };
  }, [avisosPopup]);

  // Permite remover um aviso especifico quando o usuario fecha manualmente o popup.
  function fecharAviso(idAviso) {
    definirAvisosPopup((estadoAtual) => estadoAtual.filter((aviso) => aviso.id !== idAviso));
  }

  return {
    avisosPopup,
    fecharAviso
  };
}
