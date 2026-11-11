import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  departamentos: any[] = [];
  municipios: any[] = [];
  idDeptoSeleccionado: number | null = null;
  nombreNuevoMunicipio: string = '';
  mensaje: string = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDepartamentos().subscribe(data => this.departamentos = data);
  }

  onSelectDepto(event: any) {
    this.idDeptoSeleccionado = event.target.value ? Number(event.target.value) : null;
    if (this.idDeptoSeleccionado) {
      this.api.getMunicipios(this.idDeptoSeleccionado).subscribe(data => this.municipios = data);
    } else {
      this.municipios = [];
    }
  }

  guardar() {
    if (!this.nombreNuevoMunicipio.trim() || !this.idDeptoSeleccionado) return;

    const payload = {
      idDepartamento: this.idDeptoSeleccionado,
      nombre: this.nombreNuevoMunicipio
    };

    this.api.registrarMunicipio(payload).subscribe(() => {
      this.mensaje = '¡Registrado con éxito!';
      this.nombreNuevoMunicipio = '';
      this.api.getMunicipios(this.idDeptoSeleccionado!).subscribe(data => this.municipios = data);
    });
  }
}