import { useEffect } from 'react';

import {
  encontrarModalAtivo,
  navegarEntreAbasModal
} from '../utilitarios/interacoesGlobaisModais';

// Registra os atalhos `Alt + Seta` para navegar entre abas do modal atualmente ativo.
export function useAtalhoNavegacaoAbasModal() {
  useEffect(() => {
    function tratarNavegacaoAbasModal(evento) {
      if (!evento.altKey || (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowRight')) {
        return;
      }

      const modalAtivo = encontrarModalAtivo({ incluirAlertDialog: false });

      if (!modalAtivo) {
        return;
      }

      evento.preventDefault();
      navegarEntreAbasModal(modalAtivo, evento.key === 'ArrowRight' ? 1 : -1);
    }

    window.addEventListener('keydown', tratarNavegacaoAbasModal, true);

    return () => {
      window.removeEventListener('keydown', tratarNavegacaoAbasModal, true);
    };
  }, []);
}
