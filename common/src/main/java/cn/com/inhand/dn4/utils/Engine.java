package cn.com.inhand.dn4.utils;

public class Engine extends Thread {
    public String engineName;
    public boolean running = false;

    public Engine(String name) {
        super(name);
        setDaemon(true);
    }

    public boolean isRunning() {
        return running;
    }

    public void startup() {
        if (running == true) {
            return;
        } else {
            start();
            running = true;
        }
    }

    public void shutdown() {
        if (running == false) {
            return;
        } else {
            interrupt();
            running = false;
        }
    }

    public void sleep(int s) {
        try {
            Thread.sleep(s);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sleep() {
        try {
            Thread.sleep(1000);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void run() {
    }
}
