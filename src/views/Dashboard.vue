<template>
  <div class="dashboard container py-4">
    <!-- Exibição de Erro -->
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>

    <!-- Filtros -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <Filters @filter="onFilterChange" />
      </div>
    </div>

    <!-- Gráfico -->
    <div class="card shadow-sm mb-4" v-if="productionData.length">
      <div class="card-body">
        <h5 class="card-title mb-3">Produção</h5>
        <ProductionChart :data="productionData" />
      </div>
    </div>

    <!-- Mapa -->
    <div class="card shadow-sm" v-if="productionData.length">
      <div class="card-body">
        <h5 class="card-title mb-3">Distribuição Geográfica</h5>
        <ProductionMap :data="productionData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

import Filters from "../components/Filters.vue";
import ProductionChart from "../components/ProductionChart.vue";
import ProductionMap from "../components/ProductionMap.vue";

// Dados e erro
const productionData = ref([]);
const errorMessage = ref("");

// Chamada quando filtros são aplicados
const onFilterChange = async (params) => {
  errorMessage.value = ""; // limpa mensagem anterior

  try {
    const response = await axios.get("http://localhost:8000/producao", {
      params,
    });

    if (response.data?.error) {
      errorMessage.value = response.data.error;
      productionData.value = [];
      return;
    }

    const dados = Array.isArray(response.data)
      ? response.data
      : response.data.resultado || [];

    if (!dados.length) {
      errorMessage.value = "Nenhum dado encontrado com os filtros aplicados.";
      productionData.value = [];
      return;
    }

    if (dados[0].Valor == "...") {
      errorMessage.value = "Nenhum valor encontrado com os filtros aplicados.";
      productionData.value = [];
      return;
    }

    productionData.value = dados.map((item) => ({
      ...item,
      Valor: isNaN(Number(item.Valor)) ? 0 : Number(item.Valor), // Corrigido aqui
    }));
  } catch (error) {
    console.error("Erro ao buscar dados:", error);

    errorMessage.value =
      error.response?.data?.error ||
      error.message ||
      "Erro inesperado ao buscar dados.";

    productionData.value = [];
  }
};
</script>
