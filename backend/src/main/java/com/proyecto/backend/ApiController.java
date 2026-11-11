package com.proyecto.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

    @Autowired
    private DepartamentoRepository deptoRepo;

    @Autowired
    private MunicipioRepository muniRepo;

    @GetMapping("/departamentos")
    public List<Departamento> listarDepartamentos() {
        return deptoRepo.findAll();
    }

    @GetMapping("/departamentos/{id}/municipios")
    public List<Municipio> listarMunicipios(@PathVariable Long id) {
        return muniRepo.findByIdDepartamento(id);
    }

    @PostMapping("/municipios")
    public ResponseEntity<?> guardarMunicipio(@RequestBody Municipio municipio) {
        if (municipio.getNombre() == null || municipio.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El nombre no puede estar vacío");
        }
        return ResponseEntity.ok(muniRepo.save(municipio));
    }
}