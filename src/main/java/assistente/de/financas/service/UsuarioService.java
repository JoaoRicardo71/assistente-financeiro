package assistente.de.financas.service;

import assistente.de.financas.model.Usuario;
import assistente.de.financas.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public Usuario registrar(Usuario usuario) {

        if (repository.findByUsername(usuario.getUsername()).isPresent()) {
            throw new RuntimeException("Usuário já existe");
        }

        return repository.save(usuario);
    }

    public Usuario login(String username, String senha) {

        Optional<Usuario> user =
                repository.findByUsername(username);

        if (user.isPresent()
                && user.get().getSenha().equals(senha)) {

            return user.get();
        }

        throw new RuntimeException("Usuário ou senha inválidos");
    }

}