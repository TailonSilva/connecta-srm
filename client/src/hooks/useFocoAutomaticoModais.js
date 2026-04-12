import { useEffect } from 'react';

import { aplicarFocoNoModalAtivo } from '../utilitarios/interacoesGlobaisModais';

// Observa mudancas relevantes do DOM para reaplicar foco no modal ativo sempre que necessario.
export function useFocoAutomaticoModais() {
  useEffect(() => {
    let frameAtual = null;
    let timeoutAtual = null;

    function agendarAplicacaoFoco() {
      if (frameAtual !== null) {
        window.cancelAnimationFrame(frameAtual);
      }

      if (timeoutAtual !== null) {
        window.clearTimeout(timeoutAtual);
      }

      frameAtual = window.requestAnimationFrame(() => {
        timeoutAtual = window.setTimeout(() => {
          aplicarFocoNoModalAtivo();
        }, 0);
      });
    }

    const observador = new MutationObserver(() => {
      agendarAplicacaoFoco();
    });

    observador.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'open', 'aria-hidden', 'disabled']
    });

    agendarAplicacaoFoco();

    return () => {
      observador.disconnect();

      if (frameAtual !== null) {
        window.cancelAnimationFrame(frameAtual);
      }

      if (timeoutAtual !== null) {
        window.clearTimeout(timeoutAtual);
      }
    };
  }, []);
}
