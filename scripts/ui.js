import api from "./api.js";

const cardsGrid = document.getElementById("cards-grid");
const pageDetalhe = document.getElementById("page-detalhe");
const emptyState = document.getElementById("empty-state");

export let fotoEditadaBase64 = null;

export const ui = {
  async renderizarGrid(clientesFiltrados = null) {
    const clientes = clientesFiltrados || (await api.buscarClientes());
    const pets = await api.buscarPets();
    const racas = await api.buscarRacas();

    if (clientes.length === 0) {
      cardsGrid.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    cardsGrid.innerHTML = "";

    clientes.forEach((cliente) => {
      const pet = pets.find((p) => String(p.clientId) === String(cliente.id));
      const racaApi = racas.find((r) => r.id === pet?.breedId);
      cardsGrid.append(criarElementoCard(cliente, pet, racaApi));
    });

    if (!clientesFiltrados) {
      const statClients = document.getElementById("stat-clients");
      const statPets = document.getElementById("stat-pets");
      if (statClients) statClients.textContent = clientes.length;
      if (statPets) statPets.textContent = pets.length;
    }
  },

  alternarTelas(mostrarDetalhes) {
    if (mostrarDetalhes) {
      cardsGrid.classList.add("hidden");
      if (emptyState) emptyState.classList.add("hidden");
      pageDetalhe.classList.add("active");
      window.scrollTo(0, 0);
    } else {
      cardsGrid.classList.remove("hidden");
      pageDetalhe.classList.remove("active");
    }
  },

  limparFormulario() {
    document.getElementById("field-id").value = "";
    document.getElementById("field-name").value = "";
    document.getElementById("field-email").value = "";
    document.getElementById("field-phone").value = "";
    document.getElementById("field-notes").value = "";
    document.getElementById("field-pet-nome").value = "";
    document.getElementById("field-pet-raca").value = "";

    document.getElementById("detalhe-nome").textContent = "Novo Cadastro";
    document.getElementById("detalhe-sub").textContent =
      "Preencha as informações abaixo";

    const avatar = document.getElementById("detalhe-avatar");
    avatar.removeAttribute("src");
    avatar.src = "";
    avatar.classList.add("hidden");
    document.getElementById("sem-foto").classList.remove("hidden");
    document.getElementById("detalhe-historico").innerHTML =
      "<p class='historico'>Nenhum registro ainda</p>";

    fotoEditadaBase64 = null;
    document.getElementById("btn-salvar").textContent = "Salvar Cadastro";
  },

  preencherFormulario(cliente, pet, racaApi) {
    document.getElementById("field-id").value = cliente.id;
    document.getElementById("field-name").value = cliente.name || "";
    document.getElementById("field-email").value = cliente.email || "";
    document.getElementById("field-phone").value = cliente.phone || "";
    document.getElementById("field-notes").value = cliente.notes || "";

    document.getElementById("field-pet-nome").value = pet?.name || "";
    document.getElementById("field-pet-raca").value = pet?.breedId || "";

    // Ajustado para mostrar claramente o nome do pet ou avisar se não houver
    document.getElementById("detalhe-nome").textContent =
      pet?.name || "Pet sem Nome";
    document.getElementById("detalhe-sub").textContent = pet?.breedId
      ? `Raça: ${pet.breedId}`
      : "Raça não definida";

    const avatar = document.getElementById("detalhe-avatar");
    const semFoto = document.getElementById("sem-foto");

    let srcImg = "";
    if (pet?.fotoSelecionada) {
      srcImg = pet.fotoSelecionada;
    } else if (racaApi?.reference_image_id) {
      srcImg = `https://cdn2.thecatapi.com/images/${racaApi.reference_image_id}.jpg`;
    }

    if (srcImg) {
      avatar.src = srcImg;
      avatar.classList.remove("hidden");
      semFoto.classList.add("hidden");
      fotoEditadaBase64 = pet?.fotoSelecionada || null;

      avatar.onerror = () => {
        avatar.removeAttribute("src");
        avatar.classList.add("hidden");
        semFoto.classList.remove("hidden");
      };
    } else {
      avatar.removeAttribute("src");
      avatar.classList.add("hidden");
      semFoto.classList.remove("hidden");
      fotoEditadaBase64 = null;
    }

    const histContainer = document.getElementById("detalhe-historico");
    histContainer.innerHTML = "";
    if (pet?.history && pet.history.length > 0) {
      pet.history.forEach((h) => {
        const div = document.createElement("div");
        div.className = "historico-item";
        div.innerHTML = `<span class="historico-item__data">${h.date}</span><span>${h.type} · ${h.notes}</span>`;
        histContainer.append(div);
      });
    } else {
      histContainer.innerHTML =
        "<p class='historico'>Não há nada no histórico</p>";
    }

    document.getElementById("btn-salvar").textContent = "Atualizar Dados";
  },
  mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-msg");
    if (toast && toastMsg) {
      toastMsg.textContent = mensagem; // Alterado de 'message' para 'mensagem'
      toast.classList.add("toast--visible");
      setTimeout(() => toast.classList.remove("toast--visible"), 3000);
    }
  },
};

