public class Datatypeprg3 {
    public static void main(String[] args) {
        byte b = 10;
        short s = 20;
        int i = 30;
        long l = 1000L;
        float f = 12.5f;
        double d = 99.99;
        char c = 'B';
        boolean bool = true;

        
        int sum = b + s + i; 
        double total = sum + l + f + d; 
        char nextChar = (char)(c + 2); 

        System.out.println("Sum of byte, short, int: " + sum);
        System.out.println("Total including long, float, double: " + total);
        System.out.println("Original char: " + c);
        System.out.println("Char after addition: " + nextChar);
        System.out.println("Boolean value: " + bool);
    }
}

