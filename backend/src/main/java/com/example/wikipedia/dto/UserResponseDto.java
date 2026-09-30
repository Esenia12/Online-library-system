package com.example.wikipedia.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
    private Set<RoleDto> roles;
}
