package oopsies.timperio.crm.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import oopsies.timperio.crm.Service.ProductService;
import oopsies.timperio.crm.Product;  // Import your Product entity

@RestController
@RequestMapping("/api/v1/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Endpoint to get all products
    @GetMapping
    public ResponseEntity<List<Product>> allProducts() {
        List<Product> products = productService.allProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Endpoint to get a product by its ID
    @GetMapping("/byProduct")
    public ResponseEntity<Product> getProductById(@RequestParam Long productId) {
        Optional<Product> product = productService.getProductById(productId);
        return product.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
