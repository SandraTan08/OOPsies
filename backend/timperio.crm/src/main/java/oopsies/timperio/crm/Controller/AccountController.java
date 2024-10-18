package oopsies.timperio.crm.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

import oopsies.timperio.crm.Service.AccountService;
import oopsies.timperio.crm.Account;  // Import your Account entity

@RestController
@RequestMapping("/api/v1/account")

public class AccountController {
    @Autowired
    private AccountService accountService;

    // Get all accounts
    @GetMapping
    public ResponseEntity<List<Account>> allAccounts() {
        return new ResponseEntity<>(accountService.allAccounts(), HttpStatus.OK);
    }

    // Get account by ID
    @GetMapping("/{accountID}")
    public ResponseEntity<Account> getAccountById(@PathVariable("accountID") String accountID) {
        Optional<Account> account = accountService.getAccountById(accountID);
        if (account.isPresent()) {
            return new ResponseEntity<>(account.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Create a new account
    @PostMapping("/new_account")
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        Account newAccount = accountService.createAccount(account);
        return new ResponseEntity<>(newAccount, HttpStatus.CREATED);
    }

    // Delete account by ID
    @DeleteMapping("/{accountID}")
    public ResponseEntity<Void> deleteAccount(@PathVariable("accountID") String accountID) {
        boolean deleted = accountService.deleteAccount(accountID);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{accountID}")
    public ResponseEntity<Account> updateAccount(@PathVariable("accountID") String accountID, @RequestBody Account account) {
        Optional<Account> existingAccount = accountService.getAccountById(accountID);
        
        if (existingAccount.isPresent()) {
            Account updatedAccount = accountService.updateAccount(accountID, account);
            return new ResponseEntity<>(updatedAccount, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
