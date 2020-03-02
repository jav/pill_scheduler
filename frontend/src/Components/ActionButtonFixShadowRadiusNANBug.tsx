import React from 'react';
import { ActionButton } from 'react-native-material-ui';

export const ActionButtonFixShadowRadiusNANBug = (props) => {

    let overriddenProps = props;

    if (typeof overriddenProps !== 'object') {
        overriddenProps = {};
    }
    if (!('style' in overriddenProps) || typeof overriddenProps.style !== 'object') {
        overriddenProps = {
            ...overriddenProps,
            style: {}
        };
    }

    if (!('container' in overriddenProps.style) || typeof overriddenProps.style.container !== 'object') {
        overriddenProps = {
            ...overriddenProps,
            style: { ...overriddenProps.style, container: {} }
        };
    }

    if (!('shadowRadius' in overriddenProps.style.container) || typeof overriddenProps.style.container.shadowRadius !== 'number') {
        overriddenProps = {
            ...overriddenProps,
            style: {
                ...overriddenProps.style,
                container: {
                    ...overriddenProps.style.container,
                    shadowRadius: 5
                }
            }
        };
    }

    return (<ActionButton {...overriddenProps} />);
}