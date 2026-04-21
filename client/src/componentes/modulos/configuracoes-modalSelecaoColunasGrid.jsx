import { useEffect } from 'react';
import { Botao } from '../comuns/botao';
import { Icone } from '../comuns/icone';

const opcoesColunasGrid = [
  {
    id: 'atendimentos',
    titulo: 'Atendimentos',
    descricao: 'Configurar a grade principal dos atendimentos.',
    icone: 'atendimentos',
    disponivel: true
  },
  {
    id: 'fornecedores',
    titulo: 'Fornecedores',
    descricao: 'Configurar a grade principal dos fornecedores.',
    icone: 'fornecedores',
    disponivel: true
  },
  {
    id: 'produtos',
    titulo: 'Produtos',
    descricao: 'Configurar a grade principal dos produtos.',
    icone: 'produtos',
    disponivel: true
  },
  {
    id: 'cotacoes',
    titulo: 'Cotacoes',
    descricao: 'Configurar a grade principal das cotacoes.',
    icone: 'cotacao',
    disponivel: true
  },
  {
    id: 'ordensCompra',
    titulo: 'Ordens de Compra',
    descricao: 'Configurar a grade principal das ordens de compra.',
    icone: 'ordemCompra',
    disponivel: true
  }
];

export function ModalSelecaoColunasGrid({
  aberto,
  aoFechar,
  aoSelecionar
}) {
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

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget) {
      aoFechar();
    }
  }

  return (
    <div className="camadaModal" role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <div
        className="modalFornecedor modalSelecaoColunasGrid"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalSelecaoColunasGrid"
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <header className="cabecalhoModalFornecedor">
          <h2 id="tituloModalSelecaoColunasGrid">Configurar Colunas do Grid</h2>

          <div className="acoesCabecalhoModalFornecedor">
            <Botao variante="secundario" type="button" onClick={aoFechar}>
              Fechar
            </Botao>
          </div>
        </header>

        <div className="corpoModalFornecedor">
          <section className="gradeCamposModalFornecedor">
            <div className="campoFormularioIntegral">
              <p className="descricaoOpcaoEmpresaPaginaInicial">
                Escolha qual grade do sistema voce quer configurar.
              </p>
            </div>

            <div className="campoFormularioIntegral gradeSelecaoColunasGrid">
              {opcoesColunasGrid.map((opcao) => (
                <button
                  key={opcao.id}
                  type="button"
                  className="cartaoConfiguracao cartaoSelecaoColunasGrid"
                  disabled={!opcao.disponivel}
                  onClick={() => aoSelecionar(opcao.id)}
                >
                  <span className="iconeCartaoConfiguracao" aria-hidden="true">
                    <span className="circuloIconeConfiguracao">
                      <Icone nome={opcao.icone} />
                    </span>
                  </span>

                  <span className="conteudoCartaoConfiguracao">
                    <strong>{opcao.titulo}</strong>
                    <small>{opcao.descricao}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

