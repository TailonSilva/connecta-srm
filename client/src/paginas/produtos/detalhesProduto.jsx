import { CodigoRegistro } from '../../componentes/comuns/codigoRegistro';

export function DetalhesProduto({ produto }) {
  return (
    <div className="celulaRegistroDetalhes">
      <div className="topoRegistroDetalhes">
        <strong>{produto.referencia ? `REF.: ${produto.referencia}` : 'REF.: nao informada'}</strong>
        <CodigoRegistro valor={produto.idProduto} />
      </div>

      <span className="textoSecundarioRegistro">{produto.descricao}</span>
    </div>
  );
}
