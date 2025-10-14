class Arrayprg2 {
    public static void main(String[] args) {
        int[] data = {45, 20, 10, 35, 25};  // array of numbers
        int smallest = data[0];  // assume first element is smallest

        System.out.println("Array elements are:");
        for (int i = 0; i < data.length; i++) {
            System.out.println(data[i]);
            if (data[i] < smallest) {
                smallest = data[i];  // update if smaller number is found
            }
        }

        System.out.println("Smallest element in the array = " + smallest);
    }
}