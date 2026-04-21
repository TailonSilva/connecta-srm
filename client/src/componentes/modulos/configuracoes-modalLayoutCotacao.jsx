import { useEffect, useState } from 'react';
import { Botao } from '../comuns/botao';
import { MensagemErroPopup } from '../comuns/mensagemErroPopup';

const formularioInicial = {
  corPrimariaCotacao: '#111827',
  corSecundariaCotacao: '#ef4444',
  corDestaqueCotacao: '#f59e0b'
};

export function ModalLayoutCotacao({
  aberto,
  empresa,
  somenteConsulta = false,
  aoFechar,
  aoSalvar
}) {
  const [formulario, definirFormulario] = useState(formularioInicial);
  const [salvando, definirSalvando] = useState(false);
  const [mensagemErro, definirMensagemErro] = useState('');

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFormulario(criarFormularioLayoutCotacao(empresa));
    definirSalvando(false);
    definirMensagemErro('');
  }, [aberto, empresa]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape' && !salvando) {
        aoFechar();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar, salvando]);

  if (!aberto) {
    return null;
  }

  function alterarCampo(evento) {
    const { name, value } = evento.target;

    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      [name]: value
    }));
  }

  async function submeterFormulario(evento) {
    evento.preventDefault();

    if (somenteConsulta) {
      return;
    }

    definirSalvando(true);
    definirMensagemErro('');

    try {
      await aoSalvar(formulario);
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel salvar o layout da cotacao.');
      definirSalvando(false);
    }
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget && !salvando) {
      aoFechar();
    }
  }

  return (
    <div className="camadaModal" role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <form
        className="modalFornecedor"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalLayoutCotacao"
        onMouseDown={(evento) => evento.stopPropagation()}
        onSubmit={submeterFormulario}
      >
        <header className="cabecalhoModalFornecedor">
          <h2 id="tituloModalLayoutCotacao">Layout Cotacao</h2>

          <div className="acoesCabecalhoModalFornecedor">
            <Botao variante="secundario" type="button" onClick={aoFechar} disabled={salvando}>
              {somenteConsulta ? 'Fechar' : 'Cancelar'}
            </Botao>
            {!somenteConsulta ? (
              <Botao variante="primario" type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </Botao>
            ) : null}
          </div>
        </header>

        <div className="corpoModalFornecedor">
          <section className="gradeCamposModalFornecedor">
            <CampoFormulario
              label="Cor primaria do PDF"
              name="corPrimariaCotacao"
              type="color"
              value={formulario.corPrimariaCotacao}
              onChange={alterarCampo}
              disabled={somenteConsulta || salvando}
            />
            <CampoFormulario
              label="Cor secundaria do PDF"
              name="corSecundariaCotacao"
              type="color"
              value={formulario.corSecundariaCotacao}
              onChange={alterarCampo}
              disabled={somenteConsulta || salvando}
            />
            <CampoFormulario
              label="Cor de destaque do PDF"
              name="corDestaqueCotacao"
              type="color"
              value={formulario.corDestaqueCotacao}
              onChange={alterarCampo}
              disabled={somenteConsulta || salvando}
            />
          </section>
        </div>

        <MensagemErroPopup mensagem={mensagemErro} titulo="Nao foi possivel salvar o layout da cotacao." />
      </form>
    </div>
  );
}

function CampoFormulario({ label, name, type = 'text', ...props }) {
  return (
    <div className="campoFormulario">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className="entradaFormulario" {...props} />
    </div>
  );
}

function criarFormularioLayoutCotacao(empresa) {
  return {
    corPrimariaCotacao: empresa?.corPrimariaCotacao || '#111827',
    corSecundariaCotacao: empresa?.corSecundariaCotacao || '#ef4444',
    corDestaqueCotacao: empresa?.corDestaqueCotacao || '#f59e0b'
  };
}

