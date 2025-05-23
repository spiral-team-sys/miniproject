// src/redux/store.ts

import { createStore } from 'react-redux';
import rootReducer from './reducers'; // Tệp root reducer của bạn
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import expireReducer from 'redux-persist-transform-expire';
import { KEYs } from './storageKeys';

// Cấu hình TTL (ví dụ: 3600 giây = 1 giờ)
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    transforms: [
        expireReducer(KEYs.TTLKey, {
            expireSeconds: 3600, // TTL (số giây)
            autoExpire: true,    // Tự động xoá khi hết hạn
        })
    ],
};

// Tạo persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store với reducer đã lưu trữ
const store = createStore(persistedReducer);

// Tạo persisted store
const persistor = persistStore(store);

export { store, persistor };
