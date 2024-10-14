package oopsies.timperio.crm.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import oopsies.timperio.crm.PurchaseHistory;
import oopsies.timperio.crm.Repository.PurchaseHistoryRepository;

@Service
public class PurchaseHistoryService {

    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    public List<PurchaseHistory> allPurchaseHistory() {
        return purchaseHistoryRepository.findAll();
    }

    // New method to get purchase history by customerId
    public List<PurchaseHistory> findByCustomerId(Long customerId) {
        return purchaseHistoryRepository.findByCustomerId(customerId);
    }
}
