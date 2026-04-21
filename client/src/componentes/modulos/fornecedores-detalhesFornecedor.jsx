import { CodigoRegistro } from '../comuns/codigoRegistro';
import { obterCodigoPrincipalFornecedor } from '../../utilitarios/codigoFornecedor';

export function DetalhesFornecedor({ fornecedor, empresa }) {
  return (
    <div className="celulaRegistroDetalhes">
      <div className="topoRegistroDetalhes">
        <strong>{fornecedor.nomeFantasia || fornecedor.razaoSocial}</strong>
        <CodigoRegistro valor={obterCodigoPrincipalFornecedor(fornecedor, empresa) || 0} />
      </div>

      <span className="textoSecundarioRegistro">{fornecedor.cnpj || 'CNPJ nao informado'}</span>
    </div>
  );
}

