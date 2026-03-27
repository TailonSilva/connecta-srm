export function BotaoMenu({
  children,
  ativo = false,
  className = '',
  ...props
}) {
  const classes = ['botaoMenu', ativo ? 'ativo' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
