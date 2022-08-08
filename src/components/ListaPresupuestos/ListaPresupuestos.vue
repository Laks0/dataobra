<template>
	<ListViewComponent
			:dataSource="lista"
			:fields="{ text: 'nombre', id: 'id' }"
			@select="onSelect"
	></ListViewComponent>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useStore } from "vuex";
import http from "../../http-common.js";
import { ListViewComponent } from "@syncfusion/ej2-vue-lists";

const store = useStore();
const emit = defineEmits(["selPresupuesto"]);

const pres = ref([]);
const lista = ref([]);
onBeforeMount(() => {
	http.get(`/presupuesto/userid/${store.state.user.u_id}`)
		.then(res => {
			pres.value = res.data;

			lista.value = pres.value.map(p => {return {nombre: p.nombre, id: p.p_id };});
		})
		.catch(err => console.error(err));
});

function onSelect(ev) {
	const id = ev.data.id;

	store.dispatch("checkPresupuesto", id)
		.then(() => emit("selPresupuesto", id))
		.catch(err => console.error(err));
}
</script>
