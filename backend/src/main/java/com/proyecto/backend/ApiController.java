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

    // --- DEPARTAMENTOS ---
    @GetMapping("/departamentos")
    public List<Departamento> listarDepartamentos() {
        return deptoRepo.findAll();
    }

    @GetMapping("/departamentos/{id}/municipios")
    public List<Municipio> listarMunicipios(@PathVariable Long id) {
        return muniRepo.findByIdDepartamento(id);
    }

    // --- MUNICIPIOS (CRUD COMPLETO) ---
    @PostMapping("/municipios")
    public ResponseEntity<?> guardarMunicipio(@RequestBody Municipio municipio) {
        if (municipio.getNombre() == null || municipio.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El nombre no puede estar vacío");
        }
        return ResponseEntity.ok(muniRepo.save(municipio));
    }

    @PutMapping("/municipios/{id}")
    public ResponseEntity<?> actualizarMunicipio(@PathVariable Long id, @RequestBody Municipio municipioDetalles) {
        return muniRepo.findById(id).map(municipio -> {
            municipio.setNombre(municipioDetalles.getNombre());
            Municipio actualizado = muniRepo.save(municipio);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/municipios/{id}")
    public ResponseEntity<?> eliminarMunicipio(@PathVariable Long id) {
        if (muniRepo.existsById(id)) {
            muniRepo.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- LOGIN EN MEMORIA (Simulado) ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsuarioLogin credenciales) {
        // Usuarios en memoria de ejemplo:
        // admin / 1234 -> Rol ADMIN
        // viewer / 1234 -> Rol VIEWER
        if ("admin".equals(credenciales.getUsuario()) && "1234".equals(credenciales.getPassword())) {
            return ResponseEntity.ok(new LoginResponse("admin", "ADMIN"));
        } else if ("viewer".equals(credenciales.getUsuario()) && "1234".equals(credenciales.getPassword())) {
            return ResponseEntity.ok(new LoginResponse("viewer", "VIEWER"));
        }
        return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
    }
}

// Clases auxiliares para el Login
class UsuarioLogin {
    private String usuario;
    private String password;
    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class LoginResponse {
    private String usuario;
    private String rol;
    public LoginResponse(String usuario, String rol) {
        this.usuario = usuario;
        this.rol = rol;
    }
    public String getUsuario() { return usuario; }
    public String getRol() { return rol; }
}