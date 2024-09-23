package oopsies.timperio.crm.Service;


import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import oopsies.timperio.crm.Repository.ProductRepository;
import oopsies.timperio.crm.Product; 

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;

    public List<Product> allProducts(){
        return productRepository.findAll();
    }
}
