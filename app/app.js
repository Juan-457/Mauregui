const App = (() => {
  const currencyFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });

  const state = {
    vehicles: [],
    expenses: [],
    fixedCosts: []
  };

  const byId = (id) => document.getElementById(id);

  const ui = {
    loginSection: byId("loginSection"),
    appSection: byId("appSection"),
    loginForm: byId("loginForm"),
    loginPassword: byId("loginPassword"),
    loginMessage: byId("loginMessage"),
    logoutBtn: byId("logoutBtn"),
    tabButtons: Array.from(document.querySelectorAll(".tab-btn")),
    tabContents: Array.from(document.querySelectorAll(".tab-content")),
    vehicleForm: byId("vehicleForm"),
    vehicleEditPlate: byId("vehicleEditPlate"),
    vehicleLicensePlate: byId("vehicleLicensePlate"),
    vehicleBrand: byId("vehicleBrand"),
    vehicleModel: byId("vehicleModel"),
    vehicleYear: byId("vehicleYear"),
    vehiclePurchaseCost: byId("vehiclePurchaseCost"),
    vehicleSalePrice: byId("vehicleSalePrice"),
    vehicleStatus: byId("vehicleStatus"),
    vehicleSaleDate: byId("vehicleSaleDate"),
    vehicleSaleDateLabel: byId("vehicleSaleDateLabel"),
    vehicleNotes: byId("vehicleNotes"),
    vehicleCreatedBy: byId("vehicleCreatedBy"),
    vehicleMessage: byId("vehicleMessage"),
    vehicleResetBtn: byId("vehicleResetBtn"),
    vehicleSearch: byId("vehicleSearch"),
    vehicleStatusFilter: byId("vehicleStatusFilter"),
    vehicleTable: byId("vehicleTable"),
    vehicleDetail: byId("vehicleDetail"),
    vehicleDetailCard: byId("vehicleDetailCard"),
    expenseForm: byId("expenseForm"),
    expenseLicensePlate: byId("expenseLicensePlate"),
    expenseDate: byId("expenseDate"),
    expenseCategory: byId("expenseCategory"),
    expenseAmount: byId("expenseAmount"),
    expenseProvider: byId("expenseProvider"),
    expensePayment: byId("expensePayment"),
    expenseInvoice: byId("expenseInvoice"),
    expenseNotes: byId("expenseNotes"),
    expenseCreatedBy: byId("expenseCreatedBy"),
    expenseMessage: byId("expenseMessage"),
    expenseResetBtn: byId("expenseResetBtn"),
    expenseMonthFilter: byId("expenseMonthFilter"),
    expenseCategoryFilter: byId("expenseCategoryFilter"),
    expensePlateFilter: byId("expensePlateFilter"),
    expenseTable: byId("expenseTable"),
    vehicleList: byId("vehicleList"),
    fixedForm: byId("fixedForm"),
    fixedMonth: byId("fixedMonth"),
    fixedCategory: byId("fixedCategory"),
    fixedAmount: byId("fixedAmount"),
    fixedNotes: byId("fixedNotes"),
    fixedCreatedBy: byId("fixedCreatedBy"),
    fixedMessage: byId("fixedMessage"),
    fixedResetBtn: byId("fixedResetBtn"),
    fixedSummaryMonth: byId("fixedSummaryMonth"),
    fixedSummary: byId("fixedSummary"),
    fixedTable: byId("fixedTable"),
    dashboardMonth: byId("dashboardMonth"),
    kpiList: byId("kpiList"),
    dashboardVehicleTable: byId("dashboardVehicleTable")
  };

  const setMessage = (element, text, type) => {
    element.textContent = text;
    element.classList.remove("error", "success");
    if (type) {
      element.classList.add(type);
    }
  };

  const formatCurrency = (value) => {
    const number = Number(value) || 0;
    return currencyFormatter.format(number);
  };

  const normalizePlate = (value) => (value || "").trim().toUpperCase();

  const todayISO = () => new Date().toISOString();

  const endOfFollowingMonth = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return new Date(date.getFullYear(), date.getMonth() + 2, 0, 23, 59, 59, 999);
  };

  const findVehicle = (plate) =>
    state.vehicles.find((vehicle) => vehicle.licensePlate === plate);

  const refreshVehicleDatalist = () => {
    ui.vehicleList.innerHTML = "";
    state.vehicles.forEach((vehicle) => {
      const option = document.createElement("option");
      option.value = vehicle.licensePlate;
      ui.vehicleList.appendChild(option);
    });
  };

  const init = () => {
    state.vehicles = Storage.getVehicles();
    state.expenses = Storage.getExpenses();
    state.fixedCosts = Storage.getFixedCosts();

    const currentMonth = new Date().toISOString().slice(0, 7);
    ui.fixedSummaryMonth.value = currentMonth;
    ui.dashboardMonth.value = currentMonth;

    refreshVehicleDatalist();
    renderVehicleTable();
    renderVehicleDetail();
    renderExpenseTable();
    renderFixedCosts();
    renderDashboard();

    if (Auth.isAuthenticated()) {
      showApp();
    } else {
      showLogin();
    }

    bindEvents();
  };

  const showLogin = () => {
    ui.loginSection.classList.remove("hidden");
    ui.appSection.classList.add("hidden");
    ui.logoutBtn.classList.add("hidden");
  };

  const showApp = () => {
    ui.loginSection.classList.add("hidden");
    ui.appSection.classList.remove("hidden");
    ui.logoutBtn.classList.remove("hidden");
  };

  const bindEvents = () => {
    ui.loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const password = ui.loginPassword.value;
      if (Auth.login(password)) {
        setMessage(ui.loginMessage, "Ingreso correcto.", "success");
        ui.loginPassword.value = "";
        showApp();
      } else {
        setMessage(ui.loginMessage, "Contraseña incorrecta.", "error");
      }
    });

    ui.logoutBtn.addEventListener("click", () => {
      Auth.logout();
      showLogin();
    });

    ui.tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        ui.tabButtons.forEach((btn) => btn.classList.remove("active"));
        ui.tabContents.forEach((content) => content.classList.remove("active"));
        button.classList.add("active");
        const tab = button.dataset.tab;
        byId(`tab-${tab}`).classList.add("active");
      });
    });

    ui.vehicleLicensePlate.addEventListener("input", () => {
      ui.vehicleLicensePlate.value = normalizePlate(ui.vehicleLicensePlate.value);
    });

    ui.vehicleStatus.addEventListener("change", () => {
      const isSold = ui.vehicleStatus.value === "Vendido";
      ui.vehicleSaleDateLabel.classList.toggle("hidden", !isSold);
    });

    ui.expenseLicensePlate.addEventListener("input", () => {
      ui.expenseLicensePlate.value = normalizePlate(ui.expenseLicensePlate.value);
    });

    ui.vehicleForm.addEventListener("submit", handleVehicleSubmit);
    ui.vehicleResetBtn.addEventListener("click", resetVehicleForm);
    ui.vehicleSearch.addEventListener("input", renderVehicleTable);
    ui.vehicleStatusFilter.addEventListener("change", renderVehicleTable);

    ui.expenseForm.addEventListener("submit", handleExpenseSubmit);
    ui.expenseResetBtn.addEventListener("click", () => ui.expenseForm.reset());
    ui.expenseMonthFilter.addEventListener("change", renderExpenseTable);
    ui.expenseCategoryFilter.addEventListener("change", renderExpenseTable);
    ui.expensePlateFilter.addEventListener("input", renderExpenseTable);

    ui.fixedForm.addEventListener("submit", handleFixedCostSubmit);
    ui.fixedResetBtn.addEventListener("click", () => ui.fixedForm.reset());
    ui.fixedSummaryMonth.addEventListener("change", renderFixedCosts);

    ui.dashboardMonth.addEventListener("change", renderDashboard);
  };

  const handleVehicleSubmit = async (event) => {
    event.preventDefault();
    const plate = normalizePlate(ui.vehicleLicensePlate.value);
    const existing = findVehicle(plate);
    const isEditing = Boolean(ui.vehicleEditPlate.value);

    if (isEditing && !existing) {
      setMessage(ui.vehicleMessage, "No se encontró el vehículo a editar.", "error");
      return;
    }

    if (!plate) {
      setMessage(ui.vehicleMessage, "La patente es obligatoria.", "error");
      return;
    }

    if (!isEditing && existing) {
      setMessage(ui.vehicleMessage, "La patente ya existe.", "error");
      return;
    }

    const year = Number(ui.vehicleYear.value);
    if (!Number.isFinite(year)) {
      setMessage(ui.vehicleMessage, "El año es obligatorio.", "error");
      return;
    }

    const status = ui.vehicleStatus.value;
    let saleDate = ui.vehicleSaleDate.value;
    if (status === "Vendido") {
      if (!saleDate) {
        saleDate = new Date().toISOString().slice(0, 10);
      }
    } else {
      saleDate = "";
    }

    const vehicleData = {
      licensePlate: plate,
      brand: ui.vehicleBrand.value.trim(),
      model: ui.vehicleModel.value.trim(),
      year,
      purchaseCost: Number(ui.vehiclePurchaseCost.value) || 0,
      salePrice: Number(ui.vehicleSalePrice.value) || 0,
      status,
      notes: ui.vehicleNotes.value.trim(),
      createdBy: ui.vehicleCreatedBy.value.trim(),
      createdAt: isEditing ? existing.createdAt : todayISO(),
      saleDate,
      pendingSync: false
    };

    if (!vehicleData.brand || !vehicleData.model || !vehicleData.createdBy) {
      setMessage(ui.vehicleMessage, "Completa los campos obligatorios.", "error");
      return;
    }

    if (isEditing) {
      state.vehicles = state.vehicles.map((vehicle) =>
        vehicle.licensePlate === plate ? { ...vehicle, ...vehicleData } : vehicle
      );
    } else {
      state.vehicles = [...state.vehicles, vehicleData];
    }

    Storage.setVehicles(state.vehicles);
    refreshVehicleDatalist();
    renderVehicleTable();
    renderVehicleDetail(plate);
    renderDashboard();

    const result = await Api.sendVehicle(vehicleData);
    if (!result.ok) {
      markVehiclePending(plate);
      setMessage(ui.vehicleMessage, "Guardado local. Pendiente de sync.", "error");
    } else {
      setMessage(ui.vehicleMessage, "Vehículo guardado.", "success");
    }

    if (!isEditing) {
      ui.vehicleForm.reset();
      ui.vehicleSaleDateLabel.classList.add("hidden");
    }
  };

  const markVehiclePending = (plate) => {
    state.vehicles = state.vehicles.map((vehicle) =>
      vehicle.licensePlate === plate ? { ...vehicle, pendingSync: true } : vehicle
    );
    Storage.setVehicles(state.vehicles);
    renderVehicleTable();
  };

  const resetVehicleForm = () => {
    ui.vehicleForm.reset();
    ui.vehicleEditPlate.value = "";
    ui.vehicleLicensePlate.removeAttribute("readonly");
    ui.vehicleSaleDateLabel.classList.add("hidden");
    setMessage(ui.vehicleMessage, "");
  };

  const handleExpenseSubmit = async (event) => {
    event.preventDefault();
    const plate = normalizePlate(ui.expenseLicensePlate.value);
    const vehicle = findVehicle(plate);

    if (!vehicle) {
      setMessage(ui.expenseMessage, "La patente no existe en inventario.", "error");
      return;
    }

    const date = ui.expenseDate.value;
    if (!date) {
      setMessage(ui.expenseMessage, "La fecha es obligatoria.", "error");
      return;
    }

    const amount = Number(ui.expenseAmount.value);
    if (!amount || amount <= 0) {
      setMessage(ui.expenseMessage, "El importe debe ser mayor a 0.", "error");
      return;
    }

    if (vehicle.status === "Vendido") {
      if (!vehicle.saleDate) {
        setMessage(ui.expenseMessage, "Definí la fecha de venta del vehículo.", "error");
        return;
      }
      const cutoff = endOfFollowingMonth(vehicle.saleDate);
      const expenseDate = new Date(date);
      if (!cutoff || expenseDate > cutoff) {
        setMessage(
          ui.expenseMessage,
          "Los gastos para un vehículo vendido se permiten hasta fin del mes siguiente a la venta.",
          "error"
        );
        return;
      }
    }

    const expenseData = {
      id: Storage.createId(),
      licensePlate: plate,
      date,
      category: ui.expenseCategory.value,
      amount,
      provider: ui.expenseProvider.value.trim(),
      paymentMethod: ui.expensePayment.value.trim(),
      invoiceNumber: ui.expenseInvoice.value.trim(),
      notes: ui.expenseNotes.value.trim(),
      createdBy: ui.expenseCreatedBy.value.trim(),
      createdAt: todayISO(),
      pendingSync: false
    };

    if (!expenseData.createdBy) {
      setMessage(ui.expenseMessage, "Ingresá quién creó el gasto.", "error");
      return;
    }

    state.expenses = [...state.expenses, expenseData];
    Storage.setExpenses(state.expenses);
    renderExpenseTable();
    renderVehicleDetail(plate);
    renderDashboard();

    const result = await Api.sendVehicleExpense(expenseData);
    if (!result.ok) {
      markExpensePending(expenseData.id);
      setMessage(ui.expenseMessage, "Gasto guardado localmente. Pendiente de sync.", "error");
    } else {
      setMessage(ui.expenseMessage, "Gasto guardado.", "success");
    }

    ui.expenseForm.reset();
  };

  const markExpensePending = (id) => {
    state.expenses = state.expenses.map((expense) =>
      expense.id === id ? { ...expense, pendingSync: true } : expense
    );
    Storage.setExpenses(state.expenses);
    renderExpenseTable();
  };

  const handleFixedCostSubmit = async (event) => {
    event.preventDefault();
    const amount = Number(ui.fixedAmount.value);
    if (!amount || amount <= 0) {
      setMessage(ui.fixedMessage, "El importe debe ser mayor a 0.", "error");
      return;
    }

    const fixedData = {
      id: Storage.createId(),
      month: ui.fixedMonth.value,
      category: ui.fixedCategory.value,
      amount,
      notes: ui.fixedNotes.value.trim(),
      createdBy: ui.fixedCreatedBy.value.trim(),
      createdAt: todayISO(),
      pendingSync: false
    };

    if (!fixedData.month) {
      setMessage(ui.fixedMessage, "Seleccioná el mes.", "error");
      return;
    }

    if (!fixedData.createdBy) {
      setMessage(ui.fixedMessage, "Ingresá quién creó el costo fijo.", "error");
      return;
    }

    state.fixedCosts = [...state.fixedCosts, fixedData];
    Storage.setFixedCosts(state.fixedCosts);
    renderFixedCosts();
    renderDashboard();

    const result = await Api.sendFixedCost(fixedData);
    if (!result.ok) {
      markFixedPending(fixedData.id);
      setMessage(ui.fixedMessage, "Costo fijo guardado localmente. Pendiente de sync.", "error");
    } else {
      setMessage(ui.fixedMessage, "Costo fijo guardado.", "success");
    }

    ui.fixedForm.reset();
  };

  const markFixedPending = (id) => {
    state.fixedCosts = state.fixedCosts.map((cost) =>
      cost.id === id ? { ...cost, pendingSync: true } : cost
    );
    Storage.setFixedCosts(state.fixedCosts);
    renderFixedCosts();
  };

  const renderVehicleTable = () => {
    const query = ui.vehicleSearch.value.toLowerCase();
    const status = ui.vehicleStatusFilter.value;

    const filtered = state.vehicles.filter((vehicle) => {
      const matchQuery =
        vehicle.licensePlate.toLowerCase().includes(query) ||
        vehicle.brand.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query);
      const matchStatus = status ? vehicle.status === status : true;
      return matchQuery && matchStatus;
    });

    ui.vehicleTable.innerHTML = "";

    if (filtered.length === 0) {
      ui.vehicleTable.innerHTML = '<tr><td colspan="5">Sin resultados.</td></tr>';
      return;
    }

    filtered.forEach((vehicle) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${vehicle.licensePlate}</td>
        <td>${vehicle.brand} ${vehicle.model}</td>
        <td>${vehicle.status}</td>
        <td>${vehicle.pendingSync ? '<span class="badge pending">Pendiente</span>' : '<span class="badge synced">Sync</span>'}</td>
        <td>
          <button class="btn link" data-action="detail" data-plate="${vehicle.licensePlate}">Ver</button>
          <button class="btn link" data-action="edit" data-plate="${vehicle.licensePlate}">Editar</button>
          ${vehicle.pendingSync ? `<button class="btn link" data-action="retry" data-plate="${vehicle.licensePlate}">Reintentar</button>` : ""}
        </td>
      `;
      ui.vehicleTable.appendChild(row);
    });

    ui.vehicleTable.querySelectorAll("button").forEach((button) => {
      const plate = button.dataset.plate;
      const action = button.dataset.action;
      if (action === "detail") {
        button.addEventListener("click", () => renderVehicleDetail(plate));
      }
      if (action === "edit") {
        button.addEventListener("click", () => loadVehicleForm(plate));
      }
      if (action === "retry") {
        button.addEventListener("click", () => retryVehicleSync(plate));
      }
    });
  };

  const loadVehicleForm = (plate) => {
    const vehicle = findVehicle(plate);
    if (!vehicle) {
      return;
    }
    ui.vehicleEditPlate.value = plate;
    ui.vehicleLicensePlate.value = vehicle.licensePlate;
    ui.vehicleLicensePlate.setAttribute("readonly", "readonly");
    ui.vehicleBrand.value = vehicle.brand;
    ui.vehicleModel.value = vehicle.model;
    ui.vehicleYear.value = vehicle.year;
    ui.vehiclePurchaseCost.value = vehicle.purchaseCost || "";
    ui.vehicleSalePrice.value = vehicle.salePrice || "";
    ui.vehicleStatus.value = vehicle.status;
    ui.vehicleSaleDate.value = vehicle.saleDate || "";
    ui.vehicleNotes.value = vehicle.notes;
    ui.vehicleCreatedBy.value = vehicle.createdBy;
    ui.vehicleSaleDateLabel.classList.toggle("hidden", vehicle.status !== "Vendido");
    setMessage(ui.vehicleMessage, "Editando vehículo.", "success");
  };

  const retryVehicleSync = async (plate) => {
    const vehicle = findVehicle(plate);
    if (!vehicle) {
      return;
    }
    const result = await Api.sendVehicle(vehicle);
    if (result.ok) {
      state.vehicles = state.vehicles.map((item) =>
        item.licensePlate === plate ? { ...item, pendingSync: false } : item
      );
      Storage.setVehicles(state.vehicles);
      renderVehicleTable();
      renderDashboard();
    }
  };

  const renderVehicleDetail = (plate) => {
    if (!plate) {
      ui.vehicleDetailCard.classList.add("hidden");
      ui.vehicleDetail.innerHTML = "";
      return;
    }

    const vehicle = findVehicle(plate);
    if (!vehicle) {
      ui.vehicleDetailCard.classList.add("hidden");
      ui.vehicleDetail.innerHTML = "";
      return;
    }

    const expenses = state.expenses.filter((expense) => expense.licensePlate === plate);
    const totalsByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount || 0);
      return acc;
    }, {});

    const expensesTotal = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const totalCost = (Number(vehicle.purchaseCost) || 0) + expensesTotal;
    const margin = vehicle.salePrice ? Number(vehicle.salePrice) - totalCost : null;

    const totalsList = Object.entries(totalsByCategory)
      .map(([category, total]) => `<li>${category}: ${formatCurrency(total)}</li>`)
      .join("");

    ui.vehicleDetail.innerHTML = `
      <div class="detail-grid">
        <div class="detail-card">
          <strong>${vehicle.licensePlate}</strong>
          <p>${vehicle.brand} ${vehicle.model}</p>
          <p>Año ${vehicle.year}</p>
          <p>Estado: ${vehicle.status}</p>
          ${vehicle.saleDate ? `<p>Fecha venta: ${vehicle.saleDate}</p>` : ""}
        </div>
        <div class="detail-card">
          <p>Costo compra: ${formatCurrency(vehicle.purchaseCost)}</p>
          <p>Precio venta: ${vehicle.salePrice ? formatCurrency(vehicle.salePrice) : "-"}</p>
          <p>Total gastos: ${formatCurrency(expensesTotal)}</p>
          <p>Costo total: ${formatCurrency(totalCost)}</p>
          <p>Margen: ${margin !== null ? formatCurrency(margin) : "-"}</p>
        </div>
        <div class="detail-card">
          <strong>Totales por categoría</strong>
          <ul>
            ${totalsList || "<li>Sin gastos registrados.</li>"}
          </ul>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Importe</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            ${
              expenses.length
                ? expenses
                    .map(
                      (expense) => `
                <tr>
                  <td>${expense.date}</td>
                  <td>${expense.category}</td>
                  <td>${formatCurrency(expense.amount)}</td>
                  <td>${expense.notes || "-"}</td>
                </tr>
              `
                    )
                    .join("")
                : '<tr><td colspan="4">Sin gastos cargados.</td></tr>'
            }
          </tbody>
        </table>
      </div>
    `;

    ui.vehicleDetailCard.classList.remove("hidden");
  };

  const renderExpenseTable = () => {
    const month = ui.expenseMonthFilter.value;
    const category = ui.expenseCategoryFilter.value;
    const plateQuery = ui.expensePlateFilter.value.toLowerCase();

    const categories = Array.from(new Set(state.expenses.map((item) => item.category)));
    ui.expenseCategoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
    categories.forEach((item) => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      ui.expenseCategoryFilter.appendChild(option);
    });
    if (category) {
      ui.expenseCategoryFilter.value = category;
    }

    const filtered = state.expenses.filter((expense) => {
      const matchMonth = month ? expense.date.startsWith(month) : true;
      const matchCategory = category ? expense.category === category : true;
      const matchPlate = plateQuery
        ? expense.licensePlate.toLowerCase().includes(plateQuery)
        : true;
      return matchMonth && matchCategory && matchPlate;
    });

    ui.expenseTable.innerHTML = "";

    if (!filtered.length) {
      ui.expenseTable.innerHTML = '<tr><td colspan="6">Sin gastos.</td></tr>';
      return;
    }

    filtered.forEach((expense) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${expense.date}</td>
        <td>${expense.licensePlate}</td>
        <td>${expense.category}</td>
        <td>${formatCurrency(expense.amount)}</td>
        <td>${expense.pendingSync ? '<span class="badge pending">Pendiente</span>' : '<span class="badge synced">Sync</span>'}</td>
        <td>
          ${expense.pendingSync ? `<button class="btn link" data-action="retry" data-id="${expense.id}">Reintentar</button>` : ""}
        </td>
      `;
      ui.expenseTable.appendChild(row);
    });

    ui.expenseTable.querySelectorAll("button[data-action='retry']").forEach((button) => {
      button.addEventListener("click", () => retryExpenseSync(button.dataset.id));
    });
  };

  const retryExpenseSync = async (id) => {
    const expense = state.expenses.find((item) => item.id === id);
    if (!expense) {
      return;
    }
    const result = await Api.sendVehicleExpense(expense);
    if (result.ok) {
      state.expenses = state.expenses.map((item) =>
        item.id === id ? { ...item, pendingSync: false } : item
      );
      Storage.setExpenses(state.expenses);
      renderExpenseTable();
      renderVehicleDetail(expense.licensePlate);
      renderDashboard();
    }
  };

  const renderFixedCosts = () => {
    const month = ui.fixedSummaryMonth.value;
    const filtered = month
      ? state.fixedCosts.filter((cost) => cost.month === month)
      : state.fixedCosts;

    const totalsByCategory = filtered.reduce((acc, cost) => {
      acc[cost.category] = (acc[cost.category] || 0) + Number(cost.amount || 0);
      return acc;
    }, {});

    const total = Object.values(totalsByCategory).reduce((sum, amount) => sum + amount, 0);
    const summaryItems = Object.entries(totalsByCategory)
      .map(([category, amount]) => `<li>${category}: ${formatCurrency(amount)}</li>`)
      .join("");

    ui.fixedSummary.innerHTML = `
      <p><strong>Total:</strong> ${formatCurrency(total)}</p>
      <ul>${summaryItems || "<li>Sin costos fijos para este mes.</li>"}</ul>
    `;

    ui.fixedTable.innerHTML = "";

    if (!filtered.length) {
      ui.fixedTable.innerHTML = '<tr><td colspan="5">Sin registros.</td></tr>';
      return;
    }

    filtered.forEach((cost) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${cost.month}</td>
        <td>${cost.category}</td>
        <td>${formatCurrency(cost.amount)}</td>
        <td>${cost.pendingSync ? '<span class="badge pending">Pendiente</span>' : '<span class="badge synced">Sync</span>'}</td>
        <td>
          ${cost.pendingSync ? `<button class="btn link" data-action="retry" data-id="${cost.id}">Reintentar</button>` : ""}
        </td>
      `;
      ui.fixedTable.appendChild(row);
    });

    ui.fixedTable.querySelectorAll("button[data-action='retry']").forEach((button) => {
      button.addEventListener("click", () => retryFixedSync(button.dataset.id));
    });
  };

  const retryFixedSync = async (id) => {
    const cost = state.fixedCosts.find((item) => item.id === id);
    if (!cost) {
      return;
    }
    const result = await Api.sendFixedCost(cost);
    if (result.ok) {
      state.fixedCosts = state.fixedCosts.map((item) =>
        item.id === id ? { ...item, pendingSync: false } : item
      );
      Storage.setFixedCosts(state.fixedCosts);
      renderFixedCosts();
      renderDashboard();
    }
  };

  const renderDashboard = () => {
    const month = ui.dashboardMonth.value;
    const fixedCosts = month
      ? state.fixedCosts.filter((cost) => cost.month === month)
      : [];
    const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + Number(cost.amount || 0), 0);
    const activeVehicles = state.vehicles.filter(
      (vehicle) => vehicle.status === "Salon" || vehicle.status === "Reservado"
    );
    const estimatedFixedPerVehicle = activeVehicles.length
      ? totalFixedCosts / activeVehicles.length
      : 0;

    ui.kpiList.innerHTML = `
      <div class="kpi">
        <strong>Total costos fijos (${month || "mes"}):</strong>
        <div>${formatCurrency(totalFixedCosts)}</div>
      </div>
      <div class="kpi">
        <strong>Vehículos activos (Salón/Reservado):</strong>
        <div>${activeVehicles.length}</div>
      </div>
      <div class="kpi">
        <strong>Costo fijo estimado por vehículo:</strong>
        <div>${formatCurrency(estimatedFixedPerVehicle)}</div>
      </div>
    `;

    ui.dashboardVehicleTable.innerHTML = "";

    if (!state.vehicles.length) {
      ui.dashboardVehicleTable.innerHTML = '<tr><td colspan="4">Sin vehículos.</td></tr>';
      return;
    }

    state.vehicles.forEach((vehicle) => {
      const expensesTotal = state.expenses
        .filter((expense) => expense.licensePlate === vehicle.licensePlate)
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
      const totalCost = (Number(vehicle.purchaseCost) || 0) + expensesTotal;
      const margin = vehicle.salePrice ? Number(vehicle.salePrice) - totalCost : null;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${vehicle.licensePlate}</td>
        <td>${vehicle.status}</td>
        <td>${formatCurrency(totalCost)}</td>
        <td>${margin !== null ? formatCurrency(margin) : "-"}</td>
      `;
      ui.dashboardVehicleTable.appendChild(row);
    });
  };

  return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);
