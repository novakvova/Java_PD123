package org.example.dto.product;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

//Загрузка фото на сервак в описі
@Data
public class DescriptionImageDTO {
    private MultipartFile image;
}
