import { Icone } from './icone';
import '../../recursos/estilos/botao.css';

const variantesPermitidas = ['primario', 'secundario', 'complementar', 'perigo'];

export function Botao({
  children,
  variante = 'primario',
  icone,
  somenteIcone = false,
  className = '',
  ...props
}) {
  const varianteNormalizada = variantesPermitidas.includes(variante)
    ? variante
    : 'primario';

  const classes = [
    'botaoBase',
    `botao${capitalizar(varianteNormalizada)}`,
    somenteIcone ? 'botaoSomenteIcone' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} {...props}>
      {icone ? <Icone nome={icone} /> : null}
      {!somenteIcone && children ? <span>{children}</span> : null}
    </button>
  );
}

function capitalizar(valor) {
  return valor.charAt(0).toUpperCase() + valor.slice(1);
}