function criarElementoCard(cliente, pet, racaApi) {
  const card = document.createElement("article");
  card.className = "card";

  let srcImg = "";
  if (pet?.fotoSelecionada) srcImg = pet.fotoSelecionada;
  else if (racaApi?.reference_image_id)
    srcImg = `https://cdn2.thecatapi.com/images/${racaApi.reference_image_id}.jpg`;

  const img = document.createElement("img");
  img.className = "card__img";
  if (srcImg) {
    img.src = srcImg;

    img.onerror = () => {
      img.removeAttribute("src");
      img.classList.add("hidden");
      img.style.display = "none";
    };
  } else {
    img.removeAttribute("src");
    img.classList.add("hidden");
    img.style.display = "none";
  }

  const body = document.createElement("div");
  body.className = "card__body";
  body.innerHTML = `
    <h3 class="card__name">${pet?.name || "Sem nome"}</h3>
    <p class="card__detail">👤 ${cliente.name}</p>
    <p class="card__detail card__detail--muted">${cliente.notes || "Sem observações"}</p>
  `;

  const actions = document.createElement("div");
  actions.className = "card__actions";

  const btnEdit = document.createElement("button");
  btnEdit.className = "btn-icon btn-icon--edit";
  btnEdit.textContent = "✏️";
  btnEdit.onclick = (e) => {
    e.stopPropagation();
    document.dispatchEvent(
      new CustomEvent("selecionarCard", { detail: { cliente, pet, racaApi } }),
    );
  };

  const btnDel = document.createElement("button");
  btnDel.className = "btn-icon btn-icon--delete";
  btnDel.textContent = "🗑️";
  btnDel.onclick = (e) => {
    e.stopPropagation();
    document.dispatchEvent(
      new CustomEvent("deleteCard", { detail: { clienteId: cliente.id } }),
    );
  };

  actions.append(btnEdit, btnDel);
  card.append(img, body, actions);

  // Unificado: Qualquer clique no card abre o formulário pronto para edição
  card.onclick = () => {
    document.dispatchEvent(
      new CustomEvent("selecionarCard", { detail: { cliente, pet, racaApi } }),
    );
  };

  return card;
}

// LÓGICA DE UPLOAD DE IMAGEM VIA CLIQUE NA CAMERA/AVATAR
const inputUpload = document.getElementById("upload-avatar");
const avatarPai = document.querySelector(".detalhe-hero");

if (avatarPai && inputUpload) {
  avatarPai.addEventListener("click", (e) => {
    if (e.target.id === "detalhe-avatar" || e.target.id === "sem-foto")
      inputUpload.click();
  });

  inputUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 400;
        let w = img.width,
          h = img.height;

        if (w > MAX || h > MAX) {
          if (w > h) {
            h *= MAX / w;
            w = MAX;
          } else {
            w *= MAX / h;
            h = MAX;
          }
        }

        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        fotoEditadaBase64 = canvas.toDataURL("image/jpeg", 0.7);

        const avatar = document.getElementById("detalhe-avatar");
        avatar.src = fotoEditadaBase64;
        avatar.classList.remove("hidden");
        document.getElementById("sem-foto").classList.add("hidden");
      };
    };
  });
}
