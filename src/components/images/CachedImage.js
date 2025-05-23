import React, { useState, useEffect } from 'react';
import { checkLinkType } from '../../utils/helper';
import { TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

FastImage.clearDiskCache();
FastImage.clearMemoryCache();

const CachedImage = ({ uri, requireSource, resizeMode = "contain", style, onPress, onLongPress, enable = true }) => {
    const [localUri, setLocalUri] = useState(null);

    useEffect(() => {
        const loadImage = async () => {
            if (uri)
                setLocalUri(checkLinkType(uri));
            else
                setLocalUri(null)
        };
        loadImage();
    }, [uri, requireSource]);

    if (!enable) return <View />
    return (
        <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
            <FastImage
                source={(localUri || uri) ? { uri: localUri || uri, priority: 'low', cache: 'immutable' } : (requireSource || require('../../assets/images/noimage.png'))}
                style={style}
                resizeMode={resizeMode}
            />
        </TouchableOpacity>
    )
};

export default CachedImage;