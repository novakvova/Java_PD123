package org.example.controllers;

import lombok.AllArgsConstructor;
import org.example.dto.product.ProductCreateDTO;
import org.example.entities.ProductEntity;
import org.example.entities.ProductImageEntity;
import org.example.mappers.ProductMapper;
import org.example.repositories.ProductImageRepository;
import org.example.repositories.ProductRepository;
import org.example.storage.StorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@AllArgsConstructor
@RequestMapping("api/products")
public class ProductController {
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductMapper productMapper;
    private final StorageService storageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductEntity> create(@ModelAttribute ProductCreateDTO dto) {
        var p = productMapper.productByCreateProductDTO(dto);
        productRepository.save(p);
        for(MultipartFile image : dto.getImages()) {
            String fileName = storageService.saveThumbnailator(image);
            var pi = new ProductImageEntity();
            pi.setName(fileName);
            pi.setProduct(p);
            productImageRepository.save(pi);
            p.getImages().add(pi);
        }
        return ResponseEntity.ok().body(p);
    }

}
