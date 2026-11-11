package com.proyecto.backend;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_MUNICIPIO")
public class Municipio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_MUNICIPIO")
    private Long idMunicipio;

    @Column(name = "ID_DEPARTAMENTO")
    private Long idDepartamento;

    private String nombre;

    public Long getIdMunicipio() { return idMunicipio; }
    public void setIdMunicipio(Long idMunicipio) { this.idMunicipio = idMunicipio; }
    public Long getIdDepartamento() { return idDepartamento; }
    public void setIdDepartamento(Long idDepartamento) { this.idDepartamento = idDepartamento; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}