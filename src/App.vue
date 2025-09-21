<template>
  <main>
    <!-- Navbar customizada -->
    <nav class="custom-navbar mb-4 shadow-sm">
      <div class="container d-flex align-items-center justify-content-between">
        <!-- Logo -->
        <img src="../src/assets/logo_agroview.png" alt="Logo" height="60" />

        <!-- Título -->
        <h1 class="navbar-title m-0">Dashboard Produção Agrícola Municipal</h1>
      </div>
    </nav>

    <Dashboard />
  </main>
</template>

<script setup>
import Dashboard from "./views/Dashboard.vue";
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  background-color: #f8f9fa;
}
main {
  padding: 0;
}

/* Navbar com gradiente esverdeado */
.custom-navbar {
  background: linear-gradient(
    90deg,
    #e0f5ec,
    #d0f0ff
  ); /* verde claro até azul claro */
  padding: 1rem 0;
}

/* Título da navbar */
.navbar-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #146c43; /* verde escuro que combina com ícones */
}
</style>
