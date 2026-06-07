const today = new Date().toISOString().slice(0, 10);

const coinPackages = [
  { id: "start", name: "Start", coins: 800, price: 70, description: "Para testar as primeiras oportunidades." },
  { id: "pro", name: "Pro", coins: 1400, price: 110, description: "Melhor para profissionais ativos." },
  { id: "max", name: "Max", coins: 2200, price: 150, description: "Mais vantagem para quem atende todo dia." }
];

const leadCosts = {
  normal: 80,
  today: 160,
  week: 110
};

const maxUnlocksPerRequest = 4;

const professionCatalog = [
  {
    group: "Casa e manutencao",
    items: [
      { profession: "Eletricista", areas: ["Instalacao eletrica", "Tomadas e disjuntores", "Chuveiro", "Iluminacao"] },
      { profession: "Encanador", areas: ["Vazamentos", "Desentupimento", "Instalacao hidraulica", "Caixa d'agua"] },
      { profession: "Pedreiro", areas: ["Reforma", "Piso e revestimento", "Pintura", "Drywall"] },
      { profession: "Diarista", areas: ["Faxina residencial", "Pos-obra", "Passadoria", "Limpeza recorrente"] },
      { profession: "Montador de moveis", areas: ["Moveis planejados", "Guarda-roupa", "Cozinha", "Escritorio"] }
    ]
  },
  {
    group: "Digital e tecnologia",
    items: [
      { profession: "Desenvolvedor de sistemas", areas: ["Sites e sistemas", "Aplicativos", "APIs", "Automacoes"] },
      { profession: "Designer", areas: ["Identidade visual", "Social media", "UX/UI", "Criacao de logo"] },
      { profession: "Social media", areas: ["Calendario de conteudo", "Reels", "Anuncios", "Gestao de Instagram"] },
      { profession: "Suporte de TI", areas: ["Computadores", "Redes", "Impressoras", "Seguranca"] },
      { profession: "Editor de video", areas: ["Videos curtos", "Aulas", "YouTube", "Legenda"] }
    ]
  },
  {
    group: "Beleza, saude e aulas",
    items: [
      { profession: "Cabeleireiro", areas: ["Corte", "Coloracao", "Escova", "Tratamento"] },
      { profession: "Manicure", areas: ["Unha simples", "Alongamento", "Decoracao", "Pedicure"] },
      { profession: "Personal trainer", areas: ["Treino presencial", "Online", "Emagrecimento", "Hipertrofia"] },
      { profession: "Terapeuta", areas: ["Atendimento online", "Massagem", "Bem-estar", "Terapias integrativas"] },
      { profession: "Professor particular", areas: ["Matematica", "Ingles", "Programacao", "Reforco escolar"] }
    ]
  },
  {
    group: "Eventos e negocios",
    items: [
      { profession: "Fotografo", areas: ["Casamento", "Aniversario", "Produto", "Ensaio"] },
      { profession: "Buffet", areas: ["Festa infantil", "Corporativo", "Coffee break", "Churrasco"] },
      { profession: "Consultor financeiro", areas: ["MEI", "Precificacao", "Fluxo de caixa", "Organizacao"] },
      { profession: "Advogado", areas: ["Contratos", "Consumidor", "Trabalhista", "Empresarial"] },
      { profession: "Contador", areas: ["MEI", "Imposto de renda", "Abertura de empresa", "Folha de pagamento"] }
    ]
  }
];

const initialState = {
  wallet: 800,
  revenue: 70,
  purchases: [{ packageId: "start", coins: 800, price: 70, date: today }],
  professionals: [
    { id: crypto.randomUUID(), name: "Joao Reparos", phone: "5511999991000", category: "Reformas e reparos", city: "Sao Paulo" },
    { id: crypto.randomUUID(), name: "Bruna Clean", phone: "5511988882000", category: "Limpeza residencial", city: "Osasco" }
  ],
  requests: [
    {
      id: crypto.randomUUID(),
      customerName: "Amanda Silva",
      customerPhone: "5511977773000",
      category: "Reformas e reparos",
      serviceType: "Orcamento para agora",
      location: "Sao Paulo - Mooca",
      urgency: "today",
      budget: 450,
      description: "Preciso trocar duas tomadas e instalar uma luminaria ainda hoje.",
      status: "open",
      unlocked: false,
      unlockedCount: 0,
      createdAt: today
    },
    {
      id: crypto.randomUUID(),
      customerName: "Marcos Lima",
      customerPhone: "5511966664000",
      category: "Limpeza residencial",
      serviceType: "Servico recorrente",
      location: "Guarulhos - Centro",
      urgency: "week",
      budget: 220,
      description: "Procuro faxina completa para apartamento pequeno nesta semana.",
      status: "open",
      unlocked: false,
      unlockedCount: 0,
      createdAt: today
    }
  ]
};

