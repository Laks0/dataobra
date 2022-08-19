<template>
	<ej2-dialog
			ref="nuevoConceptoDialogo"
			width="50%"
			height="40vh"
			:isModal="true"
			:visible="props.visible"
			@beforeClose="beforeClose"
	>
		<div class="e-float-input e-input-group field">
			<input name="nombre" v-model="nombre" required/>
			<span class="e-float-line"></span>
			<label class="e-float-text">Nombre del concepto</label>
		</div>

		<div id="container" class="field">
			<ejs-dropdownlist
					id="dropdown"
					v-model="tipo"
					placeholder="Tipo de concepto"
					:dataSource="tipos"
					:fields="campos"
					></ejs-dropdownlist>
		</div>

		<div class="e-float-input e-input-group field">
			<input name="vu" type="number" v-model="vu" required/>
			<span class="e-float-line"></span>
			<label class="e-float-text">Valor unitario</label>
		</div>

		<div id="botones">
			<ejs-button class="boton e-success" @click="onCrear">Crear</ejs-button>
			<ejs-button class="boton e-danger" @click="cerrar">Cancelar</ejs-button>
		</div>
	</ej2-dialog>
</template>

<script setup>
import { ref } from "vue";
import { DialogComponent as ej2Dialog } from "@syncfusion/ej2-vue-popups";
import { DropDownListComponent as ejsDropdownlist } from "@syncfusion/ej2-vue-dropdowns"
import { ButtonComponent as ejsButton } from "@syncfusion/ej2-vue-buttons";
import { Concepto } from "./Clases/Concepto.js";

const emit = defineEmits(["creado", "cerrado"]);
const props = defineProps({visible : Boolean});

const nuevoConceptoDialogo = ref(null);

const tipos = [
	{nombre: "Mano de obra", value: "MANO"},
	{nombre: "Material", value: "MATERIAL"},
	{nombre: "Tarea", value: "TAREA"},
	{nombre: "Rubro", value: "RUBRO"},
];

const campos = {text: "nombre", value: "value"};

const nombre = ref("");
const tipo = ref(null);
const vu = ref(null);

function onCrear() {
	if (nombre.value === "" || tipo.value === null || vu.value === null) {
		return
	}

	const concepto = new Concepto(nombre.value, tipo.value, vu.value);
	emit("creado", concepto);
	cerrar();
}

function cerrar() {
	nombre.value = "";
	tipo.value = null;
	vu.value = null;
	nuevoConceptoDialogo.value.hide();
}

function beforeClose() {
	emit("cerrado");
}
</script>

<style scoped>
.field {
	margin-top: 30px;
}
.boton {
	margin: 10px;
}
</style>
