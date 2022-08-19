<template>
	<div>
		<h1>{{ presupuesto.nombre }}</h1>
		<Arbol
		></Arbol>
	</div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import Arbol from "../components/EditorPresupuesto/Arbol.vue";

const route = useRoute();
const store = useStore();

const presupuesto = ref({});

onBeforeMount(() => {
	store.dispatch("checkPresupuesto", route.params.id)
		.then(() => { presupuesto.value = store.state.presupuesto })
		.catch(err => console.error(err));
});
</script>
