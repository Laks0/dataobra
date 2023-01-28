/// EDITAR ///
import Log          from "../Clases/Log";
import { Concepto } from "../Clases/Concepto";

/*
 * data: {
 * 	staticData,
 * 	tabla,
 * 	columna,
 * 	index,
 * 	valor
 * }
*/
export default {
	do: function(data) {
		const log = new Log(this, data);
		let {staticData, tabla, columna, index, valor} = data;
		let preciosParaActualizar = []; // índices de los conceptos que hay que recalcular

		const columnasEstaticas = Object.getOwnPropertyNames(Concepto);

		// Ediciones locales
		if (!columnasEstaticas.includes(columna)) {
			tabla[index][columna] = valor;
			preciosParaActualizar.push(tabla[index].id);

			return {log, data: {staticId, preciosParaActualizar, tabla}};
		}

		// Ediciones estáticas
		let staticId = tabla[index].staticId;

		staticData[staticId][columna] = valor;
		tabla.forEach((row, i) => {
			if (row.staticId === staticId) {
				tabla[i][columna] = valor;
				preciosParaActualizar.push(row.id);
			}
		});

		return {log, data: {staticId, preciosParaActualizar, tabla}};
	},
	undo: function() {
	}
}
