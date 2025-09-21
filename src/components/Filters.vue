<template>
  <div>
    <div class="row mb-3">
      <!-- Tabela -->
      <div class="col-md-6">
        <label for="select-tabela" class="form-label">Tabela</label>
        <select id="select-tabela" class="form-select" v-model="selectedTabela">
          <option disabled value="">Selecione uma Tabela</option>
          <option value="1612">Lavouras temporárias</option>
          <option value="1613">Lavouras permanentes</option>
          <option value="5457">Consolidação</option>
        </select>
      </div>

      <!-- Período -->
      <div class="col-md-6">
        <div class="col-md-12">
          <label for="periodo" class="form-label">Período</label>
          <multiselect
            v-model="selectedPeriodo"
            :options="periodos"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="Selecione um ou mais períodos"
            label="id"
            track-by="id"
          />
        </div>
      </div>
    </div>

    <div class="row mb-3">
      <!-- Variavel -->
      <div class="col-md-12">
        <label for="variavel" class="form-label">Variável</label>
        <multiselect
          v-model="selectedVariavel"
          :options="variaveis"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Selecione uma ou mais variaveis"
          label="nome"
          track-by="id"
        />
      </div>
    </div>

    <div class="row mb-3">
      <!-- Produto -->
      <div class="col-md-6">
        <label for="produto" class="form-label">Produto</label>
        <multiselect
          v-model="selectedProduto"
          :options="produtos"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Selecione um ou mais produtos"
          label="nome"
          track-by="id"
        />
      </div>

      <!-- Território -->
      <div class="col-md-6">
        <label for="nivel" class="form-label">Território</label>
        <select id="nivel" class="form-select" v-model="selectedNivel">
          <option disabled value="">Selecione um território</option>
          <option
            v-for="n in niveis"
            :key="n.id"
            :value="n.id.replace('N', '')"
          >
            {{ n.nome }}
          </option>
        </select>
      </div>
    </div>

    <div class="row mb-3">
      <!-- Localidades -->
      <div class="col-md-6">
        <label for="localidade" class="form-label">Localidades</label>
        <multiselect
          v-model="selectedLocalidade"
          :options="localidades"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Selecione uma ou mais localidades"
          label="nome"
          track-by="id"
        />
      </div>
    </div>

    <div class="d-flex justify-content-end">
      <button class="btn btn-success" @click="emitFilter">Pesquisar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";

import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";

const emit = defineEmits(["filter"]);

const selectedTabela = ref("");
const selectedPeriodo = ref([]);
const selectedVariavel = ref([]);
const selectedProduto = ref([]);
const selectedNivel = ref("");
const selectedLocalidade = ref([]);

const variaveis = ref([]);
const periodos = ref([]);
const produtos = ref([]);
const niveis = ref([]);
const localidades = ref([]);

const id_classificacao = ref([]);

/*
 * Carregar Variáveis
 */
const loadVariaveisTabela = async (tabelaId) => {
  if (!tabelaId) return;

  try {
    const res = await axios.get(
      `http://localhost:8000/variaveis?tabela=${tabelaId}`
    );
    variaveis.value = res.data; // espera array de strings
    selectedVariavel.value = "";
  } catch (err) {
    console.error("Erro ao buscar as variáveis da tabela:", err);
  }
};

/*
 * Carregar Períodos
 */
const loadPeriodosTabela = async (tabelaId) => {
  if (!tabelaId) return;

  try {
    const res = await axios.get(
      `http://localhost:8000/periodos?tabela=${tabelaId}`
    );
    periodos.value = res.data; // espera array de strings
    selectedPeriodo.value = "";
  } catch (err) {
    console.error("Erro ao buscar as variáveis da tabela:", err);
  }
};

/*
 * Carregar Variaveis
 */
const loadProdutosTabela = async (tabelaId) => {
  if (!tabelaId) return;

  try {
    const res = await axios.get(
      `http://localhost:8000/produtos?tabela=${tabelaId}`
    );
    produtos.value = res.data.itens; // espera array de strings
    id_classificacao.value = res.data.id_classificacao;
    selectedProduto.value = "";
  } catch (err) {
    console.error("Erro ao buscar os produtos da tabela:", err);
  }
};

/*
 * Carregar niveis
 */
const loadNiveisTabela = async (tabelaId) => {
  if (!tabelaId) return;

  try {
    const res = await axios.get(
      `http://localhost:8000/niveis?tabela=${tabelaId}`
    );
    niveis.value = res.data; // espera array de strings
    selectedNivel.value = "";
  } catch (err) {
    console.error("Erro ao buscar os níveis da tabela:", err);
  }
};

/*
 * Carregar localidades
 */
const loadLocalidadesTerritorio = async (nivelId) => {
  if (!nivelId) return;

  try {
    const res = await axios.get(
      `http://localhost:8000/localidades?nivel=${nivelId}`
    );
    localidades.value = res.data; // espera array de strings
    selectedLocalidade.value = "";
  } catch (err) {
    console.error("Erro ao buscar as localidades do território:", err);
  }
};

// Observa mudança na tabela selecionada
watch(selectedTabela, (novaTabela) => {
  loadVariaveisTabela(novaTabela);
  loadPeriodosTabela(novaTabela);
  loadProdutosTabela(novaTabela);
  loadNiveisTabela(novaTabela);
});

watch(selectedNivel, (novoNivel) => {
  loadLocalidadesTerritorio(novoNivel);
});

//  Função de envio com validações
const emitFilter = () => {
  if (!selectedTabela.value) {
    alert("Por favor, preencha uma tabela.");
    return;
  }

  if (!selectedVariavel.value) {
    alert("Por favor, preencha uma variável.");
    return;
  }

  if (!selectedLocalidade.value) {
    alert("Por favor, preencha uma localidade.");
    return;
  }

  const params = {
    tabela: selectedTabela.value,
    periodo: selectedPeriodo.value.map((loc) => loc.id).join(","),
    variavel: selectedVariavel.value.map((loc) => loc.id).join(","),
    produto: selectedProduto.value.map((loc) => loc.id).join(","),
    nivel: selectedNivel.value,
    localidades: selectedLocalidade.value.map((loc) => loc.id).join(","),
    id_classificacao: id_classificacao.value,
  };

  emit("filter", params);
};
</script>
