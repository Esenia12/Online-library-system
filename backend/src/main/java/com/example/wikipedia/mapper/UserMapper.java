package com.example.wikipedia.mapper;

import com.example.wikipedia.domain.User;
import com.example.wikipedia.dto.UserCreateDto;
import com.example.wikipedia.dto.UserDto;
import com.example.wikipedia.dto.UserUpdateDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDto toDto(User user);

    User toEntity(UserDto userDto);

    User toEntity(UserCreateDto userDto);

    User toEntity(UserUpdateDto userDto);
}