let state = loadState();
let leadSearch = "";
let leadFilter = "all";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const elements = {
  navButtons: document.querySelectorAll(".nav-button"),
  views: document.querySelectorAll(".view"),
  homeSections: document.querySelectorAll(".home-section"),
  walletBalance: document.querySelector("#walletBalance"),
  requestForm: document.querySelector("#requestForm"),
  professionalForm: document.querySelector("#professionalForm"),
  professionPanel: document.querySelector("#professionPanel"),
  hourCalculator: document.querySelector("#hourCalculator"),
  projectCalculator: document.querySelector("#projectCalculator"),
  leadList: document.querySelector("#leadList"),
  professionalList: document.querySelector("#professionalList"),
  coinPackages: document.querySelector("#coinPackages"),
  adminSummary: document.querySelector("#adminSummary"),
  hourValue: document.querySelector("#hourValue"),
  projectValue: document.querySelector("#projectValue"),
  leadSearch: document.querySelector("#leadSearch"),
  leadFilter: document.querySelector("#leadFilter"),
  clearData: document.querySelector("#clearData"),
  requestCount: document.querySelector("#requestCount"),
  openLeadCount: document.querySelector("#openLeadCount"),
  professionalCount: document.querySelector("#professionalCount"),
  revenueTotal: document.querySelector("#revenueTotal")
};

elements.navButtons.forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view, true));
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.jump, true));
});

document.querySelectorAll("[data-category-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    switchView("pedir", true);
    document.querySelector("#requestCategory").value = button.dataset.categoryJump;
    document.querySelector("#requestLocation").focus();
  });
});

elements.requestForm.addEventListener("submit", createRequest);
elements.professionalForm.addEventListener("submit", createProfessional);
document.querySelector("#professionalCategory").addEventListener("click", () => {
  elements.professionPanel.classList.toggle("open");
});
document.addEventListener("click", closeProfessionPicker);
elements.hourCalculator.addEventListener("input", renderCalculator);
elements.projectCalculator.addEventListener("input", renderCalculator);
elements.leadSearch.addEventListener("input", (event) => {
  leadSearch = event.target.value.trim().toLowerCase();
  renderLeads();
});
elements.leadFilter.addEventListener("change", (event) => {
  leadFilter = event.target.value;
  renderLeads();
});
elements.clearData.addEventListener("click", clearDemo);

render();
renderProfessionPicker();
openInitialView();

function loadState() {
  const saved = localStorage.getItem("jobbi-state");
  if (!saved) {
    return structuredClone(initialState);
  }

  try {
    return normalizeState(JSON.parse(saved));
  } catch {
    return structuredClone(initialState);
  }
}

function normalizeState(value) {
  return {
    wallet: Number(value.wallet || 0),
    revenue: Number(value.revenue || 0),
    purchases: Array.isArray(value.purchases) ? value.purchases : [],
    professionals: Array.isArray(value.professionals) ? value.professionals : [],
    requests: Array.isArray(value.requests) ? value.requests.map(normalizeRequest) : []
  };
}

function normalizeRequest(request) {
  const unlockedCount = Number(request.unlockedCount ?? (request.unlocked ? 1 : 0));
  return {
    ...request,
    serviceType: request.serviceType || "Orcamento para agora",
    unlockedCount,
    unlocked: Boolean(request.unlocked || unlockedCount > 0)
  };
}

function saveState() {
  localStorage.setItem("jobbi-state", JSON.stringify(state));
}

function render() {
  renderMetrics();
  renderLeads();
  renderProfessionals();
  renderCoinPackages();
  renderAdmin();
  renderCalculator();
}

