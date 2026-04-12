import { useEffect } from 'react';

import { encontrarBotaoAcaoPrimariaPageDown } from '../utilitarios/interacoesGlobaisModais';

// Registra o atalho global `PageDown` para acionar salvar ou incluir no contexto atual.
export function useAtalhoAcaoPrimaria() {
  useEffect(() => {
    function tratarAtalhoAcaoPrimaria(evento) {
      if (evento.key !== 'PageDown') {
        return;
      }

      const botaoAcaoPrimaria = encontrarBotaoAcaoPrimariaPageDown();

      if (!botaoAcaoPrimaria) {
        return;
      }

      evento.preventDefault();
      botaoAcaoPrimaria.click();
    }

    window.addEventListener('keydown', tratarAtalhoAcaoPrimaria);

    return () => {
      window.removeEventListener('keydown', tratarAtalhoAcaoPrimaria);
    };
  }, []);
}
