import { useEffect, useState } from 'react';

import {
  limparSessaoUsuario,
  obterSessaoUsuario,
  salvarSessaoUsuario
} from '../servicos/autenticacao';

// Centraliza a leitura, persistencia e sincronizacao da sessao do usuario no frontend.
export function useSessaoSincronizada() {
  // O usuario inicial vem da sessao persistida e e lido apenas na primeira montagem do hook.
  const [usuarioLogado, definirUsuarioLogado] = useState(obterSessaoUsuario);

  // Mantem o estado sincronizado com o evento global emitido por outros pontos do sistema.
  useEffect(() => {
    function tratarUsuarioLogadoAtualizado(evento) {
      const proximoUsuario = evento.detail?.usuario || null;

      if (!proximoUsuario) {
        return;
      }

      salvarSessaoUsuario(proximoUsuario);
      definirUsuarioLogado(proximoUsuario);
    }

    window.addEventListener('usuario-logado-atualizado', tratarUsuarioLogadoAtualizado);

    return () => {
      window.removeEventListener('usuario-logado-atualizado', tratarUsuarioLogadoAtualizado);
    };
  }, []);

  // Persiste e aplica a sessao quando um fluxo de login devolve um usuario valido.
  function entrar(usuario) {
    salvarSessaoUsuario(usuario);
    definirUsuarioLogado(usuario);
  }

  // Remove a sessao persistida e derruba o contexto atual do usuario no React.
  function sair() {
    limparSessaoUsuario();
    definirUsuarioLogado(null);
  }

  return {
    usuarioLogado,
    definirUsuarioLogado,
    entrar,
    sair
  };
}
