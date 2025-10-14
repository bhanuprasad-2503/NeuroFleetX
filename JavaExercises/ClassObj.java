
class Student {
    String name;
    int age;

    void display() {
        System.out.println("Student Name: " + name);
        System.out.println("Student Age: " + age);
        System.out.println("-------------------------");
    }
}

public class ClassObj {
    public static void main(String[] args) {
        Student s1 = new Student();
        s1.name = "Bhanu";
        s1.age = 21;

        Student s2 = new Student();
        s2.name = "Ravi";
        s2.age = 22;

        s1.display();
        s2.display();
    }
}
