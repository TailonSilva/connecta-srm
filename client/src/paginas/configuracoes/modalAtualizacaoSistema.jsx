import { useEffect, useState } from 'react';
import { Botao } from '../../componentes/comuns/botao';

const formularioInicial = {
  urlRepositorio: ''
};

export function ModalAtualizacaoSistema({
  aberto,
  configuracao,
  aoFechar,
  aoSalvar
}) {
  const [formulario, definirFormulario] = useState(formularioInicial);
  const [salvando, definirSalvando] = useState(false);
  const [verificando, definirVerificando] = useState(false);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [mensagemSucesso, definirMensagemSucesso] = useState('');
  const [versaoAtual, definirVersaoAtual] = useState('');

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFormulario({
      urlRepositorio: configuracao?.urlRepositorio || ''
    });
    definirSalvando(false);
    definirVerificando(false);
    definirMensagemErro('');
    definirMensagemSucesso('');

    if (window.desktop?.obterVersao) {
      window.desktop.obterVersao()
        .then((dados) => {
          definirVersaoAtual(dados?.versao || '');
        })
        .catch(() => {
          definirVersaoAtual('');
        });
      return;
    }

    definirVersaoAtual('');
  }, [aberto, configuracao]);

  useEffect(() => {
    if (!aberto || !window.desktop?.aoAtualizarStatus) {
      return undefined;
    }

    return window.desktop.aoAtualizarStatus((status) => {
      if (!status) {
        return;
      }

      if (status.tipo === 'erro') {
        definirMensagemErro(status.mensagem || 'Nao foi possivel verificar atualizacoes.');
        definirMensagemSucesso('');
        definirVerificando(false);
        return;
      }

      definirMensagemErro('');
      definirMensagemSucesso(status.mensagem || '');

      if (['sem-atualizacao', 'atualizacao-baixada'].includes(status.tipo)) {
        definirVerificando(false);
      }
    });
  }, [aberto]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape' && !salvando && !verificando) {
        aoFechar();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar, salvando, verificando]);

  if (!aberto) {
    return null;
  }

  function alterarCampo(evento) {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      [evento.target.name]: evento.target.value
    }));
  }

  async function submeterFormulario(evento) {
    evento.preventDefault();

    if (!String(formulario.urlRepositorio || '').trim()) {
      definirMensagemErro('Informe o link do repositorio no GitHub.');
      definirMensagemSucesso('');
      return;
    }

    definirSalvando(true);
    definirMensagemErro('');
    definirMensagemSucesso('');

    try {
      await aoSalvar(formulario);
      definirMensagemSucesso('Configuracao salva com sucesso.');
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel salvar a configuracao de atualizacao.');
    } finally {
      definirSalvando(false);
    }
  }

  async function verificarAtualizacoes() {
    if (!window.desktop?.verificarAtualizacoes) {
      definirMensagemErro('A verificacao manual de atualizacoes so funciona no aplicativo desktop.');
      definirMensagemSucesso('');
      return;
    }

    definirVerificando(true);
    definirMensagemErro('');
    definirMensagemSucesso('');

    try {
      const resultado = await window.desktop.verificarAtualizacoes();

      if (!resultado?.sucesso) {
        throw new Error(resultado?.mensagem || 'Nao foi possivel verificar atualizacoes.');
      }
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel verificar atualizacoes.');
      definirMensagemSucesso('');
      definirVerificando(false);
    }
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget && !salvando && !verificando) {
      aoFechar();
    }
  }

  return (
    <div className="camadaModal" role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <form
        className="modalCliente modalAtualizacaoSistema"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalAtualizacaoSistema"
        onMouseDown={(evento) => evento.stopPropagation()}
        onSubmit={submeterFormulario}
      >
        <header className="cabecalhoModalCliente">
          <div>
            <h2 id="tituloModalAtualizacaoSistema">Atualizacao do sistema</h2>
            <p className="textoAuxiliarAtualizacaoSistema">
              Informe o link do repositorio ou da pagina de releases no GitHub.
            </p>
          </div>

          <div className="acoesCabecalhoModalCliente">
            <Botao variante="secundario" type="button" onClick={aoFechar} disabled={salvando || verificando}>
              Fechar
            </Botao>
            <Botao variante="primario" type="submit" disabled={salvando || verificando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </Botao>
          </div>
        </header>

        <div className="corpoModalCliente">
          <div className="painelAtualizacaoSistema">
            <div className="campoFormulario campoFormularioIntegral">
              <label htmlFor="urlRepositorio">Link do GitHub</label>
              <input
                id="urlRepositorio"
                name="urlRepositorio"
                type="url"
                className="entradaFormulario"
                value={formulario.urlRepositorio}
                onChange={alterarCampo}
                placeholder="https://github.com/usuario/repositorio"
                disabled={salvando || verificando}
                required
              />
            </div>

            <div className="resumoAtualizacaoSistema">
              <div className="cartaoResumoAtualizacaoSistema">
                <span className="rotuloResumoAtualizacaoSistema">Versao instalada</span>
                <strong>{versaoAtual || 'Nao disponivel'}</strong>
              </div>
              <div className="cartaoResumoAtualizacaoSistema">
                <span className="rotuloResumoAtualizacaoSistema">Leitura automatica</span>
                <strong>{configuracao?.urlRepositorio || 'Nao configurado'}</strong>
              </div>
            </div>

            <div className="acoesAtualizacaoSistema">
              <Botao
                variante="complementar"
                type="button"
                onClick={verificarAtualizacoes}
                disabled={salvando || verificando}
              >
                {verificando ? 'Verificando...' : 'Verificar atualizacao agora'}
              </Botao>
            </div>
          </div>
        </div>

        {mensagemErro ? <p className="mensagemErroFormulario">{mensagemErro}</p> : null}
        {mensagemSucesso ? <p className="mensagemSucessoFormulario">{mensagemSucesso}</p> : null}
      </form>
    </div>
  );
}
