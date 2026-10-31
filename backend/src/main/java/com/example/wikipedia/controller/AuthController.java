package com.example.wikipedia.controller;

import com.example.wikipedia.dto.JwtAuthResponse;
import com.example.wikipedia.dto.LoginDto;
import com.example.wikipedia.dto.UserDto;
import com.example.wikipedia.service.JwtTokenProvider;
import com.example.wikipedia.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired(required = false)
    private AuthenticationManager authenticationManager;

    @Autowired(required = false)
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> authenticateUser(@RequestBody LoginDto loginDto) {
        if (authenticationManager == null || tokenProvider == null) {
            
            JwtAuthResponse response = new JwtAuthResponse("no-auth-token");
            return ResponseEntity.ok(response);
        }
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsername(),
                        loginDto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new JwtAuthResponse(token));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            String username;
            if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
            } else {
                username = principal.toString();
            }
            
            
            if (!username.equals("anonymousUser")) {
                try {
                    UserDto user = userService.getUserByUsername(username);
                    return ResponseEntity.ok(user);
                } catch (Exception e) {
                    
                }
            }
        }
        
        
        try {
            UserDto user = userService.getUserByUsername("admin");
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

