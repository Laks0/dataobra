export default function tablaReferencias(tabla) {
	let referencias = [];

	tabla.forEach(concepto => {
		let referencia = {
			id:       concepto.id,
			staticId: concepto.staticId,
			cantidad: concepto.cantidad,
			parentId: concepto.parentId
		}

		referencias.unshift(referencia);
	});

	return referencias;
}
