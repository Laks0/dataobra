<template>
	<ejs-dialog
			ref="seleccionarconceptoDialogo"
			width="30%"
			:isModal="true"
			:visible="props.visible"
			@beforeClose="emit('cerrado')"
		>
		<div>
			<ejs-listview
					:dataSource="conceptosEstaticos"
					:fields="{ text: 'nombre', id: 'id' }"
					@select="onSelect"
					></ejs-listview>
		</div>
	</ejs-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { DialogComponent as ejsDialog } from "@syncfusion/ej2-vue-popups";
import { ListViewComponent as ejsListview } from "@syncfusion/ej2-vue-lists";

const seleccionarconceptoDialogo = ref(null);

const props = defineProps({
	visible: Boolean,
	staticData: Array
});

const emit = defineEmits(["selConcepto", "cerrado"]);

const store = useStore();
const conceptosEstaticos = computed(() => {
	let t = [];
	let static_data = JSON.parse(store.state.presupuesto.static_data);
	Object.entries(static_data).forEach(([id, concepto]) => {
		t.push({id: id, nombre: concepto.nombre});
	});
	return t;
});

function onSelect(ev) {
	const id = ev.data.id;
	emit("selConcepto", id);
	seleccionarconceptoDialogo.value.hide();
}

</script>
