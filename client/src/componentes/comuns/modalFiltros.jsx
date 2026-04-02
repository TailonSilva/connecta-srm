import { useEffect, useState } from 'react';
import { Botao } from './botao';
import { CampoSelecaoMultiplaModal } from './campoSelecaoMultiplaModal';

export function ModalFiltros({
  aberto,
  titulo,
  campos,
  filtros,
  aoFechar,
  aoAplicar,
  aoLimpar
}) {
  const [formulario, definirFormulario] = useState(filtros);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFormulario(filtros);
  }, [aberto, filtros]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape') {
        aoFechar();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar]);

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

  function alternarCampoMultiplo(nomeCampo, valorCampo) {
    definirFormulario((estadoAtual) => {
      const valoresAtuais = Array.isArray(estadoAtual[nomeCampo]) ? estadoAtual[nomeCampo] : [];
      const valorNormalizado = String(valorCampo);
      const selecionado = valoresAtuais.includes(valorNormalizado);

      return {
        ...estadoAtual,
        [nomeCampo]: selecionado
          ? valoresAtuais.filter((item) => item !== valorNormalizado)
          : [...valoresAtuais, valorNormalizado]
      };
    });
  }

  function aplicarFiltros(evento) {
    evento.preventDefault();
    aoAplicar(formulario);
  }

  function limparFiltros() {
    aoLimpar();
    aoFechar();
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget) {
      aoFechar();
    }
  }

  return (
    <div className="camadaModalContato" role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <form
        className="modalContatoCliente modalFiltros"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`titulo${titulo.replace(/\s+/g, '')}`}
        onMouseDown={(evento) => evento.stopPropagation()}
        onSubmit={aplicarFiltros}
      >
        <div className="cabecalhoModalContato">
          <h3 id={`titulo${titulo.replace(/\s+/g, '')}`}>{titulo}</h3>

          <div className="acoesFormularioContatoModal">
            <Botao
              variante="secundario"
              type="button"
              icone="limpar"
              somenteIcone
              title="Limpar"
              aria-label="Limpar"
              onClick={limparFiltros}
            >
              Limpar
            </Botao>
            <Botao
              variante="secundario"
              type="button"
              icone="fechar"
              somenteIcone
              title="Fechar"
              aria-label="Fechar"
              onClick={aoFechar}
            >
              Cancelar
            </Botao>
            <Botao
              variante="primario"
              type="submit"
              icone="confirmar"
              somenteIcone
              title="Aplicar"
              aria-label="Aplicar"
            >
              Aplicar
            </Botao>
          </div>
        </div>

        <div className="corpoModalContato">
          <div className="gradeCamposModalCliente gradeFiltrosModal">
            {campos.map((campo) => (
              campo.multiple ? (
                <CampoSelecaoMultiplaModal
                  key={campo.name}
                  label={campo.label}
                  titulo={campo.tituloSelecao || campo.label}
                  itens={campo.options}
                  valoresSelecionados={Array.isArray(formulario[campo.name]) ? formulario[campo.name] : []}
                  placeholder={campo.placeholder || 'Todos'}
                  disabled={campo.disabled}
                  aoAlterar={(valores) => alternarCampoMultiploSubstituir(campo.name, valores)}
                />
              ) : campo.type && campo.type !== 'select' ? (
                <div key={campo.name} className="campoFormulario">
                  <label htmlFor={campo.name}>{campo.label}</label>
                  <input
                    id={campo.name}
                    name={campo.name}
                    type={campo.type}
                    className="entradaFormulario"
                    value={formulario[campo.name] || ''}
                    onChange={alterarCampo}
                    disabled={campo.disabled}
                    {...campo.inputProps}
                  />
                </div>
              ) : (
                <div key={campo.name} className="campoFormulario">
                  <label htmlFor={campo.name}>{campo.label}</label>
                  <select
                    id={campo.name}
                    name={campo.name}
                    className="entradaFormulario"
                    value={formulario[campo.name] || ''}
                    onChange={alterarCampo}
                    disabled={campo.disabled}
                  >
                    <option value="">{campo.placeholder || 'Todos'}</option>
                    {(campo.options || []).map((opcao) => (
                      <option key={opcao.valor} value={opcao.valor}>
                        {opcao.label}
                      </option>
                    ))}
                  </select>
                </div>
              )
            ))}
          </div>
        </div>
      </form>
    </div>
  );

  function alternarCampoMultiploSubstituir(nomeCampo, valores) {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      [nomeCampo]: valores
    }));
  }
}
