import { Botao } from './botao';
import { CampoPesquisa } from './campoPesquisa';
import '../../recursos/estilos/modalHistoricoGrade.css';

export function ModalHistoricoGrade({
  aberto,
  titulo,
  subtitulo = '',
  className = '',
  chipsCabecalho = [],
  filtrosAtivos = false,
  tituloFiltro = 'Filtrar',
  ariaFiltro = 'Filtrar',
  valorPesquisa = '',
  onAlterarPesquisa,
  placeholderPesquisa = 'Pesquisar no historico...',
  onAbrirFiltros,
  acaoCabecalho = null,
  onFechar,
  abas = [],
  abaAtiva = '',
  onSelecionarAba,
  abasNoCabecalho = false,
  children
}) {
  if (!aberto) {
    return null;
  }

  const exibirAbas = Array.isArray(abas) && abas.length > 0;
  const exibirAbasNoCabecalho = exibirAbas && abasNoCabecalho;

  return (
    <div className="camadaModal camadaModalSecundaria" role="presentation" onMouseDown={onFechar}>
      <section
        className={`modalFornecedor modalHistoricoGrade ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`titulo${normalizarIdModal(titulo)}`}
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <header className="cabecalhoModalFornecedor">
          <div className="modalHistoricoGradeCabecalhoTexto">
            <h2 id={`titulo${normalizarIdModal(titulo)}`}>{titulo}</h2>
            {subtitulo ? <p className="modalHistoricoGradeSubtitulo">{subtitulo}</p> : null}
          </div>

          <div className="acoesCabecalhoModalFornecedor">
            {exibirAbasNoCabecalho || typeof onAbrirFiltros === 'function' ? (
              <div className="modalHistoricoGradeControlesCabecalho">
                {exibirAbasNoCabecalho ? (
                  <div className="modalHistoricoGradeAbasCabecalho" role="tablist" aria-label={titulo}>
                    {abas.map((aba) => (
                      <button
                        key={aba.id}
                        type="button"
                        role="tab"
                        className={`abaModalFornecedor ${abaAtiva === aba.id ? 'ativa' : ''}`}
                        aria-selected={abaAtiva === aba.id}
                        onClick={() => onSelecionarAba?.(aba.id)}
                      >
                        {aba.label}
                      </button>
                    ))}
                  </div>
                ) : null}
                {Array.isArray(chipsCabecalho) && chipsCabecalho.length > 0 ? (
                  <div className="modalHistoricoGradeChipsCabecalho" aria-label="Filtros ativos">
                    {chipsCabecalho.map((chip) => (
                      <span key={chip.id || chip.rotulo} className="modalHistoricoGradeChipCabecalho">
                        {chip.rotulo}
                      </span>
                    ))}
                  </div>
                ) : null}
                {typeof onAbrirFiltros === 'function' ? (
                  <Botao
                    variante={filtrosAtivos ? 'primario' : 'secundario'}
                    type="button"
                    icone="filtro"
                    somenteIcone
                    title={tituloFiltro}
                    aria-label={ariaFiltro}
                    onClick={onAbrirFiltros}
                  >
                    {tituloFiltro}
                  </Botao>
                ) : null}
                {typeof onAlterarPesquisa === 'function' ? (
                  <CampoPesquisa
                    valor={valorPesquisa}
                    aoAlterar={onAlterarPesquisa}
                    placeholder={placeholderPesquisa}
                    ariaLabel={placeholderPesquisa}
                    className="modalHistoricoGradePesquisa"
                  />
                ) : null}
              </div>
            ) : null}
            {acaoCabecalho}
            <Botao variante="secundario" type="button" onClick={onFechar}>
              Fechar
            </Botao>
          </div>
        </header>

        {exibirAbas && !exibirAbasNoCabecalho ? (
          <div className="abasModalFornecedor modalHistoricoGradeAbas" role="tablist" aria-label={titulo}>
            {abas.map((aba) => (
              <button
                key={aba.id}
                type="button"
                role="tab"
                className={`abaModalFornecedor ${abaAtiva === aba.id ? 'ativa' : ''}`}
                aria-selected={abaAtiva === aba.id}
                onClick={() => onSelecionarAba?.(aba.id)}
              >
                {aba.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="corpoModalFornecedor corpoModalFornecedorSemRolagem modalHistoricoGradeCorpo">
          {children}
        </div>
      </section>
    </div>
  );
}

function normalizarIdModal(valor) {
  return String(valor || '')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .trim();
}