import { useEffect, useMemo, useState } from 'react';
import { PopupAvisos } from './popupAvisos';

export function MensagemErroPopup({
  mensagem,
  titulo = 'Nao foi possivel concluir a operacao.',
  subtitulo = ''
}) {
  const [mensagemDispensada, definirMensagemDispensada] = useState('');

  useEffect(() => {
    definirMensagemDispensada('');
  }, [mensagem]);

  const avisos = useMemo(() => {
    const mensagemNormalizada = String(mensagem || '').trim();

    if (!mensagemNormalizada || mensagemNormalizada === mensagemDispensada) {
      return [];
    }

    return [
      {
        id: `erro-${mensagemNormalizada}`,
        icone: 'alerta',
        titulo,
        subtitulo: subtitulo || undefined,
        mensagem: mensagemNormalizada
      }
    ];
  }, [mensagem, mensagemDispensada, subtitulo, titulo]);

  if (avisos.length === 0) {
    return null;
  }

  return (
    <PopupAvisos
      avisos={avisos}
      aoFechar={() => definirMensagemDispensada(String(mensagem || '').trim())}
    />
  );
}
