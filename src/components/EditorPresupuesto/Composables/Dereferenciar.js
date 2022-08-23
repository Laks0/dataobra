/*
 * FORMATO DE LA REFERENCIA
 * {
 *	id: Number,
 *	staticId: Number,
 *	cantidad: Number,
 *	parentId: Number
 * }
 */

export default function derreferenciarTabla(tabla, staticData) {
	let tablaFinal = [];
	tabla.forEach(referencia => {
		let concepto = Object.assign({
			id: referencia.id,
			cantidad: referencia.cantidad,
			precio: referencia.precio,
			parentId: referencia.parentId,
			staticId: referencia.staticId,
		}, staticData[referencia.staticId]);

		tablaFinal.push(concepto);
	});

	return tablaFinal;
}
