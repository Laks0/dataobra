import {createRouter, createWebHistory} from "vue-router";

import Principal from "./views/Principal.vue";
import ListaPresupuestos from "./views/ListaPresupuestos.vue";
import EditorPresupuesto from "./views/EditorPresupuesto.vue";

const routes = [
	{
		path: "/",
		component: Principal,
		meta: {
			title: "Dataobra"
		}
	},

	{
		path: "/presupuestos",
		name: "presupuestos",
		component: ListaPresupuestos
	},

	{
		path: "/presupuestos/edit/:id",
		component: EditorPresupuesto
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, _, next) => {
	if (to.meta.title)
		document.title = to.meta.title;

	next();
});

export default router;
