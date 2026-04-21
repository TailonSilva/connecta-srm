import { useEffect, useState } from 'react';
import { Botao } from '../comuns/botao';
import { MensagemErroPopup } from '../comuns/mensagemErroPopup';

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
  const [gerandoBackup, definirGerandoBackup] = useState(false);
  const [backupConcluido, definirBackupConcluido] = useState(false);
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
    definirGerandoBackup(false);
    definirBackupConcluido(false);
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
      if (evento.key === 'Escape' && !salvando && !verificando && !gerandoBackup) {
        aoFechar();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar, salvando, verificando, gerandoBackup]);

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

    if (!backupConcluido) {
      definirMensagemErro('Gere e salve um backup do banco antes de iniciar a atualizacao manual.');
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

  async function gerarBackupBanco() {
    if (!window.desktop?.salvarBackupBanco) {
      definirMensagemErro('A geracao de backup so funciona no aplicativo desktop.');
      definirMensagemSucesso('');
      return;
    }

    definirGerandoBackup(true);
    definirMensagemErro('');
    definirMensagemSucesso('');

    try {
      const resultado = await window.desktop.salvarBackupBanco();

      if (resultado?.cancelado) {
        definirMensagemErro('');
        definirMensagemSucesso('Backup cancelado pelo usuario.');
        definirBackupConcluido(false);
        return;
      }

      if (!resultado?.sucesso) {
        throw new Error(resultado?.mensagem || 'Nao foi possivel gerar o backup do banco de dados.');
      }

      definirBackupConcluido(true);
      definirMensagemSucesso(resultado.mensagem || 'Backup do banco salvo com sucesso.');
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel gerar o backup do banco de dados.');
      definirMensagemSucesso('');
      definirBackupConcluido(false);
    } finally {
      definirGerandoBackup(false);
    }
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget && !salvando && !verificando && !gerandoBackup) {
      aoFechar();
    }
  }

  return (
    <div className="camadaModal" role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <form
        className="modalFornecedor modalAtualizacaoSistema"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalAtualizacaoSistema"
        onMouseDown={(evento) => evento.stopPropagation()}
        onSubmit={submeterFormulario}
      >
        <header className="cabecalhoModalFornecedor">
          <div>
            <h2 id="tituloModalAtualizacaoSistema">Atualizacao do sistema</h2>
            <p className="textoAuxiliarAtualizacaoSistema">
              Informe o link do repositorio ou da pagina de releases no GitHub. A atualizacao agora acontece somente por acao manual do fornecedor.
            </p>
          </div>

          <div className="acoesCabecalhoModalFornecedor">
            <Botao variante="secundario" type="button" onClick={aoFechar} disabled={salvando || verificando || gerandoBackup}>
              Fechar
            </Botao>
            <Botao variante="primario" type="submit" disabled={salvando || verificando || gerandoBackup}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </Botao>
          </div>
        </header>

        <div className="corpoModalFornecedor">
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
                <span className="rotuloResumoAtualizacaoSistema">Repositorio configurado</span>
                <strong>{configuracao?.urlRepositorio || 'Nao configurado'}</strong>
              </div>
              <div className="cartaoResumoAtualizacaoSistema">
                <span className="rotuloResumoAtualizacaoSistema">Backup antes da atualizacao</span>
                <strong>{backupConcluido ? 'Gerado nesta sessao' : 'Pendente'}</strong>
              </div>
            </div>

            <div className="acoesAtualizacaoSistema">
              <Botao
                variante="secundario"
                type="button"
                onClick={gerarBackupBanco}
                disabled={salvando || verificando || gerandoBackup}
              >
                {gerandoBackup ? 'Gerando backup...' : 'Gerar backup do banco'}
              </Botao>
              <Botao
                variante="complementar"
                type="button"
                onClick={verificarAtualizacoes}
                disabled={salvando || verificando || gerandoBackup}
              >
                {verificando ? 'Verificando...' : 'Buscar atualizacao agora'}
              </Botao>
            </div>
          </div>
        </div>

        <MensagemErroPopup mensagem={mensagemErro} titulo="Nao foi possivel concluir a atualizacao." />
        {mensagemSucesso ? <p className="mensagemSucessoFormulario">{mensagemSucesso}</p> : null}
      </form>
    </div>
  );
}

