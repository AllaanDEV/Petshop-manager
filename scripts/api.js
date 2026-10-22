const API_URL = "http://localhost:3000";

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok)
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  if (response.status === 204) return null;
  return response.json();
}

const api = {
  // CAT API
  async buscarRacas() {
    try {
      return await request("http://localhost:3001/api/breeds");
    } catch (error) {
      console.error("Erro ao buscar raças:", error);
      return [];
    }
  },

  // CLIENTES
  async buscarClientes() {
    return request(`${API_URL}/clients`);
  },
  async buscarClientePorId(id) {
    return request(`${API_URL}/clients/${id}`);
  },
  async criarCliente(cliente) {
    return request(`${API_URL}/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
    });
  },
  async editarCliente(id, dados) {
    return request(`${API_URL}/clients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  },
  async apagarCliente(id) {
    return request(`${API_URL}/clients/${id}`, { method: "DELETE" });
  },

  // PETS
  async buscarPets() {
    return request(`${API_URL}/pets`);
  },
  async buscarPetPorCliente(clientId) {
    const pets = await this.buscarPets();
    return (
      pets.find((pet) => String(pet.clientId) === String(clientId)) || null
    );
  },
  async criarPet(pet) {
    return request(`${API_URL}/pets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pet),
    });
  },
  async editarPet(id, dados) {
    return request(`${API_URL}/pets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  },
  async apagarPet(id) {
    return request(`${API_URL}/pets/${id}`, { method: "DELETE" });
  },

  async apagarClienteEPet(clienteId) {
    try {
      const pet = await this.buscarPetPorCliente(clienteId);

      if (pet) {
        try {
          await this.apagarPet(pet.id);
        } catch (e) {
          console.warn("Aviso: Pet já não existia.");
        }
      }

      try {
        await this.apagarCliente(clienteId);
      } catch (e) {
        console.warn("Aviso: Cliente já não existia.");
      }

      return true;
    } catch (error) {
      console.error("Erro fatal na exclusão:", error);
      throw error;
    }
  },

  async pesquisar(valor) {
    const termo = valor.trim().toLowerCase();
    if (!termo) return this.buscarClientes();
    const clientes = await this.buscarClientes();
    const pets = await this.buscarPets();
    return clientes.filter((cliente) => {
      const pet = pets.find((p) => String(p.clientId) === String(cliente.id));
      const nomeCliente = cliente.name?.toLowerCase() || "";
      const nomePet = pet?.name?.toLowerCase() || "";
      return nomeCliente.includes(termo) || nomePet.includes(termo);
    });
  },
};

export default api;
