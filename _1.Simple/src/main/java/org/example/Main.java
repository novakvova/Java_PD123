package org.example;

import java.util.Scanner;

// Press Shift twice to open the Search Everywhere dialog and type `show whitespaces`,
// then press Enter. You can now see whitespace characters in your code.
public class Main {
    public static void main(String[] args) {
        //if, else, for, while, for
        System.out.println("Вкажіть значення a:");
        int a=10;
        Scanner in = new Scanner(System.in);
        a=Integer.parseInt(in.nextLine());
        System.out.println("a = "+ a);
    }
}