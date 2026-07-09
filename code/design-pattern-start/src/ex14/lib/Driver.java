package ex14.lib;

public enum Driver {
    ORACLE("oracle"),
    MARIA("maria");

    private final String protocol;

    Driver(String protocol) {
        this.protocol = protocol;
    }

    public String getProtocol(){
        return protocol;
    }
}
