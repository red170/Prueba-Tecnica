import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="margin: 30px; font-family: Arial;">
      <h2>Gestión de Municipios</h2>

      <!-- Desplegable -->
      <label>Departamento:</label><br>
      <select (change)="onSelectDepto($event)" style="padding: 5px; width: 250px; margin-top: 5px;">
        <option value="">-- Seleccione --</option>
        <option *ngFor="let d of departamentos()" [value]="d.idDepartamento">
          {{ d.nombre }}
        </option>
      </select>

      <!-- Lista de Municipios -->
      @if (idDeptoSeleccionado()) {
        <div style="margin-top: 20px;">
          <h3>Municipios:</h3>
          <ul>
            @for (m of municipios(); track m.idMunicipio) {
              <li>{{ m.nombre }}</li>
            }
          </ul>

          <!-- Formulario simple de registro -->
          <h3>Registrar Municipio:</h3>
          <input [(ngModel)]="nombreNuevoMunicipio" placeholder="Nuevo municipio" style="padding: 5px;">
          <button (click)="guardar()" style="padding: 6px 12px; margin-left: 5px; cursor: pointer;">Guardar</button>
          <p style="color: green; font-weight: bold;">{{ mensaje() }}</p>
        </div>
      }
    </div>
  `
})
export class AppComponent implements OnInit {
  departamentos = signal<any[]>([]);
  municipios = signal<any[]>([]);
  idDeptoSeleccionado = signal<number | null>(null);
  nombreNuevoMunicipio: string = '';
  mensaje = signal<string>('');

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDepartamentos().subscribe({
      next: (data) => this.departamentos.set(data),
      error: (err) => console.error('Error al conectar con el backend:', err)
    });
  }

  onSelectDepto(event: any) {
    const id = event.target.value ? Number(event.target.value) : null;
    this.idDeptoSeleccionado.set(id);
    if (id) {
      this.api.getMunicipios(id).subscribe(data => this.municipios.set(data));
    } else {
      this.municipios.set([]);
    }
  }

  guardar() {
    if (!this.nombreNuevoMunicipio.trim() || !this.idDeptoSeleccionado()) return;

    const payload = {
      idDepartamento: this.idDeptoSeleccionado(),
      nombre: this.nombreNuevoMunicipio
    };

    this.api.registrarMunicipio(payload).subscribe(() => {
      this.mensaje.set('¡Registrado con éxito!');
      this.nombreNuevoMunicipio = '';
      this.api.getMunicipios(this.idDeptoSeleccionado()!).subscribe(data => this.municipios.set(data));
    });
  }
}