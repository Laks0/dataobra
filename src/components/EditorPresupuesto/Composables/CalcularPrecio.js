export default function calcularPrecio(tabla, id) {
	if (id === null) {
		return [...tabla];
	}

	const index = tabla.findIndex(row => row.id === id);
	const concepto = tabla[index];

	// Para conceptos independientes
	if (concepto.tipo === "MANO" || concepto.tipo === "MATERIAL") {
		concepto.precio = concepto.valorUnitario * concepto.cantidad;

		return calcularPrecio(tabla, concepto.parentId)
	}

	// Para conceptos dependientes
	concepto.valorUnitario = 0;
	tabla.forEach(row => {
		if (row.parentId === id) {
			concepto.valorUnitario += row.precio;
		}
	});
	concepto.precio = concepto.valorUnitario * concepto.cantidad;
	return calcularPrecio(tabla, concepto.parentId);
}
