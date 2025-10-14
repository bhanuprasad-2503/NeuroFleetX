class Arrayprg3{
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30, 40, 50};  // array initialization
        int sum = 0;  // to store total

        System.out.println("Array elements are:");
        for (int i = 0; i < numbers.length; i++) {
            System.out.println(numbers[i]);
            sum = sum + numbers[i];  // adding elements one by one
        }

        System.out.println("Sum of all elements = " + sum);
    }
}