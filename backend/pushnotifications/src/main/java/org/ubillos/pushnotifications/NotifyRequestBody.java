package org.ubillos.pushnotifications;

import io.github.jav.exposerversdk.ExpoMessageSound;
import io.github.jav.exposerversdk.ExpoPushReceiept;

import java.util.List;
import java.util.Map;

public class NotifyRequestBody {
    public List<String> to = null;
    public String title = null;
    public String subtitle = null;
    public String body = null;
}
