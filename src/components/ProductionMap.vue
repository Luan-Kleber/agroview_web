<template>
  <div id="map" style="height: 400px"></div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import L from "leaflet";

const props = defineProps({
  data: Array, // Espera que cada item tenha lat, lng, Territorio e Valor
});

let map;
let markers = [];

const clearMarkers = () => {
  markers.forEach((m) => map.removeLayer(m));
  markers = [];
};

const renderMap = () => {
  if (!map) {
    map = L.map("map").setView([-15.7797, -47.9297], 4);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);
  }

  clearMarkers();

  props.data.forEach((d) => {
    if (d.lat && d.lng) {
      const marker = L.circleMarker([d.lat, d.lng], {
        radius: 8,
        color: "green",
        fillColor: "#3cba54",
        fillOpacity: 0.6,
      }).addTo(map).bindPopup(`
          <b>${d.Territorio}</b><br />
          Período: ${d.Periodo}<br />
          Valor: ${d.Valor} ${d.Unidade}
        `);

      markers.push(marker);
    }
  });
};

watch(() => props.data, renderMap, { deep: true });
onMounted(renderMap);
</script>
