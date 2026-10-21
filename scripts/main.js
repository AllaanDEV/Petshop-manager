import { ui, fotoEditadaBase64 } from "./ui.js";
import api from "./api.js";

// Estado da Aplicação
const appState = {
  isEditing: false,
  clienteId: null,
  petId: null,
};

document.addEventListener("DOMContentLoaded", async () => {
  // Inicializa o Grid principal
  await ui.renderizarGrid();

  // Ação: Botão Novo Cadastro
  document.getElementById("btn-new").addEventListener("click", () => {
    appState.isEditing = false;
    appState.clienteId = null;
    appState.petId = null;
    
    ui.limparFormulario();
    ui.alternarTelas(true);
  });

  // Ação: Botão Voltar
  document.getElementById("btn-back").addEventListener("click", () => {
    ui.alternarTelas(false);
  });

  // Ação: Filtro de Busca Dinâmica
  document.getElementById("search-input").addEventListener("input", async (e) => {
    const termo = e.target.value.trim();
    const clientesFiltrados = await api.pesquisar(termo);
    await ui.renderizarGrid(clientesFiltrados);
  });

  // Ação: Envio do Formulário (Salvar / Atualizar) com Validação Regex
  document.getElementById("btn-salvar").addEventListener("click", async (e) => {
    e.preventDefault();
    const btn = e.target;

    // 1. Captura de Valores dos Inputs
    const name = document.getElementById("field-name").value.trim();
    const email = document.getElementById("field-email").value.trim();
    const phone = document.getElementById("field-phone").value.trim();
    const notes = document.getElementById("field-notes").value.trim();
    const petNome = document.getElementById("field-pet-nome").value.trim();
    const breedId = document.getElementById("field-pet-raca").value.trim();

    // 2. Definição das Expressões Regulares (Regex)
    const regexNome = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexPhone = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    const regexPet = /^[a-zA-ZÀ-ÿ0-9\s]{2,30}$/;

    // 3. Execução das Validações
    if (!regexNome.test(name)) {
      alert("Nome do tutor inválido. Use apenas letras (mínimo de 2 caracteres).");
      return;
    }
    if (email && !regexEmail.test(email)) {
      alert("Formato de e-mail inválido. Exemplo: nome@dominio.com");
      return;
    }
    if (phone && !regexPhone.test(phone)) {
      alert("Telefone inválido. Siga o formato padrão: (11) 99999-9999");
      return;
    }
    if (petNome && !regexPet.test(petNome)) {
      alert("Nome do pet inválido. Use apenas letras e números.");
      return;
    }

    // Passou nas validações, inicia processamento
    btn.disabled = true;
    btn.textContent = "Processando...";

    try {
      if (appState.isEditing) {
        // --- FLUXO DE EDIÇÃO ---
        await api.editarCliente(appState.clienteId, { name, email, phone, notes });
        
        if (appState.petId) {
          // Se o pet já existia, atualiza os dados dele
          await api.editarPet(appState.petId, {
            name: petNome,
            breedId,
            fotoSelecionada: fotoEditadaBase64
          });
        } else if (petNome) {
          // Se o cliente não possuía pet cadastrado e digitou um nome agora, cria um novo pet vinculado
          await api.criarPet({
            clientId: appState.clienteId,
            name: petNome,
            age: 0,
            breedId,
            history: [],
            fotoSelecionada: fotoEditadaBase64
          });
        }
        ui.mostrarToast("Registro atualizado com sucesso!");
      } else {
        // --- FLUXO DE CRIAÇÃO ---
        const novoCliente = await api.criarCliente({ name, email, phone, notes });
        
        if (petNome) {
          // Cria o pet obrigatoriamente amarrado ao ID gerado para o novo cliente
          await api.criarPet({
            clientId: novoCliente.id,
            name: petNome,
            age: 0,
            breedId,
            history: [],
            fotoSelecionada: fotoEditadaBase64
          });
        }
        ui.mostrarToast("Novo cadastro realizado com sucesso!");
      }

      ui.alternarTelas(false);
      await ui.renderizarGrid();
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
      alert("Houve um problema técnico ao tentar gravar as informações.");
    } finally {
      btn.disabled = false;
      btn.textContent = appState.isEditing ? "Atualizar Dados" : "Salvar Cadastro";
    }
  });
});

// ==================================================
// ESCUTADORES DE EVENTOS PERSONALIZADOS (CUSTOM EVENTS)
// ==================================================

// Ouvinte Unificado para Seleção de Card (Clique no card ou no Lápis)
document.addEventListener("selecionarCard", (e) => {
  const { cliente, pet, racaApi } = e.detail;
  
  appState.isEditing = true;
  appState.clienteId = cliente.id;
  appState.petId = pet?.id || null;

  ui.preencherFormulario(cliente, pet, racaApi);
  ui.alternarTelas(true);
});

// Ouvinte para Remoção de Cadastro
document.addEventListener("deleteCard", (e) => {
  const { clienteId } = e.detail;
  const modal = document.getElementById("confirm-overlay");
  if (modal) modal.classList.add("modal--open");

  const btnDelete = document.getElementById("confirm-delete");
  if (btnDelete) {
    const newBtnDelete = btnDelete.cloneNode(true);
    btnDelete.replaceWith(newBtnDelete);

    newBtnDelete.addEventListener("click", async (evento) => {
      const botao = evento.target;
      botao.disabled = true; // <-- BLOQUEIA DUPLO CLIQUE!
      botao.textContent = "Excluindo...";

      await api.apagarClienteEPet(clienteId);
      
      if (modal) modal.classList.remove("modal--open");
      ui.mostrarToast("Cadastro excluído com sucesso!");
      await ui.renderizarGrid();

      botao.disabled = false; // Libera o botão
      botao.textContent = "Excluir";
    });
  }

  const btnCancel = document.getElementById("confirm-cancel");
  if (btnCancel) {
    btnCancel.onclick = () => {
      if (modal) modal.classList.remove("modal--open");
    };
  }
});