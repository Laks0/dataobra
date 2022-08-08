<template>
	<div class="e-card">
		<div class="e-card-header">
			<div class="e-card-header-caption">
				<div class="e-card-header-title">
					Ingresar
				</div>
			</div>
		</div>

		<div class="e-card-content">
			<div class="e-float-input e-input-group">
				<input name="email" type="email" v-model="email" required/>
				<span class="e-float-line"></span>
				<label class="e-float-text">Email</label>
			</div>

			<div class="e-float-input e-input-group">
				<input name="password" type="password" v-model="contraseña" required/>
				<span class="e-float-line"></span>
				<label class="e-float-text">Contraseña</label>
			</div>
		</div>

		<ButtonComponent @click="ingresarClick">Ingresar</ButtonComponent>

		<ToastComponent
				id="toast"
				ref="errorToast"
				title="ERROR"
				timeOut="5000"
				:position="{ X: 'Center', Y: 'Bottom' }"
		></ToastComponent>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { ButtonComponent } from "@syncfusion/ej2-vue-buttons";
import { ToastComponent } from "@syncfusion/ej2-vue-notifications";

const errorToast = ref(null);
const emit = defineEmits(["login"]);

const email = ref();
const contraseña = ref();

const store = useStore();
function ingresarClick() {
	store.dispatch("login", {email: email.value, contraseña: contraseña.value})
		.then(() => emit("login"))
		.catch(err => {
			errorToast.value.show({content: err.response.data, cssClass: "e-toast-danger"});
		});
}
</script>

<style scoped>
.e-card {
	padding: 10px;
	max-width: 500px;
	margin: 0 auto;
}

.e-card .e-card-header .e-card-header-caption .e-card-header-title  {
	font-size: large;
}

.e-input-group {
	margin-bottom: 20px;
}
</style>
