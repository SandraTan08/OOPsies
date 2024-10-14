package oopsies.timperio.crm.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import oopsies.timperio.crm.Repository.ProductRepository;
import oopsies.timperio.crm.Product;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;

    // Method to retrieve all products
    public List<Product> allProducts() {
        return productRepository.findAll();
    }

    // Method to get a product by its ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
}
