package oopsies.timperio.crm.Service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import oopsies.timperio.crm.Repository.AccountRepository;
import oopsies.timperio.crm.Account;

@Service
public class AccountService {
    
    @Autowired
    private AccountRepository accountRepository;

    // Fetch all accounts
    public List<Account> allAccounts() {
        return accountRepository.findAll();
    }
    
    // Get account by ID
    public Optional<Account> getAccountById(String accountID) {
        return accountRepository.findById(accountID);
    }

    // Create a new account
    public Account createAccount(Account account) {
        try {
            return accountRepository.save(account);
        } catch (Exception e) {
            // Log the error and throw a new exception
            System.out.println("Error saving account: " + e.getMessage());
            throw e; // Rethrow the exception to be caught by the global handler
        }
    }
    

    // Delete account by ID
    public boolean deleteAccount(String accountID) {
        Optional<Account> account = accountRepository.findById(accountID);
        if (account.isPresent()) {
            accountRepository.deleteById(accountID);
            return true;
        } else {
            return false;
        }
    }
}
