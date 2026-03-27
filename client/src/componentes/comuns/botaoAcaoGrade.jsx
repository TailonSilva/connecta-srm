import { Botao } from './botao';

export function BotaoAcaoGrade({ icone, titulo, className = '', ...props }) {
  const classes = ['botaoAcaoGrade', className].filter(Boolean).join(' ');

  return (
    <Botao
      variante="secundario"
      icone={icone}
      somenteIcone
      className={classes}
      title={titulo}
      aria-label={titulo}
      {...props}
    />
  );
}
