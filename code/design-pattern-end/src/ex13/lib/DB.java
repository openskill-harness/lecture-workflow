package ex13.lib;

public interface DB {
    void setUrl(String url);
    int execute(String sql);
}
