package com.ncinga.backend.controllers;

import com.ncinga.backend.dtos.UserDto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/user")
@CrossOrigin(origins = "*")
public class UserController {
    @PostMapping(path = "/login")
    String login(@RequestBody UserDto user){
        return user.username();
    }
}
