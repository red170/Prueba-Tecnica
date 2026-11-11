package com.proyecto.backend;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_DEPARTAMENTO")
public class Departamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_DEPARTAMENTO")
    private Long idDepartamento;

    private String nombre;

    public Long getIdDepartamento() { return idDepartamento; }
    public void setIdDepartamento(Long idDepartamento) { this.idDepartamento = idDepartamento; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}