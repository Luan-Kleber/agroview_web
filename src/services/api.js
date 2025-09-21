// src/services/dataService.js
import api from "./api";

export const fetchTabelas = () => api.get("/tabelas");

export const fetchVariaveis = (tabela) =>
  api.get("/variaveis", { params: { tabela } });

export const fetchPeriodos = (tabela) =>
  api.get("/periodos", { params: { tabela } });

export const fetchProdutos = (tabela) =>
  api.get("/produtos", { params: { tabela } });
