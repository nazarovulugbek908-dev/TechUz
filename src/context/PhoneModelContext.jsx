import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { mockPhoneModels } from '../data/mockPhoneModels';

const PhoneModelContext = createContext();
const PHONE_MODEL_STORAGE_KEY = 'techuz_selected_phone_model';

export function PhoneModelProvider({ children }) {
  const [selectedModelId, setSelectedModelId] = useState(() => {
    return storage.get(PHONE_MODEL_STORAGE_KEY, null);
  });

  const [selectedModel, setSelectedModel] = useState(() => {
    if (!selectedModelId) return null;
    return mockPhoneModels.find((m) => m.id === selectedModelId) || null;
  });

  useEffect(() => {
    if (selectedModelId) {
      storage.set(PHONE_MODEL_STORAGE_KEY, selectedModelId);
      const found = mockPhoneModels.find((m) => m.id === selectedModelId) || null;
      setSelectedModel(found);
    } else {
      storage.remove(PHONE_MODEL_STORAGE_KEY);
      setSelectedModel(null);
    }
  }, [selectedModelId]);

  const selectModel = (modelId) => {
    setSelectedModelId(modelId);
  };

  const clearModel = () => {
    setSelectedModelId(null);
  };

  /**
   * Helper to check if a specific product is compatible with current selected phone
   */
  const checkCompatibility = (product) => {
    if (!selectedModelId || !product) return { isChecked: false, isCompatible: true };

    // If product is smartphone
    if (product.category === 'smartphones') {
      const match = product.slug.includes(selectedModelId) || product.id.includes(selectedModelId);
      return { isChecked: true, isCompatible: match };
    }

    // If product is an accessory
    if (Array.isArray(product.compatibleModels)) {
      const match = product.compatibleModels.includes(selectedModelId);
      return { isChecked: true, isCompatible: match };
    }

    // Universal items
    return { isChecked: true, isCompatible: true };
  };

  return (
    <PhoneModelContext.Provider
      value={{
        selectedModelId,
        selectedModel,
        selectModel,
        clearModel,
        hasSelectedModel: !!selectedModelId,
        checkCompatibility
      }}
    >
      {children}
    </PhoneModelContext.Provider>
  );
}

export function usePhoneModel() {
  const context = useContext(PhoneModelContext);
  if (!context) {
    throw new Error('usePhoneModel must be used within a PhoneModelProvider');
  }
  return context;
}
