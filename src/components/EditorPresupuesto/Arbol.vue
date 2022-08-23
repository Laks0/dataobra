<template>
	<div class="mainDiv">
		<ej2-treegrid
				id="arbol"
				class="arbol"
				:dataSource="tabla"
				:editSettings="editSettings"
				:contextMenuItems="contextMenuItems"
				parentIdMapping="parentId"
				@contextMenuClick="contextMenuClick"
				@cellSave="cellSaved"
				rowHeight="20px"
				><e-columns>
					<e-column field="nombre" headerText="Nombre"></e-column>
					<e-column field="cantidad" headerText="Cantidad"></e-column>
					<e-column field="valorUnitario" headerText="Valor Unitario" format="C"></e-column>
					<e-column field="precio" headerText="Precio" format="C"></e-column>
		</e-columns>
		</ej2-treegrid>

		<dialogoNuevoConcepto
			:visible="creandoConcepto"
			@creado="crearConceptoEstatico"
			@cerrado="cerrarDialogoConcepto"
		/>
	</div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { TreeGridComponent as ej2Treegrid,
	ColumnsDirective as eColumns,
	ColumnDirective as eColumn,
	ContextMenu,
	Edit
} from '@syncfusion/ej2-vue-treegrid';
import derreferenciarTabla from "./Composables/Dereferenciar.js";
import dialogoNuevoConcepto from "./DialogoNuevoConcepto.vue";

import guardar from "./Composables/Guardar.js";

export default {
	setup() {
		// CONFIGURACIÓN DEL ÁRBOL //
		const editSettings = {
			allowEditing: true,
			mode: "Cell",
			allowAdding: true,
			allowDeleting: true
		};

		const contextMenuItems = [
			{text: "Crear concepto", id:"nuevoConcepto"}
		];

		const creandoConcepto = ref(false);
		const contextMenuClick = function (ev) {
			if (ev.item.id === "nuevoConcepto") {
				creandoConcepto.value = true;
			}
		}

		function cerrarDialogoConcepto() {
			creandoConcepto.value = false;
		}

		function cellSaved(ev) {
			let rowIndex = tabla.value.findIndex(row => row.id === ev.rowData.id);
			let col = ev.columnName;
			let val = ev.value;

			edit(rowIndex, col, val);
		}

		// DATA DEL PRESUPUESTO //
		const store = useStore();

		const presupuesto = store.state.presupuesto;
		const staticData = JSON.parse(presupuesto.static_data);

		let tablaReferencias = JSON.parse(presupuesto.tabla);
		const tabla = ref(derreferenciarTabla(tablaReferencias, staticData));

		// CREACIÓN DE CONCEPTOS //
		function crearConceptoEstatico(concepto) {
			const id = Date.now();
			staticData[id] = concepto;

			crearConceptoLocal(id, 1);
		}

		function crearConceptoLocal(staticId, cantidad) {
			let concepto = Object.assign({
				cantidad: cantidad,
				staticId: staticId,
				parentId: null,
				id: Date.now(),
				precio: 0,
			}, staticData[staticId]);

			let valorTabla = [...tabla.value];
			valorTabla.unshift(concepto);
			tabla.value = valorTabla;

			guardar(tabla.value, staticData);
		}

		// EDICIÓN DE CONCEPTOS //
		function edit(index, columna, valor) {
			let valorTabla = [...tabla.value];
			valorTabla[index][columna] = valor;
			tabla.value = valorTabla;

			guardar(tabla.value, staticData);
		}

		return {
			editSettings,
			tabla,
			contextMenuItems,
			contextMenuClick,
			crearConceptoEstatico,
			creandoConcepto,
			cerrarDialogoConcepto,
			cellSaved
		}
	},

	components: {
		ej2Treegrid,
		eColumn,
		eColumns,
		dialogoNuevoConcepto,
	},

	provide: {
		treegrid: [ ContextMenu, Edit ]
	}
}
</script>

<style scoped>
.mainDiv {
	height: 70vh;
}
</style>
