const Api = (() => {
  const postJson = async (url, payload) => {
    if (!url) {
      return { ok: false, error: "Webhook URL no configurado" };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return { ok: true };
    } catch (error) {
      console.error("Webhook error", error);
      return { ok: false, error: error.message };
    }
  };

  const sendVehicle = (vehicle) =>
    postJson(APP_CONFIG.VEHICLE_WEBHOOK_URL, {
      type: "vehicle",
      licensePlate: vehicle.licensePlate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      purchaseCost: vehicle.purchaseCost,
      salePrice: vehicle.salePrice,
      status: vehicle.status,
      notes: vehicle.notes,
      createdBy: vehicle.createdBy,
      timestamp: vehicle.createdAt
    });

  const sendVehicleExpense = (expense) =>
    postJson(APP_CONFIG.VEHICLE_EXPENSE_WEBHOOK_URL, {
      type: "vehicle_expense",
      licensePlate: expense.licensePlate,
      date: expense.date,
      category: expense.category,
      amount: expense.amount,
      provider: expense.provider,
      paymentMethod: expense.paymentMethod,
      invoiceNumber: expense.invoiceNumber,
      notes: expense.notes,
      createdBy: expense.createdBy,
      timestamp: expense.createdAt
    });

  const sendFixedCost = (cost) =>
    postJson(APP_CONFIG.FIXED_COST_WEBHOOK_URL, {
      type: "fixed_cost",
      month: cost.month,
      category: cost.category,
      amount: cost.amount,
      notes: cost.notes,
      createdBy: cost.createdBy,
      timestamp: cost.createdAt
    });

  return {
    sendVehicle,
    sendVehicleExpense,
    sendFixedCost
  };
})();
