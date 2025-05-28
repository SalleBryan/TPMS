package com.tpms.demo;

public class ExceptionDemo {
    public static void main(String[] args) {
        int a = 10;
        int b = 0;

        try {
            int result = a/b; // This will cause an ArithmeticException
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.out.println("Error: Division by zero is not allowed.");
        } finally {
            System.out.println("Finished Division attempt.");
        }
    }
}
