import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="margin: 30px; font-family: Arial; max-width: 600px;">
      
      <!-- PANTALLA DE LOGIN -->
      @if (!usuarioLogueado()) {
        <div style="border: 1px solid #ccc; padding: 20px; border-radius: 8px; background: #f9f9f9;">
          <h2>Iniciar Sesión</h2>
          <p style="font-size: 13px; color: #555;">
            <b>Admin:</b> admin / 1234 &nbsp;|&nbsp; <b>Viewer:</b> viewer / 1234
          </p>
          <div style="margin-bottom: 10px;">
            <label>Usuario:</label><br>
            <input [(ngModel)]="loginUser" placeholder="Usuario" style="padding: 6px; width: 100%; margin-top: 4px;">
          </div>
          <div style="margin-bottom: 15px;">
            <label>Contraseña:</label><br>
            <input type="password" [(ngModel)]="loginPass" placeholder="Contraseña" style="padding: 6px; width: 100%; margin-top: 4px;">
          </div>
          <button (click)="iniciarSesion()" style="padding: 8px 15px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Entrar</button>
          <p style="color: red; font-size: 14px; margin-top: 10px;">{{ errorLogin() }}</p>
        </div>
      } 
      
      <!-- APLICACIÓN PRINCIPAL -->
      @else {
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ddd; padding-bottom: 10px;">
          <h2>Gestión de Municipios</h2>
          <div>
            <span style="margin-right: 15px; font-weight: bold;">Rol: {{ rolUsuario() }}</span>
            <button (click)="cerrarSesion()" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Cerrar Sesión</button>
          </div>
        </div>

        <!-- Selección de Departamento -->
        <div style="margin-top: 20px;">
          <label><b>Departamento:</b></label><br>
          <select (change)="onSelectDepto($event)" style="padding: 6px; width: 100%; margin-top: 5px;">
            <option value="">-- Seleccione un departamento --</option>
            <option *ngFor="let d of departamentos()" [value]="d.idDepartamento">
              {{ d.nombre }}
            </option>
          </select>
        </div>

        <!-- Lista y Gestión de Municipios -->
        @if (idDeptoSeleccionado()) {
          <div style="margin-top: 25px;">
            <h3>Municipios del Departamento:</h3>
            
            <ul style="padding-left: 20px;">
              @for (m of municipios(); track m.idMunicipio) {
                <li style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                  <span>{{ m.nombre }}</span>

                  <!-- BOTONES SOLO PARA ADMIN -->
                  @if (rolUsuario() === 'ADMIN') {
                    <div>
                      <button (click)="cargarParaEditar(m)" style="margin-right: 5px; padding: 3px 8px; background: #ffc107; border: none; border-radius: 3px; cursor: pointer;">Editar</button>
                      <button (click)="eliminar(m.idMunicipio)" style="padding: 3px 8px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">Eliminar</button>
                    </div>
                  }
                </li>
              }
            </ul>

            <!-- FORMULARIO DE CREAR / EDITAR (SOLO ADMIN) -->
            @if (rolUsuario() === 'ADMIN') {
              <div style="margin-top: 20px; background: #f1f1f1; padding: 15px; border-radius: 6px;">
                <h4>{{ editandoId() ? 'Editar Municipio' : 'Registrar Nuevo Municipio' }}</h4>
                
                <input [(ngModel)]="nombreMunicipioInput" placeholder="Nombre del municipio" style="padding: 6px; width: 60%; margin-right: 10px;">
                
                <button (click)="guardarOActualizar()" style="padding: 7px 15px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                  {{ editandoId() ? 'Actualizar' : 'Guardar' }}
                </button>

                @if (editandoId()) {
                  <button (click)="cancelarEdicion()" style="padding: 7px 10px; background: #6c757d; color: white; border: none; border-radius: 4px; margin-left: 5px; cursor: pointer;">Cancelar</button>
                }

                <p style="color: green; font-weight: bold; margin-top: 10px;">{{ mensaje() }}</p>
              </div>
            } @else {
              <p style="font-style: italic; color: #666; margin-top: 15px;">🔒 Estás en modo de visualización (Viewer). No tienes permisos para modificar datos.</p>
            }

          </div>
        }
      }
    </div>
  `
})
export class AppComponent implements OnInit {
  // Estados de Sesión
  usuarioLogueado = signal<boolean>(false);
  rolUsuario = signal<string>('');
  loginUser = '';
  loginPass = '';
  errorLogin = signal<string>('');

  // Estados de Negocio
  departamentos = signal<any[]>([]);
  municipios = signal<any[]>([]);
  idDeptoSeleccionado = signal<number | null>(null);
  
  nombreMunicipioInput = '';
  editandoId = signal<number | null>(null);
  mensaje = signal<string>('');

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarDepartamentos();
  }

  cargarDepartamentos() {
    this.api.getDepartamentos().subscribe({
      next: (data) => this.departamentos.set(data),
      error: (err) => console.error('Error al cargar departamentos:', err)
    });
  }

  iniciarSesion() {
    this.errorLogin.set('');
    this.api.login({ usuario: this.loginUser, password: this.loginPass }).subscribe({
      next: (res: any) => {
        this.usuarioLogueado.set(true);
        this.rolUsuario.set(res.rol);
        this.loginUser = '';
        this.loginPass = '';
        
        this.cargarDepartamentos(); 
      },
      error: () => {
        this.errorLogin.set('Usuario o contraseña inválidos');
      }
    });
  }

  cerrarSesion() {
    this.usuarioLogueado.set(false);
    this.rolUsuario.set('');
    this.municipios.set([]);
    this.idDeptoSeleccionado.set(null);
  }

  onSelectDepto(event: any) {
    const id = event.target.value ? Number(event.target.value) : null;
    this.idDeptoSeleccionado.set(id);
    this.cancelarEdicion();
    if (id) {
      this.api.getMunicipios(id).subscribe(data => this.municipios.set(data));
    } else {
      this.municipios.set([]);
    }
  }

  guardarOActualizar() {
    if (!this.nombreMunicipioInput.trim() || !this.idDeptoSeleccionado()) return;

    const idEdit = this.editandoId();

    if (idEdit) {
      // MODO EDICIÓN (PUT)
      this.api.actualizarMunicipio(idEdit, { nombre: this.nombreMunicipioInput }).subscribe(() => {
        this.mensaje.set('¡Municipio actualizado con éxito!');
        this.finalizarAccion();
      });
    } else {
      // MODO CREACIÓN (POST)
      const payload = {
        idDepartamento: this.idDeptoSeleccionado(),
        nombre: this.nombreMunicipioInput
      };
      this.api.registrarMunicipio(payload).subscribe(() => {
        this.mensaje.set('¡Municipio registrado con éxito!');
        this.finalizarAccion();
      });
    }
  }

  cargarParaEditar(m: any) {
    this.editandoId.set(m.idMunicipio);
    this.nombreMunicipioInput = m.nombre;
    this.mensaje.set('');
  }

  cancelarEdicion() {
    this.editandoId.set(null);
    this.nombreMunicipioInput = '';
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este municipio?')) {
      this.api.eliminarMunicipio(id).subscribe(() => {
        this.mensaje.set('¡Municipio eliminado con éxito!');
        this.finalizarAccion();
      });
    }
  }

  finalizarAccion() {
    this.nombreMunicipioInput = '';
    this.editandoId.set(null);
    if (this.idDeptoSeleccionado()) {
      this.api.getMunicipios(this.idDeptoSeleccionado()!).subscribe(data => this.municipios.set(data));
    }
    setTimeout(() => this.mensaje.set(''), 3000);
  }
}