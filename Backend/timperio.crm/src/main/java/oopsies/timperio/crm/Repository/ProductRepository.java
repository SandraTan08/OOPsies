package oopsies.timperio.crm.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import oopsies.timperio.crm.Product;  // Import your Product entity

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}
