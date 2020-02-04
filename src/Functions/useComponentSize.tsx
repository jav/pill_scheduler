import { useCallback, useState } from 'react';

interface Size {
    width: number;
    height: number;
}

interface LayoutEventEvent {
    nativeEvent: {
        layout: {
            width: number,
            height: number,
            x: number,
            y: number
        }
    }
}

export const useComponentSize = (defaultSize: Size): [Size, (LayoutEventEvent) => void] => {
    const [size, setSize] = useState(defaultSize);

    const onLayout = useCallback((event: LayoutEventEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setSize({ width, height });
    }, []);

    return [size, onLayout];
};

