class Arrayprg1 {
    public static void main(String[] args) {
        int[] data = {15, 25, 5, 40, 30};  
        int largest = data[0];  

        System.out.println("Array elements are:");
        for (int i = 0; i < data.length; i++) {
            System.out.println(data[i]);
            if (data[i] > largest) {
                largest = data[i];  
            }
        }

        System.out.println("Largest element in the array = " + largest);
    }
}
