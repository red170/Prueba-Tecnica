import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.url}/login`, credentials);
  }

  getDepartamentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/departamentos`);
  }

  getMunicipios(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/departamentos/${id}/municipios`);
  }

  registrarMunicipio(data: any): Observable<any> {
    return this.http.post(`${this.url}/municipios`, data);
  }

  actualizarMunicipio(id: number, data: any): Observable<any> {
    return this.http.put(`${this.url}/municipios/${id}`, data);
  }

  eliminarMunicipio(id: number): Observable<any> {
    return this.http.delete(`${this.url}/municipios/${id}`);
  }
}