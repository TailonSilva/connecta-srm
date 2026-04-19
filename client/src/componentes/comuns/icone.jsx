import '../../recursos/estilos/icone.css';

const caminhosIcones = {
  inicio: (
    <path d="M4 11.5 12 5l8 6.5V20h-5.5v-5h-5v5H4z" />
  ),
  agenda: (
    <path d="M7 3.5V6m10-2.5V6M5.5 8.5h13M6.5 5h11A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5v-11A1.5 1.5 0 0 1 6.5 5Zm1.5 6h3v3H8Z" />
  ),
  atendimentos: (
    <path d="M7 5.5h10A1.5 1.5 0 0 1 18.5 7v12L15 16.5H7A1.5 1.5 0 0 1 5.5 15V7A1.5 1.5 0 0 1 7 5.5Zm2.5 3h5m-5 3h6m-6 3h3" />
  ),
  manual: (
    <>
      <path d="M6.5 5.5h8.5A2.5 2.5 0 0 1 17.5 8v10.5H9A2.5 2.5 0 0 0 6.5 21Z" />
      <path d="M17.5 18.5H9A2.5 2.5 0 0 0 6.5 21V8A2.5 2.5 0 0 1 9 5.5h8.5Z" />
      <path d="M9.5 9h5.5M9.5 12h5.5M9.5 15h3.5" />
    </>
  ),
  clientes: (
    <path d="M12 12.5a4.25 4.25 0 1 0-4.25-4.25A4.25 4.25 0 0 0 12 12.5Zm0 2c-4.7 0-8.5 2.35-8.5 5.25V21h17v-1.25c0-2.9-3.8-5.25-8.5-5.25Z" />
  ),
  produtos: (
    <path d="M4.5 7.5 12 4l7.5 3.5L12 11 4.5 7.5Zm0 3.5L11 14v6L4.5 17Zm15 0V17L13 20v-6Z" />
  ),
  configuracoes: (
    <>
      <path d="M6 7.5h12" />
      <path d="M6 12h12" />
      <path d="M6 16.5h12" />
      <circle cx="9" cy="7.5" r="1.75" />
      <circle cx="15" cy="12" r="1.75" />
      <circle cx="11" cy="16.5" r="1.75" />
    </>
  ),
  lista: (
    <>
      <path d="M8 7h11M8 12h11M8 17h11" />
      <circle cx="5" cy="7" r="1" />
      <circle cx="5" cy="12" r="1" />
      <circle cx="5" cy="17" r="1" />
    </>
  ),
  adicionar: (
    <path d="M12 5v14M5 12h14" />
  ),
  importar: (
    <path d="M12 4v10m0-10 3.5 3.5M12 4 8.5 7.5M5 15.5V18a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 18v-2.5" />
  ),
  filtro: (
    <path d="M4 6h16M7 12h10M10 18h4" />
  ),
  anterior: (
    <path d="m14.5 6.5-5 5.5 5 5.5" />
  ),
  proximo: (
    <path d="m9.5 6.5 5 5.5-5 5.5" />
  ),
  sair: (
    <path d="M10 6.5V5A1.5 1.5 0 0 1 11.5 3.5h5A1.5 1.5 0 0 1 18 5v14a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 10 19v-1.5M14 12H4m0 0 3-3m-3 3 3 3" />
  ),
  fechar: (
    <path d="M6 6l12 12M18 6 6 18" />
  ),
  confirmar: (
    <path d="m5.5 12.5 4 4 9-9" />
  ),
  alerta: (
    <>
      <path d="M12 4.5 20 19.5H4Z" />
      <path d="M12 9v4.5M12 16.5h.01" />
    </>
  ),
  informacao: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 10v5" />
      <path d="M12 7.8h.01" />
    </>
  ),
  limpar: (
    <>
      <path d="M6 7.5h12" />
      <path d="M9 7.5V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5" />
      <path d="M8 7.5l.8 10.5a1 1 0 0 0 1 .9h4.4a1 1 0 0 0 1-.9L16 7.5" />
      <path d="M10.5 10.5v5M13.5 10.5v5" />
    </>
  ),
  pesquisa: (
    <path d="M10.5 17a6.5 6.5 0 1 1 4.63-1.9L20 20" />
  ),
  upload: (
    <path d="M12 16V5m0 0 4 4m-4-4-4 4M5 16.5V18a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 18v-1.5" />
  ),
  consultar: (
    <path d="M2.5 12s3.8-6 9.5-6 9.5 6 9.5 6-3.8 6-9.5 6-9.5-6-9.5-6Zm9.5-2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
  ),
  editar: (
    <path d="m4 20 4.2-1 9.3-9.3a1.8 1.8 0 0 0 0-2.5l-.7-.7a1.8 1.8 0 0 0-2.5 0L5 15.8 4 20Zm8.8-11.8 3 3" />
  ),
  inativar: (
    <path d="M6 6l12 12M9.5 9.5a3.5 3.5 0 0 1 5 5M5 12s2.2-3.5 5.7-5m2.9-.3c4.2.7 7.1 5.3 7.1 5.3a17.9 17.9 0 0 1-2.8 3.4M8.8 16.2A10.8 10.8 0 0 1 3.3 12" />
  ),
  cadastro: (
    <>
      <path d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v12A1.5 1.5 0 0 1 17 19.5H7A1.5 1.5 0 0 1 5.5 18V6A1.5 1.5 0 0 1 7 4.5Z" />
      <path d="M9 9h6M9 13h6M9 17h4" />
    </>
  ),
  usuarios: (
    <>
      <path d="M8.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M4.5 18.5c0-2.3 2-4 4-4s4 1.7 4 4M11.5 18.5c0-2.3 2-4 4-4s4 1.7 4 4" />
    </>
  ),
  caixa: (
    <>
      <path d="M4.5 7.5 12 4l7.5 3.5L12 11 4.5 7.5Z" />
      <path d="M4.5 7.5V16.5L12 20l7.5-3.5V7.5" />
      <path d="M12 11v9" />
    </>
  ),
  selo: (
    <>
      <path d="M12 4.5 18 7v5.5c0 4.1-2.6 6.3-6 7.5-3.4-1.2-6-3.4-6-7.5V7Z" />
      <path d="m9.5 12 1.7 1.7 3.3-3.7" />
    </>
  ),
  medida: (
    <>
      <path d="M5 15.5 15.5 5a1.4 1.4 0 0 1 2 0l1.5 1.5a1.4 1.4 0 0 1 0 2L8.5 19H5Z" />
      <path d="M13 7.5 16.5 11M9.8 10.7l1.8 1.8M7.2 13.3 9 15.1" />
    </>
  ),
  empresa: (
    <>
      <path d="M6 19.5V6.5A1.5 1.5 0 0 1 7.5 5h9A1.5 1.5 0 0 1 18 6.5v13" />
      <path d="M4.5 19.5h15M9 8.5h1.5M13.5 8.5H15M9 12h1.5M13.5 12H15M11 19.5v-3h2v3" />
    </>
  ),
  contato: (
    <>
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
      <path d="M4.5 19.5c.9-3 3.9-4.5 7.5-4.5s6.6 1.5 7.5 4.5" />
      <path d="m18.5 5.5 2 2M20.5 5.5l-2 2" />
    </>
  ),
  mensagem: (
    <>
      <path d="M6 5.5h12A1.5 1.5 0 0 1 19.5 7v8A1.5 1.5 0 0 1 18 16.5H10l-4.5 3v-3H6A1.5 1.5 0 0 1 4.5 15V7A1.5 1.5 0 0 1 6 5.5Z" />
      <path d="M8.5 9.5h7M8.5 12.5h4.5" />
    </>
  ),
  pagamento: (
    <>
      <path d="M5 7.5h14A1.5 1.5 0 0 1 20.5 9v6A1.5 1.5 0 0 1 19 16.5H5A1.5 1.5 0 0 1 3.5 15V9A1.5 1.5 0 0 1 5 7.5Z" />
      <path d="M3.5 10.5h17M7 14h3" />
    </>
  ),
  cotacao: (
    <>
      <path d="M6.5 4.5h8l3 3V18A1.5 1.5 0 0 1 16 19.5H8A1.5 1.5 0 0 1 6.5 18Z" />
      <path d="M14.5 4.5V8h3M9 11h6M9 14h6" />
    </>
  ),
  pedido: (
    <>
      <path d="M6.5 4.5h8l3 3V18A1.5 1.5 0 0 1 16 19.5H8A1.5 1.5 0 0 1 6.5 18Z" />
      <path d="M14.5 4.5V8h3M9 11h6M9 14h6M9 17h4" />
      <path d="m15.5 15.5 1.5 1.5 2.5-3" />
    </>
  ),
  pdf: (
    <>
      <path d="M6.5 4.5h8l3 3V18A1.5 1.5 0 0 1 16 19.5H8A1.5 1.5 0 0 1 6.5 18Z" />
      <path d="M14.5 4.5V8h3" />
      <path d="M8.8 15.8v-4.6h1.9a1.3 1.3 0 1 1 0 2.6H8.8" />
      <path d="M13 15.8v-4.6h1.1a2 2 0 0 1 0 4.6H13Z" />
      <path d="M16.8 11.2h2.4M16.8 13.4h1.8M16.8 15.8v-4.6" />
    </>
  ),
  tamanho: (
    <>
      <path d="M5 8.5h14M5 15.5h14" />
      <path d="m8 5.5-3 3 3 3M16 5.5l3 3-3 3M8 12.5l-3 3 3 3M16 12.5l3 3-3 3" />
    </>
  )
};

const aliasesIcones = {
  cotacoes: 'cotacao',
  orcamento: 'cotacao',
  orcamentos: 'cotacao',
  pedidos: 'pedido',
  ordemCompra: 'pedido',
  ordensCompra: 'pedido'
};

export function Icone({ nome, className = '' }) {
  const classes = ['iconeBase', className].filter(Boolean).join(' ');
  const caminho = caminhosIcones[nome] || caminhosIcones[aliasesIcones[nome]];

  return (
    <svg viewBox="0 0 24 24" className={classes} aria-hidden="true">
      {caminho}
    </svg>
  );
}
