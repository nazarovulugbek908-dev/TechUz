import React, { useState, useEffect } from 'react';
import { usePhoneModel } from '../../context/PhoneModelContext';
import { useLanguage } from '../../context/LanguageContext';
import { phoneModelService } from '../../services/phoneModelService';
import { Modal } from './Modal';
import { Button } from './Button';
import { Smartphone, Check, Search, X, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function PhoneModelSelector({
  variant = 'badge',
  className = '',
  isOpen: externalIsOpen,
  onClose: externalOnClose
}) {
  const { selectedModel, selectedModelId, selectModel, clearModel, hasSelectedModel } = usePhoneModel();
  const { t } = useLanguage();

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isModalOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleOpenModal = () => {
    setInternalIsOpen(true);
  };

  const handleCloseModal = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { data: modelsData } = await phoneModelService.getPhoneModels({
        search: searchQuery,
        brand: selectedBrand
      });
      const { data: brandsData } = await phoneModelService.getBrands();
      setModels(modelsData || []);
      setBrands(brandsData || []);
    }
    loadData();
  }, [searchQuery, selectedBrand]);

  const handleSelect = (modelId) => {
    selectModel(modelId);
    handleCloseModal();
  };

  const handleClear = () => {
    clearModel();
    handleCloseModal();
  };

  return (
    <>
      {/* Trigger button */}
      {variant === 'header' && (
        <button
          type="button"
          onClick={handleOpenModal}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
            hasSelectedModel
              ? 'bg-orange-50 border-orange-200 text-[#FF7A00] dark:bg-orange-950/40 dark:border-orange-800'
              : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300',
            className
          )}
        >
          <Smartphone className={cn('w-4 h-4', hasSelectedModel ? 'text-[#FF7A00]' : 'text-slate-500')} />
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              {t('phone_model.my_model')}
            </span>
            <span className="truncate max-w-[130px] font-bold">
              {selectedModel ? selectedModel.name : t('phone_model.select_device')}
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
        </button>
      )}

      {variant === 'badge' && (
        <button
          type="button"
          onClick={handleOpenModal}
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs max-w-full overflow-hidden',
            hasSelectedModel
              ? 'bg-[#FF7A00] text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-orange-300',
            className
          )}
        >
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate max-w-[140px] sm:max-w-none">{selectedModel ? selectedModel.name : t('phone_model.select_device')}</span>
          {hasSelectedModel && <Check className="w-3.5 h-3.5 shrink-0" />}
        </button>
      )}

      {variant === 'banner' && (
        <div
          className={cn(
            'flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl border',
            hasSelectedModel
              ? 'bg-orange-50/80 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900/40'
              : 'bg-slate-50 border-slate-200 dark:bg-slate-800/60 dark:border-slate-700',
            className
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF7A00] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {hasSelectedModel ? t('phone_model.showing_compatible_for') : t('phone_model.select_prompt')}
              </p>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {hasSelectedModel ? selectedModel.name : t('phone_model.select_device')}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
            {hasSelectedModel && (
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-slate-500">
                <X className="w-3.5 h-3.5 mr-1" />
                {t('phone_model.clear_model')}
              </Button>
            )}
            <Button
              variant={hasSelectedModel ? 'outline' : 'primary'}
              size="sm"
              onClick={handleOpenModal}
              className="w-full sm:w-auto"
            >
              {hasSelectedModel ? t('phone_model.change_model') : t('phone_model.select_device')}
            </Button>
          </div>
        </div>
      )}

      {/* Model Selection Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={t('phone_model.select_device')}
        maxWidth="max-w-xl"
      >
        <div className="flex flex-col gap-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('phone_model.search_model_placeholder')}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-[#FF7A00]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label={t('catalog.clear_filters')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Brand Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedBrand('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer',
                selectedBrand === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              )}
            >
              {t('phone_model.all_models')}
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrand(brand)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer',
                  selectedBrand === brand
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                )}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
            {models.length === 0 ? (
              <div className="col-span-2 py-8 text-center text-slate-400 text-sm">
                {t('phone_model.not_found')}
              </div>
            ) : (
              models.map((model) => {
                const isSelected = selectedModelId === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => handleSelect(model.id)}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer',
                      isSelected
                        ? 'bg-orange-50 border-[#FF7A00] text-[#FF7A00] dark:bg-orange-950/40'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-orange-300 hover:bg-orange-50/30'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Smartphone className={cn('w-4 h-4', isSelected ? 'text-[#FF7A00]' : 'text-slate-400')} />
                      <div>
                        <span>{model.name}</span>
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {model.brand} • {model.releaseYear}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#FF7A00] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            {hasSelectedModel ? (
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-slate-500">
                {t('phone_model.clear_model')}
              </Button>
            ) : (
              <span className="text-xs text-slate-400">{models.length} {t('phone_model.available_models_count')}</span>
            )}
            <Button variant="secondary" size="sm" onClick={handleCloseModal}>
              {t('common.close')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
