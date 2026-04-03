import { Icone } from '../../../componentes/comuns/icone';
import '../../../recursos/estilos/indicadorResumoInicio.css';

export function IndicadorResumoInicio({ ariaLabel, icone, titulo, valor, carregando, descricao }) {
  const valorTexto = carregando ? '...' : String(valor || '');
  const valorMonetarioCompacto = !carregando && valorTexto.startsWith('R$') && valorTexto.length >= 10;

  return (
    <section className="inicioIndicadorResumo" aria-label={ariaLabel}>
      <div className="inicioIndicadorResumoCabecalho">
        <div className="inicioIndicadorResumoConteudo">
          <span className="inicioIndicadorResumoRotulo">{titulo}</span>
          <strong className={`inicioIndicadorResumoValor ${valorMonetarioCompacto ? 'inicioIndicadorResumoValorCompacto' : ''}`.trim()}>
            {valorTexto}
          </strong>
        </div>
        <span className="inicioIndicadorResumoIcone" aria-hidden="true">
          <Icone nome={icone} />
        </span>
      </div>
    </section>
  );
}