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

    public List<Account> allAccounts(){
        List<Account> accounts = accountRepository.findAll();
        System.out.println("Fetched accounts: " + accounts); // Debug log
        return accounts;
    }
    
    public Optional<Account> getAccountById(String accountID) {
        return accountRepository.findById(accountID);
    }
}
