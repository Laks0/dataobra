<template>
	<div class="mainDiv">
		<ej2-treegrid
				ref="arbol"
				id="arbol"
				class="arbol"
				:dataSource="tabla"
				:editSettings="editSettings"
				:contextMenuItems="contextMenuItems"
				parentIdMapping="parentId"
				idMapping="id"
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

		<dialogoSeleccionarConcepto
				:visible="seleccionandoConcepto"
				@selConcepto="crearConceptoLocal"
				@cerrado="cerrarDialogoReferencia"
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
import dialogoSeleccionarConcepto from "./DialogoSeleccionarConcepto.vue";

import guardar from "./Composables/Guardar.js";
import { Concepto } from "./Clases/Concepto.js";

export default {
	setup() {
		// CONFIGURACIÓN DEL ÁRBOL //
		const arbol = ref(null);

		const editSettings = {
			allowEditing: true,
			mode: "Cell",
			allowAdding: true,
			allowDeleting: true
		};

		const contextMenuItems = [
			{text: "Crear concepto", id: "nuevoConcepto"},
			{text: "Referenciar concepto", id: "nuevaReferencia"},
		];

		const creandoConcepto = ref(false);
		const seleccionandoConcepto = ref(false);
		const contextMenuClick = function (ev) {
			if (ev.item.id === "nuevoConcepto") {
				creandoConcepto.value = true;
			}
			if (ev.item.id === "nuevaReferencia") {
				seleccionandoConcepto.value = true;
			}
		}

		function cerrarDialogoConcepto() {
			creandoConcepto.value = false;
		}
		function cerrarDialogoReferencia() {
			seleccionandoConcepto.value = false;
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
			const id = String(Date.now());
			staticData[id] = concepto;

			crearConceptoLocal(id);
		}

		function crearConceptoLocal(staticId) {
			let concepto = Object.assign({
				cantidad: 1,
				staticId: staticId,
				parentId: null,
				id: Date.now(),
				precio: 0,
			}, staticData[staticId]);

			tabla.value.unshift(concepto);
			tabla.value = [...tabla.value];

			guardar(tabla.value, staticData);
		}

		// EDICIÓN DE CONCEPTOS //
		function edit(index, columna, valor) {
			// Si la columna pertenece a la clase concepto (es de un concepto estático)
			// cambiar el concepto estático y no el local
			let colConcepto = Object.getOwnPropertyNames(new Concepto);
			if (colConcepto.includes(columna)) {
				let fila = tabla.value[index];
				editarConceptoEstatico(fila.staticId, columna, valor);
				return
			}

			tabla.value[index][columna] = valor;
			tabla.value = [...tabla.value];

			guardar(tabla.value, staticData);
		}

		function editarConceptoEstatico(staticId, columna, valor) {
			staticData[staticId][columna] = valor;

			tabla.value.forEach((row, i) => {
				if (row.staticId === staticId) {
					tabla.value[i][columna] = valor;
				}
			});
			tabla.value = [ ...tabla.value ];

			guardar(tabla.value, staticData);
		}

		return {
			editSettings,
			tabla,
			contextMenuItems,
			contextMenuClick,
			crearConceptoEstatico,
			crearConceptoLocal,
			creandoConcepto,
			cerrarDialogoConcepto,
			cerrarDialogoReferencia,
			cellSaved,
			staticData,
			seleccionandoConcepto,
			arbol
		}
	},

	components: {
		ej2Treegrid,
		eColumn,
		eColumns,
		dialogoNuevoConcepto,
		dialogoSeleccionarConcepto
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
