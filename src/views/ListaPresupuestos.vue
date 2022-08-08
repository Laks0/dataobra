<template>
	<h1>Presupuestos de {{ user.nombre }}</h1>

	<ListaPresupuestos @selPresupuesto="onSelPresupuesto"/>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import ListaPresupuestos from "../components/ListaPresupuestos/ListaPresupuestos.vue";

const store = useStore();
const router = useRouter();

const user = ref();
onBeforeMount(() => {
	if (!store.state.logged)
		router.push("/");
	user.value = store.state.user;
});

function onSelPresupuesto(id) {
	router.push(`presupuestos/edit/${id}`);
}

</script>
