package com.example.wikipedia.service;

import com.example.wikipedia.dto.UserCreateDto;
import com.example.wikipedia.dto.UserDto;
import com.example.wikipedia.dto.UserUpdateDto;
import java.util.List;

public interface UserService {
    UserDto createUser(UserCreateDto userDto);

    UserDto getUserById(Long id);

    UserDto getUserByUsername(String username);

    List<UserDto> getAllUsers();

    UserDto updateUser(Long id, UserUpdateDto userDto);

    void deleteUser(Long id);
}
