package oopsies.timperio.crm.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import oopsies.timperio.crm.Service.PurchaseHistoryService;
import oopsies.timperio.crm.PurchaseHistory;

@RestController
@RequestMapping("/api/v1/purchaseHistory")
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // Allow CORS from localhost:3000
public class PurchaseHistoryController {
    @Autowired
    private PurchaseHistoryService purchaseHistoryService;

    // Existing endpoint to get all purchase history
    @GetMapping
    public ResponseEntity<List<PurchaseHistory>> allPurchaseHistory() {
        return new ResponseEntity<>(purchaseHistoryService.allPurchaseHistory(), HttpStatus.OK);
    }

    // New endpoint to get purchase history by customerId
    @GetMapping("/byCustomer")
    public ResponseEntity<List<PurchaseHistory>> getPurchaseHistoryByCustomerId(@RequestParam Long customerId) {
        List<PurchaseHistory> purchaseHistories = purchaseHistoryService.findByCustomerId(customerId);
        return new ResponseEntity<>(purchaseHistories, HttpStatus.OK);
    }
}
