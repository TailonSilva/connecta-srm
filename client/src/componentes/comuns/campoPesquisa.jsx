import { forwardRef } from 'react';
import '../../recursos/estilos/campoPesquisa.css';
import { Icone } from './icone';

export const CampoPesquisa = forwardRef(function CampoPesquisa({
  valor,
  aoAlterar,
  placeholder = 'Pesquisar...',
  ariaLabel = 'Pesquisar',
  ...props
}, ref) {
  return (
    <label className="campoPesquisa">
      <Icone nome="pesquisa" className="campoPesquisaIcone" />
      <input
        ref={ref}
        className="campoPesquisaEntrada"
        type="search"
        value={valor}
        onChange={(evento) => aoAlterar(evento.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        {...props}
      />
    </label>
  );
});
