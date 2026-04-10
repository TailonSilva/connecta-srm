import '../../../recursos/estilos/secaoConfiguravelInicio.css';

export function SecaoConfiguravelInicio({ colunas = 5, children }) {
  const span = Math.max(1, Math.min(10, Number(colunas) || 1));

  return (
    <div
      className="paginaInicioSecaoConfiguravel"
      style={{ '--pagina-inicio-span': span }}
    >
      {children}
    </div>
  );
}