function renderMetrics() {
  const open = state.requests.filter((request) => request.status === "open" && !isRequestClosed(request));
  elements.walletBalance.textContent = `${state.wallet} moedas`;
  elements.requestCount.textContent = state.requests.length;
  elements.openLeadCount.textContent = open.length;
  elements.professionalCount.textContent = state.professionals.length;
  elements.revenueTotal.textContent = currency.format(state.revenue);
}

function renderLeads() {
  const requests = state.requests.filter((request) => {
    const text = `${request.customerName} ${request.category} ${request.location} ${request.description}`.toLowerCase();
    const matchesText = !leadSearch || text.includes(leadSearch);
    const matchesFilter = leadFilter === "all" ||
      (leadFilter === "open" && !isRequestClosed(request)) ||
      (leadFilter === "unlocked" && request.unlocked);
    return matchesText && matchesFilter;
  });

  if (!requests.length) {
    elements.leadList.innerHTML = '<div class="lead-card">Nenhuma oportunidade encontrada.</div>';
    return;
  }

  elements.leadList.innerHTML = requests.map((request) => {
    const cost = getLeadCost(request.urgency);
    const closed = isRequestClosed(request);
    const unlockLabel = request.unlocked ? `${request.unlockedCount}/${maxUnlocksPerRequest} liberados` : `${cost} moedas`;
    return `
      <article class="lead-card">
        <div>
          <span class="status ${request.unlocked ? "unlocked" : ""} ${closed ? "closed" : ""}">${closed ? "Encerrado" : unlockLabel}</span>
          <h3>${escapeHtml(request.category)} em ${escapeHtml(request.location)}</h3>
          <p class="meta">${urgencyLabel(request.urgency)} · ${escapeHtml(request.serviceType)} · Orcamento ${currency.format(Number(request.budget))} · ${formatDate(request.createdAt)} · expira em 48h</p>
          <p>${escapeHtml(request.description)}</p>
          <div class="lead-detail-grid">
            <span>Online</span>
            <span>${urgencyLabel(request.urgency)}</span>
            <span>${request.unlockedCount}/${maxUnlocksPerRequest} interessados</span>
          </div>
          ${request.unlocked ? `<p class="meta"><strong>Contato:</strong> ${escapeHtml(request.customerName)} · WhatsApp ${escapeHtml(request.customerPhone)}</p>` : ""}
        </div>
        <div class="row-actions">
          ${request.unlocked ? `<a class="primary-action" href="https://wa.me/${request.customerPhone}" target="_blank" rel="noreferrer">WhatsApp</a>` : ""}
          ${closed ? "" : `<button class="primary-action" type="button" data-unlock="${request.id}">Liberar contato</button>`}
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll("[data-unlock]").forEach((button) => {
    button.addEventListener("click", () => unlockLead(button.dataset.unlock));
  });
}

function renderProfessionals() {
  if (!state.professionals.length) {
    elements.professionalList.innerHTML = '<div class="professional-card">Nenhum profissional cadastrado.</div>';
    return;
  }

  elements.professionalList.innerHTML = state.professionals.map((professional) => `
    <article class="professional-card">
      <div>
        <h3>${escapeHtml(professional.name)}</h3>
        <p class="meta">${escapeHtml(professional.category)} · ${escapeHtml(professional.city)} · WhatsApp ${escapeHtml(professional.phone)}</p>
      </div>
      <button class="text-button danger" type="button" data-delete-professional="${professional.id}">Remover</button>
    </article>
  `).join("");

  document.querySelectorAll("[data-delete-professional]").forEach((button) => {
    button.addEventListener("click", () => deleteProfessional(button.dataset.deleteProfessional));
  });
}

function renderCoinPackages() {
  elements.coinPackages.innerHTML = coinPackages.map((item) => `
    <article class="price-card">
      <span>${item.name}</span>
      <strong>${item.coins.toLocaleString("pt-BR")} moedas</strong>
      <h3>${currency.format(item.price)}</h3>
      <p class="installment">3x de ${currency.format(item.price / 3)} · a vista ${currency.format(item.price)}</p>
      <p class="meta">${item.description}</p>
      <button class="primary-action" type="button" data-buy="${item.id}">Comprar pacote</button>
    </article>
  `).join("");

  document.querySelectorAll("[data-buy]").forEach((button) => {
    button.addEventListener("click", () => buyPackage(button.dataset.buy));
  });
}

function renderAdmin() {
  const unlocked = state.requests.filter((request) => request.unlocked).length;
  const avgTicket = state.purchases.length ? state.revenue / state.purchases.length : 0;
  elements.adminSummary.innerHTML = `
    <article class="admin-card">
      <span>Leads liberados</span>
      <strong>${unlocked}</strong>
      <p class="meta">Contatos desbloqueados por profissionais.</p>
    </article>
    <article class="admin-card">
      <span>Compras demo</span>
      <strong>${state.purchases.length}</strong>
      <p class="meta">Pacotes simulados no navegador.</p>
    </article>
    <article class="admin-card">
      <span>Ticket medio</span>
      <strong>${currency.format(avgTicket)}</strong>
      <p class="meta">Media dos pacotes vendidos.</p>
    </article>
  `;
}

function renderProfessionPicker() {
  elements.professionPanel.innerHTML = professionCatalog.map((group) => `
    <section class="profession-group">
      <h4>${escapeHtml(group.group)}</h4>
      ${group.items.map((item) => `
        <article class="profession-option">
          <strong>${escapeHtml(item.profession)}</strong>
          <div>
            ${item.areas.map((area) => `<button type="button" data-profession="${escapeHtml(`${item.profession} - ${area}`)}">${escapeHtml(area)}</button>`).join("")}
          </div>
        </article>
      `).join("")}
    </section>
  `).join("");

  elements.professionPanel.querySelectorAll("[data-profession]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#professionalCategory").value = button.dataset.profession;
      elements.professionPanel.classList.remove("open");
    });
  });
}

function renderCalculator() {
  const monthlyIncome = Number(document.querySelector("#monthlyIncome").value || 0);
  const hoursDay = Number(document.querySelector("#hoursDay").value || 0);
  const daysWeek = Number(document.querySelector("#daysWeek").value || 0);
  const weeksYear = Number(document.querySelector("#weeksYear").value || 0);
  const monthlyHours = hoursDay * daysWeek * (weeksYear / 12);
  const hourlyValue = monthlyHours > 0 ? monthlyIncome / monthlyHours : 0;

  const projectHourValue = Number(document.querySelector("#projectHourValue").value || 0);
  const projectHoursDay = Number(document.querySelector("#projectHoursDay").value || 0);
  const projectDays = Number(document.querySelector("#projectDays").value || 0);
  const projectValue = projectHourValue * projectHoursDay * projectDays;

  elements.hourValue.textContent = `${currency.format(hourlyValue)}/hora`;
  elements.projectValue.textContent = currency.format(projectValue);
}

function createRequest(event) {
  event.preventDefault();
  const payload = {
    id: crypto.randomUUID(),
    customerName: document.querySelector("#customerName").value.trim(),
    customerPhone: onlyDigits(document.querySelector("#customerPhone").value),
    category: document.querySelector("#requestCategory").value,
    serviceType: document.querySelector("#requestServiceType").value,
    location: document.querySelector("#requestLocation").value.trim(),
    urgency: document.querySelector("#requestUrgency").value,
    budget: Number(document.querySelector("#requestBudget").value),
    description: document.querySelector("#requestDescription").value.trim(),
    status: "open",
    unlocked: false,
    unlockedCount: 0,
    createdAt: today
  };

  const validation = validateRequest(payload);
  if (!validation.ok) {
    alert(validation.message);
    return;
  }

  state.requests.unshift(payload);
  saveState();
  elements.requestForm.reset();
  render();
  switchView("leads", true);
  alert("Pedido publicado. Profissionais ja podem visualizar a oportunidade.");
}

function createProfessional(event) {
  event.preventDefault();
  const payload = {
    id: crypto.randomUUID(),
    name: document.querySelector("#professionalName").value.trim(),
    phone: onlyDigits(document.querySelector("#professionalPhone").value),
    category: document.querySelector("#professionalCategory").value.trim(),
    city: document.querySelector("#professionalCity").value.trim()
  };

  const validation = validateProfessional(payload);
  if (!validation.ok) {
    alert(validation.message);
    return;
  }

  const phoneExists = state.professionals.some((professional) => professional.phone === payload.phone);
  if (phoneExists) {
    alert("Ja existe profissional cadastrado com este WhatsApp.");
    return;
  }

  state.professionals.push(payload);
  saveState();
  elements.professionalForm.reset();
  render();
}

function unlockLead(requestId) {
  const request = state.requests.find((item) => item.id === requestId);
  if (!request) {
    return;
  }

  const cost = getLeadCost(request.urgency);
  if (isRequestClosed(request)) {
    alert("Este pedido ja atingiu o limite de profissionais interessados.");
    return;
  }

  if (state.wallet < cost) {
    alert("Saldo insuficiente. Compre mais moedas para liberar este contato.");
    switchView("moedas", true);
    return;
  }

  state.wallet -= cost;
  request.unlocked = true;
  request.unlockedCount = Number(request.unlockedCount || 0) + 1;
  saveState();
  render();
}

function buyPackage(packageId) {
  const item = coinPackages.find((pkg) => pkg.id === packageId);
  if (!item) {
    return;
  }

  state.wallet += item.coins;
  state.revenue += item.price;
  state.purchases.push({ packageId: item.id, coins: item.coins, price: item.price, date: today });
  saveState();
  render();
  alert(`Pacote ${item.name} adicionado na demo.`);
}

function deleteProfessional(professionalId) {
  state.professionals = state.professionals.filter((professional) => professional.id !== professionalId);
  saveState();
  render();
}

function clearDemo() {
  const confirmed = confirm("Limpar dados demo do Jobbi neste navegador?");
  if (!confirmed) {
    return;
  }
  localStorage.removeItem("jobbi-state");
  state = structuredClone(initialState);
  saveState();
  render();
}

function closeProfessionPicker(event) {
  const picker = event.target.closest(".profession-picker");
  if (!picker) {
    elements.professionPanel.classList.remove("open");
  }
}

function isRequestClosed(request) {
  return Number(request.unlockedCount || 0) >= maxUnlocksPerRequest;
}

function validateRequest(payload) {
  if (payload.customerName.length < 3) {
    return { ok: false, message: "Informe seu nome com pelo menos 3 caracteres." };
  }
  if (!isValidPhone(payload.customerPhone)) {
    return { ok: false, message: "Informe um WhatsApp valido com DDD." };
  }
  if (!payload.category) {
    return { ok: false, message: "Selecione uma categoria." };
  }
  if (!payload.serviceType) {
    return { ok: false, message: "Selecione o tipo de servico." };
  }
  if (payload.location.length < 3) {
    return { ok: false, message: "Informe cidade ou bairro." };
  }
  if (!Number.isFinite(payload.budget) || payload.budget < 50) {
    return { ok: false, message: "Informe um orcamento estimado de pelo menos R$ 50." };
  }
  if (payload.description.length < 20) {
    return { ok: false, message: "Descreva o servico com pelo menos 20 caracteres." };
  }
  return { ok: true };
}

function validateProfessional(payload) {
  if (payload.name.length < 3) {
    return { ok: false, message: "Informe nome profissional ou empresa." };
  }
  if (!isValidPhone(payload.phone)) {
    return { ok: false, message: "Informe um WhatsApp valido com DDD." };
  }
  if (payload.category.length < 3) {
    return { ok: false, message: "Informe a categoria principal." };
  }
  if (payload.city.length < 2) {
    return { ok: false, message: "Informe a cidade de atendimento." };
  }
  return { ok: true };
}

function switchView(view, updateHash = false) {
  elements.navButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  elements.views.forEach((item) => item.classList.toggle("active", item.id === view));
  elements.homeSections.forEach((item) => item.classList.toggle("hidden", view !== "inicio"));
  if (updateHash) {
    history.replaceState(null, "", `#${view}`);
  }
}

function openInitialView() {
  const view = window.location.hash.replace("#", "");
  if (!view) {
    return;
  }
  const exists = Array.from(elements.views).some((item) => item.id === view);
  if (exists) {
    switchView(view);
  }
}

function getLeadCost(urgency) {
  return leadCosts[urgency] || leadCosts.normal;
}

function urgencyLabel(value) {
  const labels = {
    normal: "Normal",
    today: "Urgente hoje",
    week: "Esta semana"
  };
  return labels[value] || value;
}

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
}

function isValidPhone(phone) {
  return /^\d{10,13}$/.test(String(phone));
}

function onlyDigits(value) {
  return String(value).replace(/\D/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
