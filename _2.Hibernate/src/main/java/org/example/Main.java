package org.example;

import org.example.entities.User;
import org.example.utils.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

import java.util.Scanner;

// Press Shift twice to open the Search Everywhere dialog and type `show whitespaces`,
// then press Enter. You can now see whitespace characters in your code.
public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        SessionFactory sf = HibernateUtil.getSessionFactory();
        try(Session context = sf.openSession()) {
            Transaction tx = context.beginTransaction();
            User user = new User();
            user.setFirstName("Вова");
            user.setLastName("Новак");
            user.setEmail("novakvova@gmail.com");
            user.setPassword("123456");
            user.setPhone("+38098 889 73 24");
            context.save(user);
            tx.commit();
            System.out.println("Add new User id = "+ user.getId());
        }
    }
}