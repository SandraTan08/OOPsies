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
    public List<PurchaseHistory> findByCustomerId(Integer customerId) {
        return purchaseHistoryRepository.findByCustomerId(customerId);
    }

    // New method to calculate total price for a specific customer
    public double getTotalPriceByCustomerId(Integer customerId) {
        List<PurchaseHistory> histories = findByCustomerId(customerId);
        return histories.stream()
                        .mapToDouble(PurchaseHistory::getTotalPrice) // Assuming getTotalPrice() returns the price for each entry
                        .sum();
    }
}
