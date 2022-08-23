export default function derreferenciarTabla(tabla, staticData) {
	let tablaFinal = [];
	tabla.forEach(referencia => {
		let concepto = Object.assign(referencia, staticData[referencia.staticId]);

		tablaFinal.push(concepto);
	});

	return tablaFinal;
}
