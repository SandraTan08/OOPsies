package oopsies.timperio.crm.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import oopsies.timperio.crm.Service.AccountService;
import oopsies.timperio.crm.Account;  // Import your Product entity

@RestController
@RequestMapping("/api/v1/account")
// @CrossOrigin(origins = "http://localhost:3000") 

public class AccountController {
    @Autowired
    private AccountService accountService;

    @GetMapping
    public ResponseEntity<List<Account>> allAccounts() {
        return new ResponseEntity<>(accountService.allAccounts(), HttpStatus.OK);
    }
}
