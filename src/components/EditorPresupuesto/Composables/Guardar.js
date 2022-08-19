import tablaReferencias from "./TablaReferencias";
import store from "../../../store";
// TODO transformar en promesa
export default function guardar(tabla, staticData) {
	let referencias = JSON.stringify(tablaReferencias(tabla));
	let staticJson = JSON.stringify(staticData);

	store.dispatch("actualizarTabla", { tabla: referencias, static_data: staticJson })
		.then(res => console.log(res))
		.catch(err => console.error(err));
}
