<template>
	<div id="principal-wrapper">
		<h1>DATAOBRA</h1>

		<LoginForm @login="onLogin"/>
	</div>
</template>

<script setup>
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import LoginForm from "../components/Principal/LoginForm.vue";

const router = useRouter();
const store = useStore();

onBeforeMount(() => {
	store.dispatch("checkCookie")
		.then(res => {
			if (res.data.logged)
				router.push({name: "presupuestos"});
		})
		.catch(err => console.error(err));
});

function onLogin() {
	router.push({name: "presupuestos"});
}
</script>

<style scoped>
#principal-wrapper {
	text-align: center;
	padding: 100px;
}
</style>
