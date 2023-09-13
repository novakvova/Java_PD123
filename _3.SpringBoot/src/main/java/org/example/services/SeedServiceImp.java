package org.example.services;

import lombok.AllArgsConstructor;
import org.example.contants.Roles;
import org.example.entities.RoleEntity;
import org.example.entities.UserEntity;
import org.example.entities.UserRoleEntity;
import org.example.interfaces.SeedService;
import org.example.repositories.RoleRepository;
import org.example.repositories.UserRepository;
import org.example.repositories.UserRoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SeedServiceImp implements SeedService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void seedRole() {
        if(roleRepository.count() == 0) {
            RoleEntity admin = RoleEntity
                    .builder()
                    .name(Roles.Admin)
                    .build();
            roleRepository.save(admin);
            RoleEntity user = RoleEntity
                    .builder()
                    .name(Roles.User)
                    .build();
            roleRepository.save(user);
        }
    }

    @Override
    public void seedUser() {
        if(userRepository.count() == 0) {
            var user = UserEntity
                    .builder()
                    .email("admin@gmail.com")
                    .firstName("Микола")
                    .lastName("Підкаблучник")
                    .phone("+380 97 67 56 464")
                    .password(passwordEncoder.encode("123456"))
                    .build();
            userRepository.save(user);
            var role = roleRepository.findByName(Roles.Admin);
            var ur = UserRoleEntity
                    .builder()
                    .role(role)
                    .user(user)
                    .build();
            userRoleRepository.save(ur);
        }
    }
}
