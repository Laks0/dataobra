<template>
	<router-view v-slot="{ Component }">
		<transition name="slide-fade">
			<component :is="Component" :key="$router.path" />
		</transition>
	</router-view>
</template>

<script>
export default {
	name: "App",
}
</script>

<style>
@import "../node_modules/@syncfusion/ej2/bootstrap5.css";

.slide-fade-enter-active {
	transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
	transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	transform: translateX(20px);
	opacity: 0;
}
</style>

