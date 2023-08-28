package org.example.controllers;

import lombok.AllArgsConstructor;
import org.example.dto.category.CategoryCreateDTO;
import org.example.dto.category.CategoryItemDTO;
import org.example.entities.CategoryEntity;
import org.example.mappers.CategoryMapper;
import org.example.repositories.CategoryRepository;
import org.example.storage.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@AllArgsConstructor
public class CategoryController {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final StorageService storageService;
    @GetMapping("/")
    public ResponseEntity<List<CategoryItemDTO>> index() {
        var result = categoryMapper.listCategoriesToItemDTO(categoryRepository.findAll());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping(value = "/category", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CategoryEntity create(@ModelAttribute CategoryCreateDTO dto) {
        var fileName = storageService.saveMultipartFile(dto.getImage());
        CategoryEntity cat = CategoryEntity
                .builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .image(fileName)
                .build();
        categoryRepository.save(cat);
        return cat;
    }
}
