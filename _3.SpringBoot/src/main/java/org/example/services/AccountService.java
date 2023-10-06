package org.example.services;

import lombok.RequiredArgsConstructor;
import org.example.configuration.security.JwtService;
import org.example.dto.account.AuthResponseDto;
import org.example.dto.account.LoginDto;
import org.example.dto.account.RegisterDTO;
import org.example.entities.UserEntity;
import org.example.mappers.AccountMapper;
import org.example.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AccountMapper accountMapper;

    private static final String RECAPTCHA_SECRET_KEY="6Lc_6X4oAAAAAJuQSM1UCD7gPdO61CKJGO-3ZDI7";
    private static final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public AuthResponseDto login(LoginDto request) {
        if(!verifyTokenGoogle(request.getRecaptchaToken())) {
            throw new UsernameNotFoundException("Verify token");
        }
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var isValid = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if(!isValid) {
            throw new UsernameNotFoundException("User not found");
        }
        var jwtToekn = jwtService.generateAccessToken(user);
        return AuthResponseDto.builder()
                .token(jwtToekn)
                .build();
    }

    public void register(RegisterDTO dto) {
        var user = userRepository.findByEmail(dto.getEmail());
        if(user.isPresent())
            throw new UsernameNotFoundException("Дана пошта уже зареєстрована!");
        UserEntity newUser = accountMapper.itemDtoToUser(dto);
        newUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        userRepository.save(newUser);
    }

    private boolean verifyTokenGoogle(String token) {
        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("secret", RECAPTCHA_SECRET_KEY);
        requestBody.add("response", token);

        ResponseEntity<Map> response = restTemplate.postForEntity(RECAPTCHA_VERIFY_URL, requestBody, Map.class);

        Map<String, Object> responseBody = response.getBody();
        if (responseBody != null && responseBody.containsKey("success")) {
            boolean success = (boolean) responseBody.get("success");
            return success;
        }
        return false;
    }
}
