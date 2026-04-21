import { useEffect, useMemo, useState } from 'react';
import { Botao } from './botao';

export function CampoSelecaoMultiplaModal({
  className = '',
  label,
  titulo,
  itens,
  valoresSelecionados,
  placeholder = 'Selecionar',
  disabled = false,
  aoAlterar
}) {
  const [aberto, definirAberto] = useState(false);
  const [selecaoTemporaria, definirSelecaoTemporaria] = useState([]);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirSelecaoTemporaria(Array.isArray(valoresSelecionados) ? valoresSelecionados.map(String) : []);
  }, [aberto, valoresSelecionados]);

  const resumo = useMemo(() => {
    const selecionados = itens
      .filter((item) => (Array.isArray(valoresSelecionados) ? valoresSelecionados.map(String) : []).includes(String(item.valor)))
      .map((item) => item.label);

    return selecionados.length > 0 ? selecionados.join(', ') : placeholder;
  }, [itens, placeholder, valoresSelecionados]);

  function abrirModal() {
    if (disabled) {
      return;
    }

    definirSelecaoTemporaria(Array.isArray(valoresSelecionados) ? valoresSelecionados.map(String) : []);
    definirAberto(true);
  }

  function fecharModal() {
    definirAberto(false);
  }

  function alternarItem(valor) {
    const valorNormalizado = String(valor);

    definirSelecaoTemporaria((estadoAtual) => (
      estadoAtual.includes(valorNormalizado)
        ? estadoAtual.filter((item) => item !== valorNormalizado)
        : [...estadoAtual, valorNormalizado]
    ));
  }

  function aplicarSelecao() {
    aoAlterar(selecaoTemporaria);
    definirAberto(false);
  }

  return (
    <div className={`campoFormulario ${className}`.trim()}>
      <label>{label}</label>
      <button
        type="button"
        className="entradaFormulario botaoSeletorRecursosAgenda"
        onClick={abrirModal}
        disabled={disabled}
        title={resumo}
      >
        <span className="resumoCampoSelecaoMultipla">{resumo}</span>
      </button>

      {aberto ? (
        <div className="camadaModalContato" role="presentation" onMouseDown={fecharModal}>
          <div
            className="modalContatoFornecedor modalSelecaoMultipla"
            role="dialog"
            aria-modal="true"
            aria-label={titulo}
            onMouseDown={(evento) => evento.stopPropagation()}
          >
            <div className="cabecalhoModalContato">
              <h3>{titulo}</h3>

              <div className="acoesFormularioContatoModal">
                <Botao variante="secundario" type="button" onClick={fecharModal}>
                  Cancelar
                </Botao>
                <Botao variante="primario" type="button" onClick={aplicarSelecao}>
                  Aplicar
                </Botao>
              </div>
            </div>

            <div className="corpoModalContato corpoModalSelecaoMultipla">
              <div className="painelSelecaoMultipla">
                {itens.length > 0 ? (
                  itens.map((item) => {
                    const valorNormalizado = String(item.valor);
                    const selecionado = selecaoTemporaria.includes(valorNormalizado);

                    return (
                      <label key={item.valor} className="itemSeletorRecursosAgenda">
                        <input
                          type="checkbox"
                          checked={selecionado}
                          onChange={() => alternarItem(valorNormalizado)}
                        />
                        <span>{item.label}</span>
                      </label>
                    );
                  })
                ) : (
                  <p className="textoConfiguracaoVazio">Nenhum item disponivel.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
