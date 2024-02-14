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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    @Value( "${ldap.group}" )
    private String authGroup;


    @Value( "${ldap.whitelist}" )
    private String whiteList;

    public  LdapUser ldapLogin(UserDto user) {
        LdapUser ldapUser=new LdapUser();
        Hashtable env = new Hashtable();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
        env.put(Context.PROVIDER_URL, ldapUrl);
        env.put(Context.SECURITY_AUTHENTICATION, "simple");
        env.put(Context.SECURITY_PRINCIPAL, "DFCCNET\\"+user.username());
        env.put(Context.SECURITY_CREDENTIALS, user.password());
        env.put(Context.REFERRAL, "ignore");
        DirContext ctx=null;
        try {
            ctx = new InitialDirContext(env);
            System.out.println(" ********** connected ************");
            String searchBase = base;
            String searchFilter = "(sAMAccountName="+user.username()+")";
            SearchControls searchControls = new SearchControls();
            searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);
            NamingEnumeration<SearchResult> results = ctx.search(searchBase, searchFilter, searchControls);
            String whiteListEmail[]=whiteList.split("\\,");
            boolean authorizedUser=false;
            while (results.hasMore()) {
                SearchResult searchResult = results.next();
                Attributes attributes = searchResult.getAttributes();
                Attribute userPrincipalName = attributes.get("userPrincipalName");
                Attribute name = attributes.get("name");
                Attribute distinguishedName = attributes.get("distinguishedName");
                System.out.println("userPrincipalName: " + (userPrincipalName != null ? userPrincipalName.get() : ""));
                System.out.println("name: " + (name != null ? name.get() : ""));
                for(int i=0;i<whiteListEmail.length;i++) {
                    if (whiteListEmail[i].equalsIgnoreCase(userPrincipalName.get().toString())){
                        authorizedUser =true;
                        break;
                    }
                }
                Pattern pattern = Pattern.compile("OU=([^,]+)");
                Matcher matcher = pattern.matcher(distinguishedName.get().toString());
                while (matcher.find()) {
                   String ar[]=matcher.group().split("\\=");
                    System.out.println(ar[0]);
                    System.out.println(ar[1]);
                    if(ar[1].equalsIgnoreCase(authGroup)){
                        authorizedUser =true;
                        break;
                    }
                }

                if(authorizedUser){
                    System.out.println(" ********** find as authorized  User ************");
                    ldapUser.setEmail((userPrincipalName != null ? userPrincipalName.get().toString() : ""));
                    ldapUser.setDisplayName((name != null ? name.get().toString() : ""));
                }

            }
        } catch (AuthenticationNotSupportedException ex) {
            ex.printStackTrace();
        } catch (AuthenticationException ex) {
            ex.printStackTrace();
        } catch (NamingException ex) {
            ex.printStackTrace();
        }catch (Exception ex) {
            ex.printStackTrace();
        }finally {
            try {
                if(ctx!=null){
                    ctx.close();
                    System.out.println(" ********** connection closed ************");
                }
            } catch (NamingException e) {
                e.printStackTrace();
            }
        }
        return ldapUser;
    }
}
