import '../../../recursos/estilos/indicadorConfiguravelInicio.css';

export function IndicadorConfiguravelInicio({ colunas = 2, children }) {
  const span = Math.max(1, Math.min(10, Number(colunas) || 1));

  return (
    <div
      className="inicioIndicadorConfiguravel"
      style={{ '--inicio-indicador-span': span }}
    >
      {children}
    </div>
  );
}
