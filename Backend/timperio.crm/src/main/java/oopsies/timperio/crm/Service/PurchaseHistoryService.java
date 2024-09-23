package oopsies.timperio.crm.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import oopsies.timperio.crm.Repository.PurchaseHistoryRepository;
import oopsies.timperio.crm.PurchaseHistory;

@Service
public class PurchaseHistoryService {

    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    public List<PurchaseHistory> allPurchaseHistory() {
        return purchaseHistoryRepository.findAll();
    }
}
