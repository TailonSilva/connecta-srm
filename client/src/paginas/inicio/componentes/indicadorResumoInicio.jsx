import { Icone } from '../../../componentes/comuns/icone';
import '../../../recursos/estilos/indicadorResumoInicio.css';

export function IndicadorResumoInicio({ ariaLabel, icone, titulo, valor, carregando, descricao }) {
  return (
    <section className="inicioIndicadorResumo" aria-label={ariaLabel}>
      <div className="inicioIndicadorResumoCabecalho">
        <div className="inicioIndicadorResumoConteudo">
          <span className="inicioIndicadorResumoRotulo">{titulo}</span>
          <strong className="inicioIndicadorResumoValor">
            {carregando ? '...' : valor}
          </strong>
        </div>
        <span className="inicioIndicadorResumoIcone" aria-hidden="true">
          <Icone nome={icone} />
        </span>
      </div>
    </section>
  );
}