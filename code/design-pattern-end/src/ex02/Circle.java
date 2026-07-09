package ex02;

public class Circle extends Shape {

    private double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double 넓이() {
        return radius * radius * 3.14;
    }
}
