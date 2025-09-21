<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import Chart from "chart.js/auto";

// Props
const props = defineProps({
  data: Array, // Espera um array com objetos do tipo { Territorio, Periodo, Variavel, Produto, Valor, Unidade }
});

const chartCanvas = ref(null);
let chartInstance;

// Função para gerar cor HSL com base no índice
function generateColor(index, total) {
  const hue = (index * 360) / total;
  return `hsl(${hue}, 70%, 60%)`;
}

const createChart = () => {
  if (!props.data || !props.data.length) return;

  if (chartInstance) chartInstance.destroy();

  // Labels únicas: Território + Período
  const labels = [
    ...new Set(props.data.map((d) => `${d.Territorio} - ${d.Periodo}`)),
  ];

  // Series únicas: combinação de Variável + Produto
  const seriesKeys = [
    ...new Set(props.data.map((d) => `${d.Variavel} - ${d.Produto}`)),
  ];

  // Criar datasets dinamicamente
  const datasets = seriesKeys.map((key, idx) => {
    const [variavel, produto] = key.split(" - ");

    const data = labels.map((label) => {
      const [territorio, periodo] = label.split(" - ");
      const item = props.data.find(
        (d) =>
          d.Territorio === territorio &&
          d.Periodo === periodo &&
          d.Variavel === variavel &&
          d.Produto === produto
      );

      return item ? Number(item.Valor) || 0 : 0;
    });

    const unidade =
      props.data.find((d) => d.Variavel === variavel && d.Produto === produto)
        ?.Unidade || "";

    return {
      label: `${variavel} - ${produto}`,
      data,
      backgroundColor: generateColor(idx, seriesKeys.length),
      unidade,
    };
  });

  // Criar gráfico
  chartInstance = new Chart(chartCanvas.value, {
    type: "bar",
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (ctx) {
              const unidade = ctx.dataset?.unidade || "";
              return `${ctx.dataset.label}: ${ctx.parsed.y} ${unidade}`;
            },
          },
        },
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Produção por Variável e Produto",
          font: {
            size: 16,
          },
        },
      },
    },
  });
};

// Atualiza ao montar e quando os dados mudarem
watch(() => props.data, createChart, { deep: true });
onMounted(createChart);
</script>
