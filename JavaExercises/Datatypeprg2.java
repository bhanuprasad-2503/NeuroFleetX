public class Datatypeprg2 {
    public static void main(String[] args) {

        byte b = 10;
        short s = 20;
        int i = 30;
        long l = 40000L;
        float f = 5.5f;
        double d = 10.25;
        char c = 'A';  
        boolean flag = true;
       int sumInt = b + s + i;
        long totalLong = l + i;
        double totalDouble = d + f;
        int charAdd = c + 5; 
        System.out.println("Byte value: " + b);
        System.out.println("Short value: " + s);
        System.out.println("Int value: " + i);
        System.out.println("Long value: " + l);
        System.out.println("Float value: " + f);
        System.out.println("Double value: " + d);
        System.out.println("Char value: " + c);
        System.out.println("Boolean value: " + flag);
        System.out.println("\n--- Arithmetic Operations ---");
        System.out.println("Sum of (byte + short + int): " + sumInt);
        System.out.println("Sum of (long + int): " + totalLong);
        System.out.println("Sum of (float + double): " + totalDouble);
        System.out.println("Character Arithmetic (A + 5): " + charAdd);
        System.out.println("Boolean check (flag == true): " + (flag == true));
    }
}

