import { PopupAvisos } from './popupAvisos';
import { useAvisosAgendamento } from '../../hooks/useAvisosAgendamento';

// Encapsula a busca e a renderizacao dos avisos globais para deixar o `App` focado na composicao da interface.
export function CentralAvisosGlobais({ usuarioLogado }) {
  const { avisosPopup, fecharAviso } = useAvisosAgendamento(usuarioLogado);

  return (
    <PopupAvisos
      avisos={avisosPopup}
      aoFechar={fecharAviso}
    />
  );
}
