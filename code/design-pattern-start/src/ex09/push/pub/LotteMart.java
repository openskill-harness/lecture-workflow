package ex09.push.pub;

import ex09.push.sub.Customer;

import java.util.ArrayList;
import java.util.List;

public class LotteMart implements Mart{

    private List<Customer> customerList = new ArrayList<>(); // 구독자 명단

    @Override
    public void add(Customer customer) {
        // TODO: 구독자 명단(customerList)에 customer를 추가하세요
    }

    @Override
    public void remove(Customer customer) {
        // TODO: 구독자 명단(customerList)에서 customer를 제거하세요
    }

    @Override
    public void received() {
        for (int i = 0; i < 5; i++) {
            System.out.println(".");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
        // ....알림
        notify("LotteMart : 바나나");
    }

    @Override
    public void notify(String msg) {
        // TODO: 모든 구독자에게 update(msg)를 호출하세요
    }
}
