const caminhosIcones = {
  adicionar: (
    <path d="M12 5v14M5 12h14" />
  ),
  importar: (
    <path d="M12 4v10m0-10 3.5 3.5M12 4 8.5 7.5M5 15.5V18a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 18v-2.5" />
  ),
  sair: (
    <path d="M10 6.5V5A1.5 1.5 0 0 1 11.5 3.5h5A1.5 1.5 0 0 1 18 5v14a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 10 19v-1.5M14 12H4m0 0 3-3m-3 3 3 3" />
  ),
  pesquisa: (
    <path d="M10.5 17a6.5 6.5 0 1 1 4.63-1.9L20 20" />
  ),
  consultar: (
    <path d="M2.5 12s3.8-6 9.5-6 9.5 6 9.5 6-3.8 6-9.5 6-9.5-6-9.5-6Zm9.5-2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
  ),
  editar: (
    <path d="m4 20 4.2-1 9.3-9.3a1.8 1.8 0 0 0 0-2.5l-.7-.7a1.8 1.8 0 0 0-2.5 0L5 15.8 4 20Zm8.8-11.8 3 3" />
  ),
  inativar: (
    <path d="M6 6l12 12M9.5 9.5a3.5 3.5 0 0 1 5 5M5 12s2.2-3.5 5.7-5m2.9-.3c4.2.7 7.1 5.3 7.1 5.3a17.9 17.9 0 0 1-2.8 3.4M8.8 16.2A10.8 10.8 0 0 1 3.3 12" />
  )
};

export function Icone({ nome, className = '' }) {
  const classes = ['iconeBase', className].filter(Boolean).join(' ');

  return (
    <svg viewBox="0 0 24 24" className={classes} aria-hidden="true">
      {caminhosIcones[nome]}
    </svg>
  );
}
