import { CodigoRegistro } from '../comuns/codigoRegistro';
import { obterCodigoPrincipalCliente } from '../../utilitarios/codigoCliente';

export function DetalhesFornecedor({ cliente, empresa }) {
  return (
    <div className="celulaRegistroDetalhes">
      <div className="topoRegistroDetalhes">
        <strong>{cliente.nomeFantasia || cliente.razaoSocial}</strong>
        <CodigoRegistro valor={obterCodigoPrincipalCliente(cliente, empresa) || 0} />
      </div>

      <span className="textoSecundarioRegistro">{cliente.cnpj || 'CNPJ nao informado'}</span>
    </div>
  );
}

