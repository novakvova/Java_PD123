package org.example.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.configuration.security.JwtService;
import org.example.dto.account.*;
import org.example.dto.payload.response.MessageResponse;
import org.example.entities.RefreshToken;
import org.example.exception.TokenRefreshException;
import org.example.repositories.UserRepository;
import org.example.services.AccountService;
import org.example.services.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/account")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService service;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Autowired
    RefreshTokenService refreshTokenService;

    @PostMapping("login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginDto dto) {
        try {
            var auth = service.login(dto);
            return ResponseEntity.ok(auth);
        }
        catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    @PostMapping("register")
    public ResponseEntity<Void> register(RegisterDTO dto) {
        try {
            service.register(dto);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtService.generateAccessToken(user);
                    return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                        "Refresh token is not in database!"));
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var userName = userDetails.getUsername();
        var user = userRepository.findByEmail(userName);
        refreshTokenService.deleteByUserId(user.get().getId());
        return ResponseEntity.ok(new MessageResponse("Log out successful!"));
    }
}
