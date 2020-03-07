package org.ubillos.pushnotifications.notificationsSDK;

public class ExpoMessageSound {
    boolean critical = false;
    String name = "default";
    long volume = -1;

    ExpoMessageSound() {

    }

    ExpoMessageSound(boolean _critical, String _name, long _volume) {
        critical = _critical;
        name = _name;
        volume = _volume;
    }
}
