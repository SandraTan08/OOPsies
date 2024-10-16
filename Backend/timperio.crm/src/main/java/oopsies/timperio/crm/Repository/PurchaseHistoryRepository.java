package oopsies.timperio.crm.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import oopsies.timperio.crm.PurchaseHistory;

public interface PurchaseHistoryRepository extends JpaRepository<PurchaseHistory, Long> {

    // Custom query method to find by customerId
    List<PurchaseHistory> findByCustomerId(Long customerId);
}
