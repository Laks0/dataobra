<template>
	<div class="mainDiv">
		<ej2-treegrid
				ref="arbol"
				id="arbol"
				class="arbol"
				:dataSource="tabla"
				:editSettings="editSettings"
				:selectionSettings="selectionSettings"
				:contextMenuItems="contextMenuItems"
				:allowRowDragAndDrop="true"
				parentIdMapping="parentId"
				idMapping="id"
				:treeColumnIndex="1"
				@rowDrop="onRowDrop"
				@contextMenuClick="contextMenuClick"
				@cellSave="cellSaved"
				@cellEdit="beginEdit"
				rowHeight="20px"
			><e-columns>
						<e-column field="id" :isPrimaryKey="true" width="0"></e-column>
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
	Edit,
	RowDD
} from '@syncfusion/ej2-vue-treegrid';
import derreferenciarTabla from "./Composables/Dereferenciar.js";
import dialogoNuevoConcepto from "./DialogoNuevoConcepto.vue";
import dialogoSeleccionarConcepto from "./DialogoSeleccionarConcepto.vue";

import guardar from "./Composables/Guardar.js";
import calcularPrecio from "./Composables/CalcularPrecio.js";

import Verbos from "./Verbos/Verbos.js";

export default {
	setup() {
		// HISTORIAL //
		let historial = [];

		// Qué hacer con la data que devuelve el verbo depende de dónde se ejecuta
		function ejecutarVerbo(verbo, data) {
			let res = verbo.do(data);

			historial.unshift(res.log);

			return res.data;
		}

		// CONFIGURACIÓN DEL ÁRBOL //
		const arbol = ref(null);

		const editSettings = {
			allowEditing: true,
			mode: "Cell",
			allowAdding: true,
			allowDeleting: true
		};

		const selectionSettings = {
			type: "Multiple",
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
			const conceptoEstatico = staticData[staticId];
			let concepto = Object.assign({
				cantidad: 1,
				staticId: staticId,
				parentId: null,
				id: Date.now(),
				precio: conceptoEstatico.valorUnitario,
			}, conceptoEstatico);

			tabla.value.unshift(concepto);
			tabla.value = [...tabla.value];

			guardar(tabla.value, staticData);
		}

		// EDICIÓN DE CONCEPTOS //
		function beginEdit(ev) {
			if (ev.columnName === "valorUnitario" && (ev.rowData.tipo === "TAREA" || ev.rowData.tipo === "RUBRO")) {
				ev.cancel = true;
				return;
			}
		}

		function edit(index, columna, valor) {
			let res = ejecutarVerbo(Verbos.editar, {
				staticData: staticData.value, tabla: tabla.value,
				columna, valor, index
			});

			tabla.value = [...res.tabla];
			staticData.value = res.staticData;

			guardar(tabla.value, staticData);
		}

		function onRowDrop(ev) {
			let newParentId = null;

			const dropElement = arbol.value.getRowByIndex(ev.dropIndex);
			const dropInfo = arbol.value.getRowInfo(dropElement).rowData;

			if (ev.dropPosition === "middleSegment") {
				newParentId = dropInfo.id;
			} else {
				newParentId = dropInfo.parentId;
			}

			const fromIndexTabla = tabla.value.findIndex(row => row.id === ev.data[0].id);
			const fromRow = tabla.value[fromIndexTabla];

			if (dropInfo.tipo === "MANO" || dropInfo.tipo === "MATERIAL" || fromRow.tipo === "RUBRO") {
				ev.cancel = true;
				tabla.value = [...tabla.value];
				return
			}

			tabla.value[fromIndexTabla].parentId = newParentId;

			// Recalculo el precio de la nueva posición del elemento y de la vieja
			tabla.value = calcularPrecio(tabla.value, tabla.value[fromIndexTabla].id);
			tabla.value = calcularPrecio(tabla.value, ev.data[0].parentId);

			guardar(tabla.value, staticData);
		}

		return {
			editSettings,
			selectionSettings,
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
			arbol,
			onRowDrop,
			beginEdit,
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
		treegrid: [ RowDD, ContextMenu, Edit ]
	}
}
</script>

<style scoped>
.mainDiv {
	height: 70vh;
}
</style>
