import { useEffect, useState } from 'react';
import { CorpoPagina } from '../../componentes/layout/corpoPagina';
import { listarClientes, listarContatos, listarVendedores } from '../../servicos/clientes';
import { ListaClientes } from './listaClientes';

export function CorpoClientes() {
  const [clientes, definirClientes] = useState([]);
  const [carregando, definirCarregando] = useState(true);
  const [mensagemErro, definirMensagemErro] = useState('');

  useEffect(() => {
    async function carregarClientes() {
      try {
        const [clientesCarregados, contatosCarregados, vendedoresCarregados] = await Promise.all([
          listarClientes(),
          listarContatos(),
          listarVendedores()
        ]);
        const contatosPrincipaisPorCliente = new Map();
        const vendedoresPorId = new Map(
          vendedoresCarregados.map((vendedor) => [vendedor.idVendedor, vendedor.nome])
        );

        contatosCarregados.forEach((contato) => {
          if (contato.principal) {
            contatosPrincipaisPorCliente.set(contato.idCliente, contato);
          }
        });

        const clientesComContatoPrincipal = clientesCarregados.map((cliente) => ({
          ...cliente,
          nomeVendedor: vendedoresPorId.get(cliente.idVendedor) || 'Nao informado',
          nomeContatoPrincipal:
            contatosPrincipaisPorCliente.get(cliente.idCliente)?.nome || 'Nao informado',
          emailContatoPrincipal:
            contatosPrincipaisPorCliente.get(cliente.idCliente)?.email || 'E-mail nao informado'
        }));

        definirClientes(clientesComContatoPrincipal);
      } catch (erro) {
        definirMensagemErro('Nao foi possivel carregar os clientes.');
      } finally {
        definirCarregando(false);
      }
    }

    carregarClientes();
  }, []);

  return (
    <CorpoPagina>
      <div className="gradePainelClientes">
        <ListaClientes
          clientes={clientes}
          carregando={carregando}
          mensagemErro={mensagemErro}
        />
      </div>
    </CorpoPagina>
  );
}
