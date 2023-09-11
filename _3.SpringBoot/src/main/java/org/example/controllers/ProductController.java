package org.example.controllers;

import lombok.AllArgsConstructor;
import org.example.dto.product.DescriptionImageDTO;
import org.example.dto.product.ProductCreateDTO;
import org.example.dto.product.ProductItemDTO;
import org.example.dto.product.ProductUpdateDTO;
import org.example.entities.ProductEntity;
import org.example.entities.ProductImageEntity;
import org.example.mappers.ProductMapper;
import org.example.repositories.ProductImageRepository;
import org.example.repositories.ProductRepository;
import org.example.storage.StorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    @PostMapping(value = "upload",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> upload(@ModelAttribute DescriptionImageDTO dto) {
        String fileName = storageService.saveThumbnailator(dto.getImage());
        return ResponseEntity.ok().body(fileName);
    }

    @PutMapping(value = "{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductEntity> updateProduct(@PathVariable int id, @ModelAttribute ProductUpdateDTO dto) {
        Optional<ProductEntity> existingProduct = productRepository.findById(id);

        if (existingProduct.isPresent()) {
            ProductEntity product = productMapper.productByUpdateProductDTO(dto);
            product.setId(id);

            for (ProductImageEntity existingImage : existingProduct.get().getImages()) {
                storageService.removeFile(existingImage.getName());
                productImageRepository.deleteById(existingImage.getId());
            }

            for (MultipartFile image : dto.getImages()) {
                String fileName = storageService.saveThumbnailator(image);
                ProductImageEntity productImage = new ProductImageEntity();
                productImage.setName(fileName);
                productImage.setProduct(product);
                product.getImages().add(productImage);
            }

            productRepository.save(product);
            return ResponseEntity.ok().body(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("{id}")
    public ResponseEntity<ProductItemDTO> getProduct(@PathVariable int id) {
        return productRepository.findById(id)
                .map(product -> ResponseEntity.ok().body(productMapper.productToItemDTO(product)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping()
    public ResponseEntity<List<ProductItemDTO>> getAllCategories() {
        return ResponseEntity.ok(productMapper.listProductsToItemDTO(productRepository.findAll()));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable int id) {
        Optional<ProductEntity> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            ProductEntity product = optionalProduct.get();
            List<ProductImageEntity> productImages = product.getImages();
            for (ProductImageEntity productImage : productImages) {
                storageService.removeFile(productImage.getName());
            }
            productRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
