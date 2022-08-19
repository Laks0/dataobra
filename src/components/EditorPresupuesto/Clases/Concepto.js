export class Concepto {
	constructor(nombre, tipo, valorUnitario) {
		this.nombre = nombre;
		this.tipo = tipo;


		if (this.tipo !== "TAREA" && this.tipo !== "RUBRO") {
			this.valorUnitario = valorUnitario;
		} else {
			this.valorUnitario = 0;
		}
	}
}
