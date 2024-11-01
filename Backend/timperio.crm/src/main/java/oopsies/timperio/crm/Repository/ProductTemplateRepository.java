package oopsies.timperio.crm.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import oopsies.timperio.crm.ProductTemplate;

@Repository
public interface ProductTemplateRepository extends JpaRepository<ProductTemplate, Long> {
}