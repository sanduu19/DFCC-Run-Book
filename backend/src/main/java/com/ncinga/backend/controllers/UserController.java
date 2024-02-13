package com.ncinga.backend.controllers;

import com.ncinga.backend.dtos.LdapUser;
import com.ncinga.backend.dtos.UserDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.naming.*;
import javax.naming.directory.*;
import java.net.http.HttpResponse;
import java.util.Hashtable;

@RestController
@RequestMapping(path = "/user")
@CrossOrigin(origins = "*")
public class UserController {
    @PostMapping(path = "/login")
    String login(@RequestBody UserDto user){
        LdapUser ldapUser=ldapLogin(user);
        if(ldapUser.getEmail()!=null && !ldapUser.getEmail().isEmpty()){//auth pass
            return ldapUser.getEmail();
        }else{//error
             return "INVALID_AUTH";
        }
    }


    @Value( "${ldap.urls}" )
    private String ldapUrl;

    @Value( "${ldap.base}" )
    private String base;

    public  LdapUser ldapLogin(UserDto user) {
        LdapUser ldapUser=new LdapUser();
        Hashtable env = new Hashtable();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
        env.put(Context.PROVIDER_URL, ldapUrl);
        env.put(Context.SECURITY_AUTHENTICATION, "simple");
        env.put(Context.SECURITY_PRINCIPAL, "DFCCNET\\"+user.username());
        env.put(Context.SECURITY_CREDENTIALS, user.password());
        System.out.println("test 2");
        try {
            DirContext ctx = new InitialDirContext(env);
            System.out.println("connected");
            System.out.println(ctx.getEnvironment());
            String searchBase = base;
            String searchFilter = "(sAMAccountName="+user.username()+")";
            SearchControls searchControls = new SearchControls();
            searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);
            NamingEnumeration<SearchResult> results = ctx.search(searchBase, searchFilter, searchControls);
            while (results.hasMore()) {
                SearchResult searchResult = results.next();
                Attributes attributes = searchResult.getAttributes();
                Attribute userPrincipalName = attributes.get("userPrincipalName");
                Attribute name = attributes.get("name");
                System.out.println("userPrincipalName: " + (userPrincipalName != null ? userPrincipalName.get() : ""));
                System.out.println("name: " + (name != null ? name.get() : ""));
                ldapUser.setEmail((userPrincipalName != null ? userPrincipalName.get().toString() : ""));
                ldapUser.setDisplayName((name != null ? name.get().toString() : ""));
            }
            ctx.close();
        } catch (AuthenticationNotSupportedException ex) {
            ex.printStackTrace();
        } catch (AuthenticationException ex) {
            ex.printStackTrace();
        } catch (NamingException ex) {
            ex.printStackTrace();
        }catch (Exception ex) {
            ex.printStackTrace();
        }
        return ldapUser;
    }
}
